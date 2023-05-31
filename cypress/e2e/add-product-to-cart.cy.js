/// <reference types="cypress" />

const base_URL = "https://magento.softwaretestingboard.com/";

describe("Search products test suite", () => {
    beforeEach(() => {
      cy.visit(base_URL);
    });
   
    it("Search products test", () => {
        const prodQty = 5

        cy.intercept({
            method: "GET",
            url: "https://magento.softwaretestingboard.com/sale.html",
          }).as("loadProductAPI");

        cy.get('li[class="level0 nav-6 category-item last level-top ui-menu-item"]').click();
        cy.wait("@loadProductAPI").its("response.statusCode").should("eq",200);
        cy.get('a[href="https://magento.softwaretestingboard.com/women/tops-women/tanks-women.html"]').contains('Bras & Tanks').click({force: true});
        cy.get('a[href="https://magento.softwaretestingboard.com/breathe-easy-tank.html"]').contains('Breathe-Easy Tank').click();
        cy.get('#option-label-size-143-item-168').click();
        cy.get('#option-label-color-93-item-59').click();
        cy.get('input[name="qty"]').clear();
        cy.get('input[name="qty"]').type(prodQty);
        cy.get('button').contains('Add to Cart').click();
        cy.contains('You added Breathe-Easy Tank to your shopping cart.').should('be.visible');
    });
});