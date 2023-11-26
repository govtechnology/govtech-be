import { prisma } from "../lib/dbConnector";
import docsGenerate from "../lib/docsGenerator";
import { generateMinioStorageLink } from "../lib/s3Connector";
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

export const getCertificateById = async (req, res) => {
  const { id } = req.params;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized: Bearer token required",
    });
  }

  const user = verifyToken(req.headers.access_token);

  if (!user) {
    return res.status(401).json({
      status: 401,
      message: "Invalid access token",
    });
  }

  try {
    const certificate = await prisma.certificate.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!certificate) {
      return res.status(404).json({
        status: 404,
        message: "Certificate not found",
      });
    }

    res.json({
      status: 200,
      certificate: certificate,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCertificateLink = async (req, res) => {
  try {
    const getLink = await generateMinioStorageLink(req.body.remotePath);
    res.json({
      status: 200,
      url: getLink,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const generateCertificate = async (req, res) => {
  try {
    const { skId, skType, skData } = req.body;

    const user = await prisma.certificate.findUnique({
      where: {
        id: skId,
      },
      select: {
        userId: true,
      },
    });

    if (skType === "SKTM") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        nik: skData.nik,
        ttl: skData.ttl,
        agama: skData.agama,
        bekerja: skData.bekerja,
        alamat: skData.alamat,
      });
    } else if (skType === "SKIK") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        namaOrtu: skData.namaOrtu,
        ttlOrtu: skData.ttlOrtu,
        alamatOrtu: skData.alamatOrtu,
        nikOrtu: skData.nikOrtu,
        nama: skData.nama,
        ttl: skData.ttl,
        alamat: skData.alamat,
        nik: skData.nik,
        destination: skData.destination,
      });
    } else if (skType === "SKMS") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        ttl: skData.ttl,
        nik: skData.nik,
        alamat: skData.alamat,
        usaha: skData.usaha,
        jenisAlat: skData.jenisAlat,
        jumlahAlat: skData.jumlahAlat,
        fungsiAlat: skData.fungsiAlat,
        jenisBBM: skData.jenisBBM,
        lokasiSPBU: skData.lokasiSPBU,
      });
    } else if (skType === "SKDI") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        alamat: skData.alamat,
      });
    } else if (skType === "SKD") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        nik: skData.nik,
        ttl: skData.ttl,
        agama: skData.agama,
        kelamin: skData.kelamin,
        status: skData.status,
        pekerjaan: skData.pekerjaan,
        alamat: skData.alamat,
      });
    } else if (skType === "SKU") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        nik: skData.nik,
        ttl: skData.ttl,
        kelamin: skData.kelamin,
        alamat: skData.alamat,
        agama: skData.agama,
        status: skData.status,
        pendidikan: skData.pendidikan,
        pekerjaan: skData.pekerjaan,
        usaha: skData.usaha,
      });
    } else if (skType === "SKK") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        jenisKelamin: skData.jenisKelamin,
        alamat: skData.alamat,
        umur: skData.umur,
        hariMeninggal: skData.hariMeninggal,
        tanggalMeninggal: skData.tanggalMeninggal,
        lokasiMeninggal: skData.lokasiMeninggal,
        sebab: skData.sebab,
      });
    } else if (skType === "SKPB") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        nik: skData.nik,
        ttl: skData.ttl,
        kelamin: skData.kelamin,
        alamat: skData.alamat,
        agama: skData.agama,
        status: skData.status,
        pendidikan: skData.pendidikan,
        pekerjaan: skData.pekerjaan,
        usaha: skData.usaha,
        bank: skData.bank,
      });
    } else if (skType === "SKHIL") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        nik: skData.nik,
        ttl: skData.ttl,
        kelamin: skData.kelamin,
        alamat: skData.alamat,
        agama: skData.agama,
        status: skData.status,
        pendidikan: skData.pendidikan,
        pekerjaan: skData.pekerjaan,
        hilang: skData.hilang,
        keterangan: skData.keterangan,
      });
    } else if (skType === "SKCK") {
      await docsGenerate({
        userId: user.userId,
        skId: skId,
        skType: skType,
        nama: skData.nama,
        nik: skData.nik,
        ttl: skData.ttl,
        agama: skData.agama,
        kelamin: skData.kelamin,
        alamat: skData.alamat,
        status: skData.status,
        pendidikan: skData.pendidikan,
        pekerjaan: skData.pekerjaan,
        keperluan: skData.keperluan,
      });
    }

    res.json({
      status: 200,
      data: { skType, skData },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
