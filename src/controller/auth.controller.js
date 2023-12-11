import bcryptjs from "bcryptjs";
import { generateToken, verifyToken } from "../lib/tokenHandler.js";
import { createHash } from "crypto";
import * as OTPAuth from "otpauth";
import { generateRandomBase32 } from "../lib/base32.js";
import { prisma, sqldb } from "../lib/dbConnector.js";

export * as authController from "../controller/auth.controller";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const [rows] = await sqldb.execute("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    const existingUsers = rows[0];

    if (existingUsers) {
      return res.status(400).json({
        status: 400,
        message: "Email sudah terpakai.",
      });
    } else {
      const saltRounds = 12;
      const hashPassword = await bcryptjs.hash(password, saltRounds);
      await sqldb.beginTransaction();

      const [userResult] = await sqldb.execute(
        "INSERT INTO users (email, role, password) VALUES (?, ?, ?)",
        [email, "USER", hashPassword]
      );
      const userId = userResult.insertId;

      await sqldb.execute("INSERT INTO profile (user_id, name) VALUES (?, ?)", [
        userId,
        name,
      ]);

      await sqldb.commit();

      res.status(201).json({ success: true });
    }
  } catch (error) {
    await sqldb.rollback();
    next(error);
  } finally {
    sqldb.end();
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const [rows] = await sqldb.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Pengguna tidak ditemukan",
      });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(422).json({
        status: 422,
        message: "Password salah!",
      });
    } else {
      const access_token = generateToken({ id: user.id });
      const refresh_token = generateToken({ id: user.id }, false);
      const md5Refresh = createHash("md5").update(refresh_token).digest("hex");

      await sqldb.execute(
        "INSERT INTO refresh_token (userId, token) VALUES (?, ?)",
        [user.id, md5Refresh]
      );

      res.json({
        status: 200,
        userId: user.id,
        access_token,
        refresh_token,
        ibmfa: {
          base32: user.otp_base32,
          enabled: user.otp_enabled,
          verified: user.otp_verified,
        },
      });
    }
  } catch (error) {
    next(error);
  } finally {
    sqldb.end();
  }
};

export const GenerateOTP = async (req, res) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);
    const user = await prisma.user.findUnique({ where: { id: data.id } });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user with that email exists",
      });
    }

    if (!user.otp_enabled && !user.otp_verified) {
      const base32_secret = generateRandomBase32();

      let totp = new OTPAuth.TOTP({
        issuer: "ngubalan.xyzuan.my.id",
        label: "NgubalanDaring.",
        algorithm: "SHA1",
        digits: 6,
        secret: base32_secret,
      });

      let otpauth_url = totp.toString();

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp_auth_url: otpauth_url,
          otp_base32: base32_secret,
        },
      });

      res.status(200).json({
        base32: base32_secret,
        otpauth_url,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "User already have generated QR",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const VerifyOTP = async (req, res) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);
    const { token } = req.body;

    const message = "Token is invalid or user doesn't exist";
    const user = await prisma.user.findUnique({ where: { id: data.id } });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message,
      });
    }

    let totp = new OTPAuth.TOTP({
      issuer: "ngubalan.xyzuan.my.id",
      label: "NgubalanDaring.",
      algorithm: "SHA1",
      digits: 6,
      secret: user.otp_base32,
    });

    let delta = totp.validate({ token });

    if (delta === null) {
      return res.status(401).json({
        status: "fail",
        message,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data: {
        otp_enabled: true,
        otp_verified: true,
      },
    });

    res.status(200).json({
      otp_verified: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        otp_enabled: updatedUser.otp_enabled,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const ValidateOTP = async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const message = "Token is invalid or user doesn't exist";
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message,
      });
    }
    let totp = new OTPAuth.TOTP({
      issuer: "ngubalan.xyzuan.my.id",
      label: "NgubalanDaring.",
      algorithm: "SHA1",
      digits: 6,
      secret: user.otp_base32,
    });

    let delta = totp.validate({ token, window: 1 });

    if (delta === null) {
      return res.status(401).json({
        status: "fail",
        message,
      });
    }

    res.status(200).json({
      otp_valid: true,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const DisableOTP = async (req, res) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);
    const user = await prisma.user.findUnique({ where: { id: data.id } });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User doesn't exist",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data: {
        otp_enabled: false,
        otp_verified: false,
      },
    });

    res.status(200).json({
      status: "success",
      otp_disabled: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        otp_enabled: updatedUser.otp_enabled,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
