import supertest from "supertest";
import server from "../../lib/supertestServer";

const app = server();
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4NWM1Nzc1LTY2YzAtNDI5MC04NWQwLWU5MjU5NjE1ZmUxOSIsImlhdCI6MTY5OTc3OTI3MiwiZXhwIjoxNjk5NzkwMDcyfQ.fLx56MYoG2R9Zm2IEF7DyFKBGjaoRmzZZ1v-ih9u4E0";

describe("[GET] User Certificate (/certificate)", () => {
    describe("Fetching User Certificate", () => {
        it("should return 200", async () => {
            await supertest(app)
                .get("/certificate")
                .set("Authorization", token)
                .expect(200);
        });
    });

    describe("Fetching User Certificate where No Certificate", () => {
        it("should return 401", async () => {
            await supertest(app)
                .get("/certificate")
                .set("Authorization", '20830203702')
                .expect(401);
        });
    });

    describe("Fetching User Certificate where No Bearer Token", () => {
        it("should return 401", async () => {
            await supertest(app)
                .get("/certificate")
                .expect(401);
        });
    });
});