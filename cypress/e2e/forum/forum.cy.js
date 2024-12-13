/// <reference types="cypress" />

describe('Prueba E2E en ForumComponent', () => {
  let createdPostId = null; // Variable para almacenar el ID de la publicación creada

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
    cy.get('ion-segment-button#forum').click();
  });
  afterEach(() => {
    cy.get('ion-button#logout-button').click();
  });

  it('Debería agregar una nueva publicación correctamente', () => {
    // Rellenar el título de la publicación
    cy.get('[data-testid="title-input"] input')
      .clear()
      .type('Título de Prueba E2E');

    // Rellenar el cuerpo de la publicación
    cy.get('[data-testid="body-textarea"] textarea')
      .clear()
      .type('Este es el cuerpo de la publicación de prueba E2E.');

    // Hacer clic en el botón de guardar publicación
    cy.get('[data-testid="save-button"]').should('be.visible').and('not.be.disabled').click();

    // Verificar que se muestra un toast de éxito
    cy.get('ion-toast').shadow().find('.toast-message').should('contain', 'Publicación creada correctamente');

    // Verificar que la nueva publicación aparece en la lista
    cy.get('[data-testid="posts-list"] [data-testid="post-card"]')
      .should('contain', 'Título de Prueba E2E')
      .and('contain', 'Este es el cuerpo de la publicación de prueba E2E.');

    // Almacenar el ID de la publicación creada para eliminarla después
    cy.get('[data-testid="posts-list"] [data-testid="post-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="edit-button"]').then(($btn) => {
          // Suponiendo que el botón de editar tiene un atributo de data-post-id
          // Si no es así, ajusta según tu implementación
          const editButton = $btn[0];
          // Extraer el ID de la publicación de alguna manera
          // Por ejemplo, si el título contiene el ID o si hay un atributo data-post-id
          // Aquí asumiremos que puedes obtenerlo de alguna propiedad
          // Alternativamente, podrías obtenerlo del almacenamiento local o API
          // Para simplificar, omitiremos la extracción y usaremos una variable fija
          // Ajusta según tu aplicación
          // createdPostId = extractedId;
        });
      });
    
    // Alternativamente, podríamos obtener el último post basado en la lista
    cy.get('[data-testid="posts-list"] [data-testid="post-card"]').then((posts) => {
      const lastPost = posts[0];
      // Extraer el ID de la publicación de alguna manera
      // Por ejemplo, si el ID está en un elemento específico
      // Aquí asumiremos que puedes extraerlo de alguna etiqueta o atributo
      // Para este ejemplo, supongamos que el ID está en un data attribute en ion-card
      // Modifica según tu implementación real
      const postId = Cypress.$(lastPost).find('[data-testid="post-id-container"]').attr('id');
      createdPostId = postId;
    });
  });

  it('Debería eliminar la publicación creada anteriormente', () => {
    // Asegurarse de que tenemos un ID de publicación para eliminar
    expect(createdPostId).to.not.be.null;

    // Encontrar la publicación con el ID almacenado y hacer clic en el botón de eliminar
    cy.wait(100); // Esperar un poco para asegurarse de que la publicación se haya creado
    cy.get(`[data-testid="post-card"] #${createdPostId} ion-button#delete-button`).click();

    // Confirmar la eliminación si hay algún diálogo de confirmación
    // Por ejemplo, si usas un ion-alert para confirmar
    // cy.get('ion-alert').shadow().find('button').contains('Confirmar').click();

    // Verificar que se muestra un toast de éxito
    cy.get('ion-toast')
      .shadow()
      .find('.toast-message')
      .should('contain', 'Publicación eliminada correctamente');

    // Verificar que la publicación ya no aparece en la lista
    cy.get(`[data-testid="post-card"] #${createdPostId}`).should('not.exist');
  });
});