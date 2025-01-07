import { db_uri, stabilizer_options } from '../fixtures/util_data.json';

describe("Cypress Tests to verify asking new questions", () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec(`npx ts-node ../server/remove_db.ts ${db_uri}/fake_so`);
        cy.exec(`npx ts-node ../server/populate_db.ts ${db_uri}/fake_so`);

        // Log in before each test in order to initialize the current userspace
        cy.visit('http://localhost:3000');
        cy.contains('Welcome to FakeStackOverflow!');
        cy.get('#usernameInput').type('testuser');
        cy.get('#passwordInput').type('123456');
        cy.get('.login-button').click().waitForStableDOM(stabilizer_options);
    });
    

    it('Should successfully login with correct credentials', () => {
        cy.contains('All Questions');
        cy.contains('Ask a Question');
    });

    it('Should successfully log out from the home page', () => {
        cy.contains('Logout').click().waitForStableDOM(stabilizer_options);
        cy.contains('Welcome to FakeStackOverflow!');
        cy.contains('Please enter your account.');
        cy.get('#usernameInput').should('exist');
        cy.get('#passwordInput').should('exist');
        cy.get('.login-button').should('exist');
    });

    it('Should show an error with incorrect password', () => {
        cy.contains('Logout').click().waitForStableDOM(stabilizer_options);
        cy.contains('Welcome to FakeStackOverflow!');
        cy.get('#usernameInput').type('testuser');
        cy.get('#passwordInput').type('abababa');
        cy.get('.login-button').click().waitForStableDOM(stabilizer_options);
        cy.contains('Login failed');
    });
});