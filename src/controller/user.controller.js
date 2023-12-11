import { sqldb } from "../lib/dbConnector";
import { verifyToken } from "../lib/tokenHandler";

export * as userController from "../controller/user.controller";

export const getUser = async (req, res, next) => {
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
    const [userRows] = await connection.query(
      "SELECT email, role, otp_enabled, otp_verified FROM user WHERE id = ?",
      [data.id]
    );
    connection.release();

    const user = userRows[0];

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      user: {
        email: user.email,
        role: user.role,
      },
      ibmfa: {
        enabled: user.otp_enabled,
        verified: user.otp_verified,
      },
    });
  } catch (error) {
    next(error);
  }
};
