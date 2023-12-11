import { sqldb } from "../lib/dbConnector";
import { verifyToken } from "../lib/tokenHandler";

export * as profileController from "../controller/profile.controller";

export const getUserProfile = async (req, res, next) => {
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
    const [profileRows] = await connection.query(
      "SELECT * FROM profile WHERE userId = ?",
      [data.id]
    );
    connection.release();

    const userProfile = profileRows[0];

    if (!userProfile) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      profile: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
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

    const { name, nik, alamat, tempatLahir, tanggalLahir } = req.body;
    const data = verifyToken(req.headers.access_token);

    const connection = await sqldb.getConnection();
    const [result] = await connection.query(
      "UPDATE profile SET name = ?, nik = ?, alamat = ?, tempatLahir = ?, tanggalLahir = ? WHERE userId = ?",
      [name, nik, alamat, tempatLahir, tanggalLahir, data.id]
    );
    connection.release();

    res.json({
      status: 200,
      message: "Profile updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    next(error);
  }
};
