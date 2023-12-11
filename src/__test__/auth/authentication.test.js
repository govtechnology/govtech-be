import supertest from "supertest";
import server from "../../lib/supertestServer";

const app = server();

describe("[POST] User Authentication (/auth)", () => {
  describe("Creating User Account (/signup)", () => {
    it("should return 201", async () => {
      const accountDetail = {
        name: "Jest Test Account",
        email: "jest6@xyzuan.my.id",
        password: "jest123",
      };

      await supertest(app).post("/auth/signup").send(accountDetail).expect(201);
    });
  });

  describe("Creating User Account with Exist Email (/signup)", () => {
    it("should return 400", async () => {
      const accountDetail = {
        name: "Jest Test Account",
        email: "jest@xyzuan.my.id",
        password: "jest123",
      };

      await supertest(app).post("/auth/signup").send(accountDetail).expect(400);
    });
  });

  describe("Login User Account (/signin)", () => {
    it("should return 200", async () => {
      const accountDetail = {
        email: "jest@xyzuan.my.id",
        password: "jest123",
      };

      await supertest(app).post("/auth/signin").send(accountDetail).expect(200);
    });
  });

  describe("Login User Account where password incorrect (/signin)", () => {
    it("should return 422", async () => {
      const accountDetail = {
        email: "jest@xyzuan.my.id",
        password: "1234424132",
      };

      await supertest(app).post("/auth/signin").send(accountDetail).expect(422);
    });
  });
});
