import supertest from "supertest";
import server from "../../lib/supertestServer";

const app = server();
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4NWM1Nzc1LTY2YzAtNDI5MC04NWQwLWU5MjU5NjE1ZmUxOSIsImlhdCI6MTY5OTc3OTI3MiwiZXhwIjoxNjk5NzkwMDcyfQ.fLx56MYoG2R9Zm2IEF7DyFKBGjaoRmzZZ1v-ih9u4E0";

describe("[POST] RequestCertificate", () => {
    describe("[SKTM] Requesting SKTM", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKTM",
                "skData": {
                    "nama": "Jest Test Account",
                    "nik": "202110370311147",
                    "ttl": "Tulungagung, 04 July 2002",
                    "agama": "Islam",
                    "bekerja": "Mahasiswa",
                    "alamat": "Malang"
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKDI] Requesting SKDI", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKDI",
                "skData": {
                    "nama": "Jest Test Account",
                    "alamat": "Malang"
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKIK] Requesting SKIK", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKIK",
                "skData": {
                    "namaOrtu": "Jest Test Account",
                    "ttlOrtu": "Tulungagung, 09 July 2002",
                    "alamatOrtu": "Tulungagung",
                    "nikOrtu": "892730263962323",
                    "nama": "Jest Test Account",
                    "ttl": "Tulungagung, 04 July 2002",
                    "alamat": "Malang",
                    "nik": '2037207302323232',
                    "destination": "Batam"
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKMS] Requesting SKMS", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKMS",
                "skData": {
                    "nama": "Jest Test Account",
                    "ttl": "Tulungagung, 04 July 2002",
                    "nik": '2037207302323232',
                    "alamat": "Malang",
                    "usaha": "Developer",
                    "jenisAlat": "{[Truk]}",
                    "jumlahAlat": "{[2]}",
                    "fungsiAlat": "{['Kendaraan']}",
                    "jenisBBM": "{['Premium']}",
                    "kodeSPBU": "027302",
                    "lokasiSPBU": "Kalidawir"
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKD] Requesting SKD", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKD",
                "skData": {
                    "nama": "Jest Test Account",
                    "nik": '2037207302323232',
                    "ttl": "Tulungagung, 04 July 2002",
                    "agama": "Islam",
                    "kelamin": "Laki - Laki",
                    "status": "Lajang",
                    "pekerjaan": "Mahasiswa",
                    "alamat": "Malang"
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKU] Requesting SKU", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKU",
                "skData": {
                    "nama": "Jest Test Account",
                    "nik": '2037207302323232',
                    "ttl": "Tulungagung, 04 July 2002",
                    "kelamin": "Laki - Laki",
                    "alamat": "Malang",
                    "agama": "Islam",
                    "status": "Lajang",
                    "pendidikan": "SMA",
                    "pekerjaan": "Mahasiswa",
                    "usaha": "Komputer"
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKK] Requesting SKK", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKK",
                "skData": {
                    "nama": "Jest Test Account",
                    "jenisKelamin": "Laki - Laki",
                    "alamat": "Malang",
                    "umur": "60",
                    "hariMeninggal": "Kamis",
                    "tanggalMeninggal": "2 Februari 2022",
                    "lokasiMeninggal": "Kediaman Almarhum",
                    "sebab": "Sakit",
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKPB] Requesting SKPB", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKPB",
                "skData": {
                    "nama": "Jest Test Account",
                    "nik": "3213242345234534545",
                    "ttl": "Tulungagung, 04 July 2002",
                    "kelamin": "Laki - Laki",
                    "alamat": "Malang",
                    "agama": "Islam",
                    "status": "Lajang",
                    "pendidikan": "SMA",
                    "pekerjaan": "Mahasiswa",
                    "usaha": "Komputer",
                    "bank": "BCA"
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKHIL] Requesting SKHIL", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKHIL",
                "skData": {
                    "nama": "Jest Test Account",
                    "nik": "3213242345234534545",
                    "ttl": "Tulungagung, 04 July 2002",
                    "kelamin": "Laki - Laki",
                    "alamat": "Malang",
                    "agama": "Islam",
                    "status": "Lajang",
                    "pendidikan": "SMA",
                    "pekerjaan": "Mahasiswa",
                    "hilang": "Laptop",
                    "keterangan": "YTTA"
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
    describe("[SKCK] Requesting SKCK", () => {
        it("should return 201", async () => {
            const certificate = {
                "skType": "SKCK",
                "skData": {
                    "nama": "Jest Test Account",
                    "nik": "3213242345234534545",
                    "ttl": "Tulungagung, 04 July 2002",
                    "agama": "Islam",
                    "kelamin": "Laki - Laki",
                    "alamat": "Malang",
                    "status": "Lajang",
                    "pendidikan": "SMA",
                    "pekerjaan": "Mahasiswa",
                    "keperluan": "MSIB",
                }
            };

            await supertest(app)
                .post("/certificate/request")
                .set("Authorization", token)
                .send(certificate)
                .expect(201);
        });
    });
});