/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const randomEmail = faker.internet.email();
const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const password = faker.internet.password();

const base_URL = "https://magento.softwaretestingboard.com/";

describe("User registration test suite", () => {
  beforeEach(() => {
    cy.visit(base_URL);
  });

  it("Succesfully register new user test", () => {
    cy.get('a[href="https://magento.softwaretestingboard.com/customer/account/create/"]').contains('Create').click();
    cy.get("input[name='firstname']").type(firstName);
    cy.get('input[name="lastname"]').type(lastName)
    cy.get("#email_address").type(randomEmail);
    cy.get("#password").type(password);
    cy.get("input[title='Confirm Password']").type(password);
    cy.get('button[title="Create an Account"]').click();
    cy.contains("Thank you for registering with Main Website Store.").should("be.visible");
  });
});
