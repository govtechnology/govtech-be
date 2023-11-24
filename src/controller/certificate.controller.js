import { prisma } from "../lib/dbConnector";
import { verifyToken } from "../lib/tokenHandler";
export * as certificateController from "../controller/certificate.controller";

export const requestCertificate = async (req, res, next) => {
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

    const { skType, skData } = req.body;
    const user = verifyToken(req.headers.access_token);

    switch (skType) {
      case "SKDI":
        if (!skData.nama || !skData.alamat) {
          return res.status(400).json({
            success: false,
            error: "Missing required payload fields: nama, and alamat",
          });
        }
        break;
      case "SKTM":
        if (
          !skData.nama ||
          !skData.nik ||
          !skData.ttl ||
          !skData.agama ||
          !skData.bekerja ||
          !skData.alamat
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: nama, nik, ttl, agama, bekerja, and alamat",
          });
        }
        break;
      case "SKIK":
        if (
          !skData.namaOrtu ||
          !skData.ttlOrtu ||
          !skData.alamatOrtu ||
          !skData.nikOrtu ||
          !skData.nama ||
          !skData.ttl ||
          !skData.alamat ||
          !skData.nik ||
          !skData.destination
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: namaOrtu, ttlOrtu, alamatOrtu, nikOrtu, nama, ttl, alamat, nik, and destination",
          });
        }
        break;
      case "SKMS":
        if (
          !skData.nama ||
          !skData.ttl ||
          !skData.nik ||
          !skData.alamat ||
          !skData.usaha ||
          !skData.jenisAlat ||
          !skData.jumlahAlat ||
          !skData.fungsiAlat ||
          !skData.jenisBBM ||
          !skData.kodeSPBU ||
          !skData.lokasiSPBU
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: nama, ttl, nik, alamat, usaha, jenisAlat, jumlahAlat, fungsiAlat, jenisBBM, kodeSPBU, and lokasiSPBU",
          });
        }
        break;
      case "SKD":
        if (
          !skData.nama ||
          !skData.nik ||
          !skData.ttl ||
          !skData.agama ||
          !skData.kelamin ||
          !skData.status ||
          !skData.pekerjaan ||
          !skData.alamat
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: nama, nik, ttl, agama, kelamin, status, pekerjaan, and alamat",
          });
        }
        break;
      case "SKU":
        if (
          !skData.nama ||
          !skData.nik ||
          !skData.ttl ||
          !skData.kelamin ||
          !skData.alamat ||
          !skData.agama ||
          !skData.status ||
          !skData.pendidikan ||
          !skData.pekerjaan ||
          !skData.usaha
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: nama, nik, ttl, kelamin, alamat, agama, status, pendidikan, pekerjaan, and usaha",
          });
        }
        break;
      case "SKK":
        if (
          !skData.nama ||
          !skData.jenisKelamin ||
          !skData.alamat ||
          !skData.umur ||
          !skData.hariMeninggal ||
          !skData.tanggalMeninggal ||
          !skData.lokasiMeninggal ||
          !skData.sebab
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: nama, jenisKelamin, alamat, umur, hariMeninggal, tanggalMeninggal, lokasiMeninggal, and sebab",
          });
        }
        break;
      case "SKPB":
        if (
          !skData.nama ||
          !skData.nik ||
          !skData.ttl ||
          !skData.kelamin ||
          !skData.alamat ||
          !skData.agama ||
          !skData.status ||
          !skData.pendidikan ||
          !skData.pekerjaan ||
          !skData.usaha ||
          !skData.bank
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: nama, nik, ttl, kelamin, alamat, agama, status, pendidikan, pekerjaan, usaha, and bank",
          });
        }
        break;
      case "SKHIL":
        if (
          !skData.nama ||
          !skData.nik ||
          !skData.ttl ||
          !skData.kelamin ||
          !skData.alamat ||
          !skData.agama ||
          !skData.status ||
          !skData.pendidikan ||
          !skData.pekerjaan ||
          !skData.hilang ||
          !skData.keterangan
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: nama, nik, ttl, kelamin, alamat, agama, status, pendidikan, pekerjaan, hilang, and keterangan",
          });
        }
        break;
      case "SKCK":
        if (
          !skData.nama ||
          !skData.nik ||
          !skData.ttl ||
          !skData.agama ||
          !skData.kelamin ||
          !skData.alamat ||
          !skData.status ||
          !skData.pendidikan ||
          !skData.pekerjaan ||
          !skData.keperluan
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Missing required payload fields: nama, nik, ttl, agama, kelamin, alamat, status, pendidikan, pekerjaan, keperluan",
          });
        }
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Invalid skType value: ${skType}`,
        });
    }

    const certificate = await prisma.certificate.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        skStatus: "VERIFY",
        skType,
        skData,
      },
    });

    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (req, res, next) => {
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

    let userCertificate;
    const user = verifyToken(req.headers.access_token);

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid access token",
      });
    }

    const getUserInfo = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (getUserInfo.role === "ADMIN") {
      userCertificate = await prisma.certificate.findMany();
      const totalDone = userCertificate.filter(
        (cert) => cert.skStatus === "DONE"
      );
      const totalVerify = userCertificate.filter(
        (cert) => cert.skStatus === "VERIFY"
      );
      const totalRevision = userCertificate.filter(
        (cert) => cert.skStatus === "REVISION"
      );

      if (!userCertificate) {
        return res.status(404).json({
          status: 404,
          message: "Certificate not found",
        });
      } else {
        res.json({
          status: 200,
          certificate: userCertificate,
          total: userCertificate.length,
          totalDone: totalDone.length,
          totalVerify: totalVerify.length,
          totalRevision: totalRevision.length,
        });
      }
    } else {
      userCertificate = await prisma.certificate.findMany({
        where: { userId: user.id },
      });

      if (!userCertificate) {
        return res.status(404).json({
          status: 404,
          message: "Certificate not found",
        });
      } else {
        res.json({
          status: 200,
          certificate: userCertificate,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
