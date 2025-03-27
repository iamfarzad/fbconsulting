describe('Language Switch and Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should switch language to Norwegian and verify content', () => {
    // Click the language switcher button
    cy.get('[aria-label="Switch to Norwegian"]').click();

    // Verify that the language has switched to Norwegian
    cy.get('body').should('contain.text', 'Bytt til Engelsk');
    cy.get('body').should('contain.text', 'AI Automatisering for Norske Bedrifter');
  });

  it('should switch language to English and verify content', () => {
    // Click the language switcher button to switch to Norwegian first
    cy.get('[aria-label="Switch to Norwegian"]').click();

    // Click the language switcher button to switch back to English
    cy.get('[aria-label="Switch to English"]').click();

    // Verify that the language has switched to English
    cy.get('body').should('contain.text', 'Switch to Norwegian');
    cy.get('body').should('contain.text', 'AI Automation Solutions');
  });

  it('should navigate to About section and verify content', () => {
    // Click the About link in the navbar
    cy.get('a[href="#about"]').click();

    // Verify that the About section is visible
    cy.get('#about').should('be.visible');
    cy.get('#about').should('contain.text', 'About');
  });

  it('should navigate to Contact section and verify content', () => {
    // Click the Contact link in the navbar
    cy.get('a[href="#contact-cta"]').click();

    // Verify that the Contact section is visible
    cy.get('#contact-cta').should('be.visible');
    cy.get('#contact-cta').should('contain.text', 'Contact Me');
  });
});
