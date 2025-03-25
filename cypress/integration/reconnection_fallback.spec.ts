describe('Reconnection Fallback', () => {
  it('should handle WebSocket reconnection', () => {
    cy.visit('/');

    // Simulate WebSocket disconnection
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'));
    });

    // Wait for reconnection attempt
    cy.wait(5000);

    // Simulate WebSocket reconnection
    cy.window().then((win) => {
      win.dispatchEvent(new Event('online'));
    });

    // Verify reconnection
    cy.get('.connection-status').should('contain', 'Connected');
  });
});
