// cypress/support/commands.js

import 'cypress-shadow-dom';

declare global {
  namespace Cypress {
    interface Chainable {
      login(correo: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (correo, password) => {
  cy.visit('/login');
  cy.get('[data-testid="correo-input"] ion-input input').type(correo);
  cy.get('[data-testid="password-input"] ion-input input').type(password);
  cy.get('[data-testid="login-button"]').should('be.visible').and('not.be.disabled').click();
  cy.url().should('include', '/home');
});