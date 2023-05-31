const { spec, request } = require("pactum");
const { faker } = require("@faker-js/faker");

const randomEmail = faker.internet.email();
const password = faker.internet.password();
const randomName = faker.person.fullName();

const postRegisterUserSchema = require("../data/response/post-register-user-response-schema.json");
const postLogInSchema = require("../data/response/post-login-response-schema.json");
const postErrorLogInSchema = require("../data/response/post-unregistered-user-login-response-schema.json");

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

describe("Login  user endpoint test suite", () => {
  before(() => {
    request.setDefaultTimeout(5000);
  });

  it("successful register user test", async () => {
    await spec()
      .post(`${baseUrl}/users/register`)
      .withHeaders("Content-Type", "application/json")
      .withBody(registerBody)
      .expectStatus(201)
      .expectResponseTime(5000)
      .expectJsonSchema(postRegisterUserSchema)
      .expectJsonLike({ message: "User account created successfully" });
  });

  it("succesful login user test", async () => {
    await spec()
      .post(`${baseUrl}/users/login`)
      .withHeaders("Content-Type", "application/json")
      .withBody(loginBody)
      .expectStatus(200)
      .expectResponseTime(5000)
      .expectJsonSchema(postLogInSchema)
      .expectJsonLike({ message: "Login successful" });
  });

  it("unsuccesful login user - unregistered user - test", async () => {
    const unregisteredUserBody = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await spec()
      .post(`${baseUrl}/users/login`)
      .withHeaders("Content-Type", "application/json")
      .withBody(unregisteredUserBody)
      .expectStatus(401)
      .expectResponseTime(5000)
      .expectJsonSchema(postErrorLogInSchema)
      .expectJsonLike({ message: "Incorrect email address or password" });
  });

  it("unsuccesful login user - no password - test", async () => {
    const requestBody = {
      email: loginBody.email,
    };

    await spec()
      .post(`${baseUrl}/users/login`)
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(400)
      .expectResponseTime(5000)
      .expectJsonSchema(postErrorLogInSchema)
      .expectJsonLike({
        message: "Password must be between 6 and 30 characters",
      });
  });
});
