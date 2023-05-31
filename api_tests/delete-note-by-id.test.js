const { spec, request } = require("pactum");
const { faker } = require("@faker-js/faker");

const randomEmail = faker.internet.email();
const password = faker.internet.password();
const randomName = faker.person.fullName();

const postRegisterUserSchema = require("../data/response/post-register-user-response-schema.json");
const postLogInSchema = require("../data/response/post-login-response-schema.json");
const postCreateNoteSchema = require("../data/response/post-create-new-note-respone-schema.json");

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
let noteId = "";

describe("Delete post by id test suite", () => {
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

    // create new note
    const createdNote = await spec()
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

    noteId = createdNote.body.data.id;
  });

  it("Delete post test", async () => {
    await spec()
      .delete(`${baseUrl}/notes/${noteId}`)
      .withHeaders({
        "Content-Type": "application/json",
        "x-auth-token": `${token}`,
      })
      .expectJsonLike({ message: "Note successfully deleted" })
      .expectStatus(200);
  });
});
