/// <reference types="cypress" />

describe('Prueba de inicio y cierre de sesión', () => {
  beforeEach(() => {
    // Opcional: Limpiar el almacenamiento local y las cookies antes de cada prueba
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Debería iniciar sesión con credenciales correctas y luego cerrar sesión', () => {
    // Visitar la página de inicio de sesión
    cy.visit('/login'); // Asegúrate de que `baseUrl` esté configurado correctamente en cypress.config.js

    // Ingresar el correo y la contraseña
    cy.get('ion-input[name="correo"] input').type('atorres');
    cy.get('ion-input[name="password"] input').type('1234');

    // Hacer clic en el botón de inicio de sesión
    cy.get('ion-button#login-button').click();

    // Verificar que la URL ha cambiado a la página de inicio /home
    cy.url().should('include', '/home');

    // Verificar que el mensaje de bienvenida aparece en la página
    cy.contains('Bienvenido(a)').should('be.visible');
    cy.contains('Ana Torres').should('be.visible');

    // **Opcional**: Verificar que el usuario se ha guardado en el almacenamiento local
    cy.window().then((window) => {
      const authUser = window.localStorage.getItem('AUTHENTICATED_USER');
      expect(authUser).to.not.be.null;
      const user = JSON.parse(authUser);
      expect(user.email).to.equal('atorres@duocuc.cl');
      expect(user.userName).to.equal('atorres'); // Ajusta según la estructura real del objeto User
    });

    // Realizar el cierre de sesión
    cy.get('ion-button#logout-button').click();

    // Verificar que hemos regresado a la página de inicio de sesión
    cy.url().should('include', '/login');

    // **Opcional**: Verificar que el usuario ha sido eliminado del almacenamiento local
    cy.window().then((window) => {
      const authUser = window.localStorage.getItem('AUTHENTICATED_USER');
      expect(authUser).to.be.null;
    });
  });

  it('Debería mostrar un error y permanecer en la página de inicio de sesión al ingresar credenciales incorrectas', () => {
    // Visitar la página de inicio de sesión
    cy.visit('/login');

    // Ingresar el correo y la contraseña
    cy.get('ion-input[name="correo"] input').type('wrong');
    cy.get('ion-input[name="password"] input').type('wrong');

    // Hacer clic en el botón de inicio de sesión
    cy.get('ion-button#login-button').should('be.visible').and('not.be.disabled').click();

    // Verificar que la URL sigue siendo /login
    cy.url().should('include', '/login');

    // Verificar que se muestra el mensaje de error
    cy.wait(100);
    cy.get('ion-toast').shadow().find('.toast-message').should('contain', 'El correo o la password son incorrectos');

    // **Opcional**: Verificar que el usuario no se ha guardado en el almacenamiento local
    cy.window().then((window) => {
      const authUser = window.localStorage.getItem('AUTHENTICATED_USER');
      expect(authUser).to.be.null;
    });
  });
});