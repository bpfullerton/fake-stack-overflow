import 'cypress-file-upload';
import { db_uri, stabilizer_options } from '../fixtures/util_data.json';

describe("Cypress Tests to verify sending messages", () => {
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

    it('Should successfully send a message to an existing one-person chat', () => {
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
        // Typing a message and clicking send should send and display the message
        cy.get('[data-testid="message-input"]').type('test message');
        cy.get('.str-chat__send-button').click().waitForStableDOM(stabilizer_options);
        cy.get('.str-chat__list').contains('test message');
        cy.get('[data-testid="message-input"]').type('test message 2');
        cy.get('.str-chat__send-button').click().waitForStableDOM(stabilizer_options);
        cy.get('.str-chat__list').contains('test message 2');
    });

    it('Should successfully send a message to an existing group chat', () => {
        // Typing the username 'testuser' into the form should start a new chat
        cy.contains('Messages').click().waitForStableDOM(stabilizer_options);
        cy.get('#newChatInput').type('sana, saltyPeter, hamkalo');
        cy.contains('Submit').click().waitForStableDOM(stabilizer_options);
        // Typing a message and clicking send should send and display the message
        cy.get('[data-testid="message-input"]').type('test message');
        cy.get('.str-chat__send-button').click().waitForStableDOM(stabilizer_options);
        cy.get('.str-chat__list').contains('test message');
        cy.get('[data-testid="message-input"]').type('test message 2');
        cy.get('.str-chat__send-button').click().waitForStableDOM(stabilizer_options);
        cy.get('.str-chat__list').contains('test message 2');
    });

    it('Should successfully send a file upload to an existing chat', () => {
        const fileInputSelector = '[data-testid="file-input"]';
        const fileName = 'testfile_chat.txt';

        // Create a new user 'test_user_2' to send a file to testuser
        cy.contains('Logout').click().waitForStableDOM(stabilizer_options);
        cy.contains('Welcome to FakeStackOverflow!');
        cy.get('#usernameInput').type('test_user_2');
        cy.get('#passwordInput').type('123456');
        cy.get('.login-button').click().waitForStableDOM(stabilizer_options);
        // Typing the username 'testuser' into the form should start a new chat
        cy.contains('Messages').click().waitForStableDOM(stabilizer_options);
        cy.get('#newChatInput').type('testuser');
        cy.contains('Submit').click().waitForStableDOM(stabilizer_options);
        // Upload a file to the file input
        //cy.get(fileInputSelector).click().waitForStableDOM(stabilizer_options);
        cy.fixture(fileName).then(fileContent => {
            cy.get(fileInputSelector).attachFile({
                fileContent,
                fileName,
                mimeType: 'text/plain',
            });
        });
        // Sending the attached file should add it to the chat
        cy.get('.str-chat__send-button').click().waitForStableDOM(stabilizer_options);
        
    });

});