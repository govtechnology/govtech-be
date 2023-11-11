import { prisma } from "../lib/dbConnector";
import { verifyToken } from "../lib/tokenHandler";

export * as userController from "../controller/user.controller";

export const getUser = async (req, res, next) => {
  try {
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
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
