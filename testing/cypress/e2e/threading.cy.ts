import { db_uri, stabilizer_options } from '../fixtures/util_data.json';

describe("Cypress tests to verify making and using threads", () => {
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
    
    it('Should successfully create a new thread for a question', () => {
        // Go to question and create a thread
        cy.contains('Quick question about storage on android').click().waitForStableDOM(stabilizer_options);
        cy.get('#q_thread').find('.threadNameInput').type('New Thread');
        cy.get('#q_thread').contains('Create Thread').click().waitForStableDOM(stabilizer_options);
        // Should be taken to the new thread's message page
        cy.get('.display').should('be.visible');
        cy.get('.sidebar').contains('New Thread');
    });

    it('Should successfully create a new thread for an answer', () => {
        // Go to question and create a thread from one of the answers
        cy.contains('Object storage for a web application').click().waitForStableDOM(stabilizer_options);
        cy.get('#a_thread').first().find('.threadNameInput').type('New Thread');
        cy.get('#a_thread').first().contains('Create Thread').click().waitForStableDOM(stabilizer_options);
        // Should be taken to the new thread's message page
        cy.get('.display').should('be.visible');
        cy.get('.sidebar').contains('New Thread');
    });

    it('Navigate to an existing thread from its question/answer', () => {
        // Go to question and create a thread
        cy.contains('android studio save string shared preference, start activity and load the saved string')
        .click().waitForStableDOM(stabilizer_options);
        cy.get('#q_thread').find('.threadNameInput').type('New Thread');
        cy.get('#q_thread').contains('Create Thread').click().waitForStableDOM(stabilizer_options);
        // Should be taken to the new thread's chat
        cy.get('.display').should('be.visible');
        cy.get('.sidebar').contains('New Thread');
        // Go back to question
        cy.contains('Questions').click().waitForStableDOM(stabilizer_options);
        cy.contains('android studio save string shared preference, start activity and load the saved string')
        .click().waitForStableDOM(stabilizer_options);
        // Clicking on the created thread should take the user back to the chat
        cy.contains('New Thread').click().waitForStableDOM(stabilizer_options);
        cy.get('.display').should('be.visible');
        cy.get('.sidebar').contains('New Thread');
    });

    it('Send a message within an existing thread', () => {
        // Go to the question and make a new thread
        cy.contains('Programmatically navigate using React router').click().waitForStableDOM(stabilizer_options);
        cy.get('#a_thread').first().find('.threadNameInput').type('New Thread');
        cy.get('#a_thread').first().contains('Create Thread').click().waitForStableDOM(stabilizer_options);
        // Should be taken to the chat
        cy.get('.display').should('be.visible');
        cy.get('.sidebar').contains('New Thread').click().waitForStableDOM(stabilizer_options);
        // Typing a message and clicking send should send and display the message
        cy.get('[data-testid="message-input"]').type('test message');
        cy.get('.str-chat__send-button').click().waitForStableDOM(stabilizer_options);
        cy.get('.str-chat__list').contains('test message');
    });
});