const { spec, request } = require("pactum");
const { faker } = require("@faker-js/faker");

const randomEmail = faker.internet.email();
const password = faker.internet.password();
const randomName = faker.person.fullName();

const postRegisterUserSchema = require("../data/response/post-register-user-response-schema.json");
const postRegisterUserErrorSchema = require("../data/response/post-register-user-error-response-schema.json");

const baseUrl = "https://practice.expandtesting.com/notes/api";

describe("Register user endpoint test suite", () => {
  before(() => {
    request.setDefaultTimeout(5000);
  });

  it("successful register user test", async () => {
    const requestBody = {
      name: randomName,
      email: randomEmail,
      password: password,
    };
    await spec()
      .post(`${baseUrl}/users/register`)
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(201)
      .expectResponseTime(5000)
      .expectJsonSchema(postRegisterUserSchema);
  });

  it("unsuccessful register user - invalid username - test", async () => {
    const requestBody = {
      email: randomEmail,
      password: password,
    };

    await spec()
      .post(`${baseUrl}/users/register`)
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(400)
      .expectResponseTime(5000)
      .expectJsonSchema(postRegisterUserErrorSchema)
      .expectJsonLike({
        message: "User name must be between 4 and 30 characters",
      });
  });

  it("unsuccessful register user - password too short test", async () => {
    const requestBody = {
      name: randomName,
      email: randomEmail,
      password: "short",
    };
    await spec()
      .post(`${baseUrl}/users/register`)
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(400)
      .expectResponseTime(5000)
      .expectJsonSchema(postRegisterUserErrorSchema);
  });

  it("unsuccessful register user - invalid email - test", async () => {
    const requestBody = {
      name: randomName,
      email: "testing.com",
      password: password,
    };
    await spec()
      .post(`${baseUrl}/users/register`)
      .withHeaders("Content-Type", "application/json")
      .withBody(requestBody)
      .expectStatus(400)
      .expectResponseTime(5000)
      .expectJsonSchema(postRegisterUserErrorSchema);
  });
});
