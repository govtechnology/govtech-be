import { prisma } from "../lib/dbConnector";
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

    const user = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      user: {
        name: user.name,
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
