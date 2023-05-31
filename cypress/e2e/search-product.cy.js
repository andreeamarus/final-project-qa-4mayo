/// <reference types="cypress" />

const base_URL = "https://magento.softwaretestingboard.com/";

describe("Search products test suite", () => {
    beforeEach(() => {
      cy.visit(base_URL);
    });
   
    it("Search products test", () => {
        cy.intercept({
            method: "GET",
            url: "https://magento.softwaretestingboard.com/catalogsearch/result/?q=tees",
          }).as("searchProductAPI");

        cy.get('#search').type('tees{enter}');
        cy.wait("@searchProductAPI").its("response.statusCode").should("eq",200);
        cy.contains("Search results for: 'tees'").should('be.visible');
        cy.get('#toolbar-amount').contains('3 Items');
    });
});