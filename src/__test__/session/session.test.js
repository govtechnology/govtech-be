import supertest from "supertest";
import server from "../../lib/supertestServer";

const app = server();
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4ODI1NThmLTI0OWEtNDRhZi05YzQ2LTk0NDg3MzIxY2Y0OSIsImlhdCI6MTcwMjM5NDQ5MSwiZXhwIjoxNzA1Mzk0NDkxfQ.P8_xpCrVrTPFN74tX6pvjZDUaHn4PKtNsiTzE1GMZYM";

describe("[GET] Current Logged In User Session List (/sessions)", () => {
    describe("Fetching user session List", () => {
        it("should return 200 OK with list of current logged in user sessions", async () => {
            await supertest(app)
                .get("/sessions?page=1&size=10")
                .set("Authorization", token)
                .expect(200);
        })
    })
})
