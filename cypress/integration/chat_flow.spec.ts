describe('Chat Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should send a message and receive a response', () => {
    cy.get('[data-testid="chat-input"]').type('Hello, how can I improve my business with AI?');
    cy.get('[data-testid="send-button"]').click();

    cy.get('[data-testid="chat-message"]').should('contain', 'Hello, how can I improve my business with AI?');
    cy.get('[data-testid="chat-message"]').should('contain', 'This is a suggested response from the chat service.');
  });

  it('should upload a file and send a message', () => {
    cy.get('[data-testid="file-upload"]').attachFile('example.pdf');
    cy.get('[data-testid="chat-input"]').type('Please review the attached document.');
    cy.get('[data-testid="send-button"]').click();

    cy.get('[data-testid="chat-message"]').should('contain', 'Please review the attached document.');
    cy.get('[data-testid="chat-message"]').should('contain', 'This is a suggested response from the chat service.');
  });

  it('should display an error message for failed message send', () => {
    cy.intercept('POST', '/api/sendMessage', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    });

    cy.get('[data-testid="chat-input"]').type('This message will fail.');
    cy.get('[data-testid="send-button"]').click();

    cy.get('[data-testid="error-message"]').should('contain', 'Error sending message: Internal Server Error');
  });
});
