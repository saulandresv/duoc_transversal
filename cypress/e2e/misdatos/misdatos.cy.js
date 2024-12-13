/// <reference types="cypress" />

describe('Prueba de Validaciones en MisdatosComponent', () => {
  beforeEach(() => {
    // Limpiar el almacenamiento local y las cookies antes de cada prueba
    cy.clearLocalStorage();
    cy.clearCookies();

    // Iniciar sesión con credenciales válidas antes de cada prueba
    cy.visit('/login');
    // Ingresar el correo y la contraseña
    cy.get('ion-input[name="correo"] input').type('atorres');
    cy.get('ion-input[name="password"] input').type('1234');

    // Hacer clic en el botón de inicio de sesión
    cy.get('ion-button#login-button').click();
    cy.get('ion-segment-button#misdatos').click();
  });
  afterEach(() => {
    cy.wait(100);
    cy.get('ion-button#logout-button').click();
  });

  it.skip('Debería actualizar los datos correctamente con información válida', () => {
    // Rellenar todos los campos con información válida
    cy.get('[data-testid="firstName-input"] input').clear().type('Nombre');
    cy.get('[data-testid="lastName-input"] input').clear().type('Apellido');
    cy.get('[data-testid="email-input"] input').clear().type('nombre.apellido@duocuc.cl');
    
    // Seleccionar fecha de nacimiento
    // cy.get('[data-testid="birthDate-input"] ion-datetime').click();
    // cy.get('.picker-button-confirm').click(); // Asegúrate de que este selector coincide con el botón de confirmación de fecha
    
    // Seleccionar nivel educacional
    // cy.get('[data-testid="educationalLevel-select"] select').click();
    // cy.get('ion-select-option').contains('Universidad').click(); // Ajusta el texto según los niveles disponibles

    // Rellenar las contraseñas
    cy.get('[data-testid="password1-input"] input').clear().type('nuevoPassword123');
    cy.get('[data-testid="password2-input"] input').clear().type('nuevoPassword123');

    // Hacer clic en el botón de actualizar datos
    cy.get('[data-testid="update-button"]').should('be.visible').and('not.be.disabled').click();

    cy.wait(100);
    // Verificar que se muestra un toast de éxito
    cy.get('ion-toast').shadow().find('.toast-message').should('contain', 'Datos actualizados correctamente.');

    // Opcional: Verificar que el almacenamiento local se ha actualizado
    cy.window().then((window) => {
      const authUser = window.localStorage.getItem('AUTHENTICATED_USER');
      expect(authUser).to.not.be.null;
      const user = JSON.parse(authUser);
      expect(user.firstName).to.equal('Nombre');
      expect(user.lastName).to.equal('Apellido');
      expect(user.email).to.equal('nombre.apellido@duocuc.cl');
      // expect(user.educationalLevel.nombre).to.equal('Universidad'); // Ajusta según la estructura real del objeto User
    });

    cy.get('[data-testid="firstName-input"] input').clear().type('Ana');
    cy.get('[data-testid="lastName-input"] input').clear().type('Torres');
    cy.get('[data-testid="email-input"] input').clear().type('atorres@duocuc.cl');

    // Rellenar las contraseñas
    cy.get('[data-testid="password1-input"] input').clear().type('1234');
    cy.get('[data-testid="password2-input"] input').clear().type('1234');

    // Hacer clic en el botón de actualizar datos
    cy.get('[data-testid="update-button"]').should('be.visible').and('not.be.disabled').click();
  });

  it('Debería mostrar errores al intentar actualizar con campos vacíos', () => {
    
    cy.get('[data-testid="password1-input"] input').clear().type('nuevoPassword123');
    cy.get('[data-testid="password2-input"] input').clear().type('nuevoPassword123');
    cy.get('[data-testid="lastName-input"] input').clear();
    cy.get('[data-testid="update-button"]').click();
    
    // toas all fields are required
    cy.get('ion-toast').shadow().find('.toast-message').should('contain', 'Todos los campos son obligatorios.');
  });

  it('Debería mostrar error al ingresar un correo electrónico inválido', () => {
    // Rellenar el campo de correo electrónico con un valor inválido
    cy.get('[data-testid="email-input"] input').clear().type('correo_invalido');

    // Rellenar otros campos correctamente para poder intentar enviar el formulario
    cy.get('[data-testid="firstName-input"] input').clear().type('Nombre');
    cy.get('[data-testid="lastName-input"] input').clear().type('Apellido');
    // cy.get('[data-testid="address-input"] input').clear().type('Dirección Ejemplo');
    // cy.get('[data-testid="secretQues"] input').clear().type('Pregunta Secreta');
    // cy.get('[data-testid="secretAnswer-input"] input').clear().type('Respuesta Secreta');
    
    // Seleccionar fecha de nacimiento
    // cy.get('[data-testid="birthDate-input"] ion-datetime').click();
    // cy.get('.picker-button-confirm').click();

    // Seleccionar nivel educacional
    // cy.get('[data-testid="educationalLevel-select"] ion-select').click();
    // cy.get('ion-select-option').contains('Universidad').click(); // Ajusta el texto según los niveles disponibles

    // Rellenar las contraseñas
    cy.get('[data-testid="password1-input"] input').clear().type('nuevoPassword123');
    cy.get('[data-testid="password2-input"] input').clear().type('nuevoPassword123');

    // Hacer clic en el botón de actualizar datos
    cy.get('[data-testid="update-button"]').click();

    // Verificar que se muestra el mensaje de error para el correo electrónico inválido
    cy.get('ion-toast').shadow().find('.toast-message').should('contain', 'El email no es válido.');
  });
});