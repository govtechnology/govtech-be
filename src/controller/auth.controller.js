import bcryptjs from "bcryptjs";
import { generateToken, verifyToken } from "../lib/tokenHandler.js";
import { createHash } from "crypto";
import * as OTPAuth from "otpauth";
import { generateRandomBase32 } from "../lib/base32.js";
import { sqldb } from "../lib/dbConnector.js";
import { randomUUID as uuid } from "crypto";
import Session from "../models/session.js";

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
      const userId = uuid();
      const saltRounds = 12;
      const hashPassword = await bcryptjs.hash(password, saltRounds);

      const connection = await sqldb.getConnection();
      await connection.beginTransaction();

      try {
        await connection.query(
          "INSERT INTO user (id, email, role, password) VALUES (?, ?, ?, ?)",
          [userId, email, "USER", hashPassword]
        );

        await connection.query(
          "INSERT INTO profile (userId, id, name) VALUES (?, ?, ?)",
          [userId, uuid(), name]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({ success: true });
      } catch (error) {
        await connection.rollback();
        connection.release();
        res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(201).json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const [rows] = await sqldb.execute("SELECT * FROM user WHERE email = ?", [
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
        "INSERT INTO refresh_token (userId, id, token) VALUES (?, ?, ?)",
        [user.id, uuid(), md5Refresh]
      );

      await new Session(user.id, Session.CONVENTIONAL).build()
      .then((session) => session.start())
      .then((session) => session.revoke())
      .then((session) => session.persist())
      .then((session) => session.finish());

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
    const connection = await sqldb.getConnection();
    await connection.beginTransaction();

    try {
      const [userRows] = await connection.query(
        "SELECT * FROM user WHERE id = ?",
        [data.id]
      );
      const user = userRows[0];

      if (!user) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({
          status: "fail",
          message: "No user with that ID exists",
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

        await connection.query(
          "UPDATE user SET otp_auth_url = ?, otp_base32 = ? WHERE id = ?",
          [otpauth_url, base32_secret, user.id]
        );

        await connection.commit();
        connection.release();

        res.status(200).json({
          base32: base32_secret,
          otpauth_url,
        });
      } else {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          status: "fail",
          message: "User already has a generated QR",
        });
      }
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error("Error executing queries:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
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

    const connection = await sqldb.getConnection();
    await connection.beginTransaction();

    try {
      const [userRows] = await connection.query(
        "SELECT * FROM user WHERE id = ?",
        [data.id]
      );
      const user = userRows[0];

      if (!user) {
        await connection.rollback();
        connection.release();
        return res.status(401).json({
          status: "fail",
          message: "Token is invalid or user doesn't exist",
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
        await connection.rollback();
        connection.release();
        return res.status(401).json({
          status: "fail",
          message: "Token is invalid or user doesn't exist",
        });
      }

      await connection.query(
        "UPDATE user SET otp_enabled = ?, otp_verified = ? WHERE id = ?",
        [true, true, user.id]
      );

      await connection.commit();
      connection.release();

      res.status(200).json({
        otp_verified: true,
        user: {
          id: user.id,
          email: user.email,
          otp_enabled: true,
        },
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error("Error executing queries:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
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

    const connection = await sqldb.getConnection();
    await connection.beginTransaction();

    try {
      const [userRows] = await connection.query(
        "SELECT * FROM user WHERE id = ?",
        [userId]
      );
      const user = userRows[0];

      const message = "Token is invalid or user doesn't exist";
      if (!user) {
        await connection.rollback();
        connection.release();
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
        await connection.rollback();
        connection.release();
        return res.status(401).json({
          status: "fail",
          message,
        });
      }

      await connection.commit();
      connection.release();

      await new Session(user.id, Session.IBM_MFA).build()
      .then((session) => session.start())
      .then((session) => session.revoke())
      .then((session) => session.persist())
      .then((session) => session.finish());

      res.status(200).json({
        otp_valid: true,
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error("Error executing queries:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
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

    const connection = await sqldb.getConnection();
    await connection.beginTransaction();

    try {
      const [userRows] = await connection.query(
        "SELECT * FROM user WHERE id = ?",
        [data.id]
      );
      const user = userRows[0];

      if (!user) {
        await connection.rollback();
        connection.release();
        return res.status(401).json({
          status: "fail",
          message: "User doesn't exist",
        });
      }

      await connection.query(
        "UPDATE user SET otp_enabled = ?, otp_verified = ? WHERE id = ?",
        [false, false, user.id]
      );

      await connection.commit();
      connection.release();

      res.status(200).json({
        status: "success",
        otp_disabled: true,
        user: {
          id: user.id,
          email: user.email,
          otp_enabled: false,
        },
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error("Error executing queries:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
