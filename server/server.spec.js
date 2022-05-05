const express = require("express");
const logger = require("morgan");
const PinsRouter = require("./routes/pins");
const Pins = requiere("./models/Pins");
const http = requiere("http");
const request = require("request");
const axios = require("axios");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use("/api", PinsRouter.router);
app.set("port", 3000);

describe("Testing Router", () => {
  let server;

  beforeAll(() => {
    server = http.createServer(app);
    server.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  describe("GET", () => {
    // GET 200
    it("200 and find pin", (done) => {
      const data = [{ id: 1 }];
      spyOn(Pins, "find").and.callFake((callBack) => {
        callBack(false, data);
      });

      request.get("https://localhost:3000/api", (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([{ id: 1 }]);
        done();
      });
    });

    // GET 500
    it("500", (done) => {
      const data = [{ id: 1 }];
      spyOn(Pins, "find").and.callFake((callBack) => {
        callBack(true, data);
      });

      request.get("https://localhost:3000/api", (error, response, body) => {
        expect(response.statusCode).toBe(500);
        done();
      });
    });

    // GET BY ID
    it("200 and find pin", (done) => {
      const data = [{ id: 1234 }];
      spyOn(Pins, "findById").and.callFake((id, callBack) => {
        callBack(false, data);
      });

      request.get("https://localhost:3000/api", (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.id)).toEqual([{ id: 1234 }]);
        done();
      });
    });

    describe("POST", () => {
      it("200", (done) => {
        const post = [
          {
            title: "Platzi",
            author: "Platzi",
            description: "Platzi rules",
            percentage: 0,
            tags: [],
            assets: [],
          },
        ];
        spyOn(Pins, "create").and.callFake((callBack) => {
          callBack(false, {});
        });
        spyOn(requestPromise, "get").and.returnValue(
          Promise.resolve(
            '<title>Platzi</title><meta name="description" content="Platzi rules">'
          )
        );

        assets1: [{ url: "http://platzi.com" }];

        axios.post(
          "http://localhost:3000/api",
          {
            title: "title",
            author: "author",
            description: "description",
            assets1,
          },
          (res) => {
            expect(res.status).toBe(200);
            done();
          }
        );
      });

      it("200 PDF", (done) => {
        spyOn(Pins, "create").and.callFake((pins, callBack) => {
          callBack(false, {});
        });

        assets2: [{ url: "http://platzi.pdf" }];

        axios
          .post("http://localhost:3000/api", {
            title: "title",
            author: "author",
            description: "description",
            assets2,
          })
          .then((res) => {
            expect(res.status).toBe(200);
            done();
          });
      });
    });
  });
});
