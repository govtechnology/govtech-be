import fs from "fs";
// import bcryptjs from "bcryptjs";
import piZip from "pizzip";
import path from "path";
import docxTemplater from "docxtemplater";
import { prisma } from "./dbConnector";
import { uploadMinioStorage } from "./s3Connector";
import { format } from "date-fns";

export default async function docsGenerate(data) {
  const template = await fs.readFileSync(`./templates/${data.skType}.docx`);
  const zip = new piZip(template);
  const doc = new docxTemplater().loadZip(zip);
  const dateNow = new Date();
  const tglSurat = format(dateNow, "dd-MM-yyyy");
  const tglFile = format(dateNow, "hhmmss");
  const filename = `${data.nama}_${data.skType}_${tglFile}`;
  // const encrpytDir = await bcryptjs.hash(filename, 12);

  if (data.skType === "SKTM") {
    const docData = {
      noReg: data.skId,
      nama: data.nama,
      nik: data.nik,
      ttl: data.ttl,
      agama: data.agama,
      bekerja: data.bekerja,
      alamat: data.alamat,
      tglSurat: tglSurat,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKIK") {
    const docData = {
      namaOrtu: data.namaOrtu,
      ttlOrtu: data.ttlOrtu,
      alamatOrtu: data.alamatOrtu,
      nikOrtu: data.nikOrtu,
      nama: data.nama,
      ttl: data.ttl,
      alamat: data.alamat,
      nik: data.nik,
      destination: data.destination,
      tglSurat: tglSurat,
      noReg: data.skId,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKMS") {
    let kodeSPBU, lokasiSPBU, tglBerlaku;
    if (data.lokasiSPBU.toLowerCase() === "karangtalun") {
      kodeSPBU = "54.662.27";
      lokasiSPBU = "Desa Karangtalun Kecamatan Kalidawir";
      tglBerlaku = `${tglSuratFormat()} s/d ${tglSuratFormatInc(1)} `;
    } else if (data.lokasiSPBU.toLowerCase() === "selorejo") {
      kodeSPBU = "54.662.29";
      lokasiSPBU = "Desa Selorejo Kecamatan Ngunut";
      tglBerlaku = `${tglSuratFormat()} s/d ${tglSuratFormatInc(1)} `;
    }
    const docData = {
      noReg: data.skId,
      nama: data.nama,
      ttl: data.ttl,
      nik: data.nik,
      alamat: data.alamat,
      usaha: data.usaha,
      jenisAlat: data.jenisAlat,
      jumlahAlat: data.jumlahAlat,
      fungsiAlat: data.fungsiAlat,
      jenisBBM: data.jenisBBM,
      kodeSPBU: kodeSPBU,
      lokasiSPBU: lokasiSPBU,
      tglBerlaku: tglBerlaku,
      tglSurat: tglSurat,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKDI") {
    const docData = {
      nama: data.nama,
      alamat: data.alamat,
      tglSurat: tglSurat,
      noReg: data.skId,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKD") {
    const docData = {
      nama: data.nama,
      nik: data.nik,
      ttl: data.ttl,
      agama: data.agama,
      kelamin: data.kelamin,
      status: data.status,
      pekerjaan: data.pekerjaan,
      alamat: data.alamat,
      tglSurat: tglSurat,
      noReg: data.skId,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKU") {
    const docData = {
      nama: data.nama,
      nik: data.nik,
      ttl: data.ttl,
      kelamin: data.kelamin,
      alamat: data.alamat,
      agama: data.agama,
      status: data.status,
      pendidikan: data.pendidikan,
      pekerjaan: data.pekerjaan,
      usaha: data.usaha,
      tglSurat: tglSurat,
      noReg: data.skId,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKK") {
    const docData = {
      nama: data.nama,
      jenisKelamin: data.jenisKelamin,
      alamat: data.alamat,
      umur: data.umur,
      hariMeninggal: data.hariMeninggal,
      tanggalMeninggal: data.tanggalMeninggal,
      lokasiMeninggal: data.lokasiMeninggal,
      sebab: data.sebab,
      tglSurat: tglSurat,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKPB") {
    const docData = {
      nama: data.nama,
      nik: data.nik,
      ttl: data.ttl,
      kelamin: data.kelamin,
      alamat: data.alamat,
      agama: data.agama,
      status: data.status,
      pendidikan: data.pendidikan,
      pekerjaan: data.pekerjaan,
      usaha: data.usaha,
      bank: data.bank,
      tglSurat: tglSurat,
      noReg: data.skId,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKHIL") {
    const docData = {
      nama: data.nama,
      nik: data.nik,
      ttl: data.ttl,
      kelamin: data.kelamin,
      alamat: data.alamat,
      agama: data.agama,
      status: data.status,
      pendidikan: data.pendidikan,
      pekerjaan: data.pekerjaan,
      hilang: data.hilang,
      keterangan: data.keterangan,
      tglSurat: tglSurat,
      noReg: data.skId,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  } else if (data.skType === "SKCK") {
    const docData = {
      nama: data.nama,
      nik: data.nik,
      ttl: data.ttl,
      agama: data.agama,
      kelamin: data.kelamin,
      alamat: data.alamat,
      status: data.status,
      pendidikan: data.pendidikan,
      pekerjaan: data.pekerjaan,
      keperluan: data.keperluan,
      tglSurat: tglSurat,
      noReg: data.skId,
    };
    doc.setData(docData);
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering template:", error);
    }
  }
  const tempPath = `./private/${data.userId}/${filename}.docx`;
  const remotePath = `documents/${data.userId}/${filename}.docx`;
  const generatedDocument = doc.getZip().generate({ type: "nodebuffer" });

  const directoryPath = path.dirname(tempPath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFileSync(tempPath, await generatedDocument);
  await uploadMinioStorage("govtech-bucket", remotePath, tempPath);

  await prisma.certificate.update({
    where: { id: data.skId },
    data: {
      approvedDate: dateNow,
      skStatus: "DONE",
      skDir: remotePath,
    },
  });
}
