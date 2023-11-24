import { prisma } from "../lib/dbConnector";
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

    const userProfile = await prisma.profile.findUnique({
      where: { userId: data.id },
    });

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
    // const file = req.file;
    // const tempPath = file.path;
    // const originalFileName = file.originalname;
    // const uniqueFilename = `${uuidv4()}-${file.filename}`;
    // const remotePath = `product/${id}/image/${uniqueFilename}`;

    // await uploadMinioStorage("govtech-bucket", remotePath, tempPath);

    const userProfile = await prisma.profile.update({
      where: { userId: data.id },
      data: {
        name: name,
        nik: nik,
        // ktp: originalFileName,
        alamat: alamat,
        tempatLahir: tempatLahir,
        tanggalLahir: tanggalLahir,
      },
    });
    res.json({
      status: 200,
      profile: userProfile,
    });
  } catch (error) {
    next(error);
  }
};
