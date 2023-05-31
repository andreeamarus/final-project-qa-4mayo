const { spec, request } = require("pactum");
const { faker } = require("@faker-js/faker");

const randomEmail = faker.internet.email();
const password = faker.internet.password();
const randomName = faker.person.fullName();

const postRegisterUserSchema = require("../data/response/post-register-user-response-schema.json");
const postLogInSchema = require("../data/response/post-login-response-schema.json");
const postCreateNoteSchema = require("../data/response/post-create-new-note-respone-schema.json");
const getAllNoteSchema = require("../data/response/get-all-notes-response-schema.json");
const getAllNoteErrorSchema = require("../data/response/get-all-notes-error-response-schema.json");

const baseUrl = "https://practice.expandtesting.com/notes/api";

const registerBody = {
  name: randomName,
  email: randomEmail,
  password: password,
};

const loginBody = {
  email: registerBody.email,
  password: registerBody.password,
};

const requestBody = {
  title: "Title of the post",
  description:
    "Need a description for testing, but it needs to be longer. It's  working",
  category: "Work",
};

let token = "";

describe("Get all notes test suite", () => {
  before(async () => {
    request.setDefaultTimeout(5000);

    // register user
    await spec()
      .post(`${baseUrl}/users/register`)
      .withHeaders("Content-Type", "application/json")
      .withBody(registerBody)
      .expectStatus(201)
      .expectResponseTime(5000)
      .expectJsonSchema(postRegisterUserSchema);

    // user login
    const login = await spec()
      .post(`${baseUrl}/users/login`)
      .withHeaders("Content-Type", "application/json")
      .withBody(loginBody)
      .expectStatus(200)
      .expectResponseTime(5000)
      .expectJsonSchema(postLogInSchema)
      .expectJsonLike({ message: "Login successful" });

    token = login.body.data.token;

    // try get notes before creating
    await spec()
      .get(`${baseUrl}/notes`)
      .withHeaders({
        "Content-Type": "application/json",
        "x-auth-token": token,
      })
      .expectStatus(200)
      .expectResponseTime(5000)
      .expectJsonSchema(getAllNoteSchema)
      .expectJsonLike({ message: "No notes found" });

    // create note
    await spec()
      .post(`${baseUrl}/notes`)
      .withHeaders({
        "Content-Type": "application/json",
        "x-auth-token": token,
      })
      .withBody(requestBody)
      .expectStatus(200)
      .expectResponseTime(5000)
      .expectJsonSchema(postCreateNoteSchema)
      .expectJsonLike({ message: "Note successfully created" });
  });

  it("Get all notes test", async () => {
    await spec()
      .get(`${baseUrl}/notes`)
      .withHeaders({
        "Content-Type": "application/json",
        "x-auth-token": token,
      })
      .expectStatus(200)
      .expectResponseTime(5000)
      .expectJsonSchema(getAllNoteSchema)
      .expectJsonLike({ message: "Notes successfully retrieved" });
  });

  it("Get all notes - no authentication token - test", async () => {
    await spec()
      .get(`${baseUrl}/notes`)
      .withHeaders("Content-Type", "application/json")
      .expectStatus(401)
      .expectResponseTime(5000)
      .expectJsonSchema(getAllNoteErrorSchema)
      .expectJsonLike({
        message: "No authentication token specified in x-auth-token header",
      });

    // hard coded
    it(" Hard coded - get all notes test", async () => {
      await spec()
        .get(`${baseUrl}/notes`)
        .withHeaders({
          "Content-Type": "application/json",
          "x-auth-token":
            "f7b97144266a43408f8b68023d8156196d574884a4dc4ee78917e69b31adf8c2",
        })
        .expectStatus(200)
        .expectResponseTime(5000)
        .expectJsonSchema(getAllNoteSchema)
        .expectJsonLike({ message: "Notes successfully retrieved" });
    });
  });
});
