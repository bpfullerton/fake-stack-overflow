import { db_uri, stabilizer_options } from '../fixtures/util_data.json';

describe("Cypress Tests to verify creating new chats to one or more users", () => {
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
    
    it('Should successfully create a chat to one existing user', () => {
        // Create a new user 'test_user_2' to send a message to testuser
        cy.contains('Logout').click().waitForStableDOM(stabilizer_options);
        cy.contains('Welcome to FakeStackOverflow!');
        cy.get('#usernameInput').type('test_user_2');
        cy.get('#passwordInput').type('123456');
        cy.get('.login-button').click().waitForStableDOM(stabilizer_options);
        // Typing the username 'testuser' into the form should start a new chat
        cy.contains('Messages').click().waitForStableDOM(stabilizer_options);
        cy.get('#newChatInput').type('testuser');
        cy.contains('Submit').click().waitForStableDOM(stabilizer_options);
        cy.get('.sidebar').contains('testuser');
    });

    it('Should successfully create a group chat with existing users', () => {
        // Typing in multiple existing usernames separated by commas should start a new chat
        cy.contains('Messages').click().waitForStableDOM(stabilizer_options);
        cy.get('#newChatInput').type('monkeyABC, elephantCDE, ihba001');
        cy.contains('Submit').click().waitForStableDOM(stabilizer_options);
        cy.get('.sidebar').contains('Nothing yet...');
    });

});