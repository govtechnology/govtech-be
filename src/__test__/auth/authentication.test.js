import supertest from "supertest";
import server from "../../lib/supertestServer";

const app = server();

describe("[POST] User Authentication", () => {
    describe("Creating User Account", () => {
        it("should return 201", async () => {
            const accountDetail = {
                "name": "Jest Test Account",
                "email": "jest2@xyzuan.my.id",
                "password": "jest123",
            };

            await supertest(app)
                .post("/auth/signup")
                .send(accountDetail)
                .expect(201);
        });
    });

    describe("Login User Account", () => {
        it("should return 200", async () => {
            const accountDetail = {
                "email": "jest@xyzuan.my.id",
                "password": "jest123",
            };

            await supertest(app)
                .post("/auth/signin")
                .send(accountDetail)
                .expect(200);
        });
    });
});