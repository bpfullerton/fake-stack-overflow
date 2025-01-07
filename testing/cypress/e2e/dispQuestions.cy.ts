import { registerCommand } from 'cypress-wait-for-stable-dom';
import { Q1_DESC, Q2_DESC, Q3_DESC, Q4_DESC } from '../../../server/data/posts_strings';
import { db_uri, stabilizer_options } from '../fixtures/util_data.json';
registerCommand();

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

  it('1.1 | Adds three questions and one answer, then click "Questions", then click unanswered button, verifies the sequence', () => {
    // add a question
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    // add another question
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question B");
    cy.get("#formTextInput").type("Test Question B Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    // add another question
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question C");
    cy.get("#formTextInput").type("Test Question C Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    // add an answer to question A
    cy.contains("Test Question A").click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#answerTextInput").type("Answer Question A");
    cy.contains("Post Answer").click().waitForStableDOM(stabilizer_options);

    // go back to main page
    cy.contains("Questions").click().waitForStableDOM(stabilizer_options);

    // clicks unanswered
    cy.contains("Unanswered").click().waitForStableDOM(stabilizer_options);

    const qTitles = ["Test Question C", "Test Question B"];
    cy.get(".postTitle").each(($el, index, $list) => {
      console.log("$el:", $el);
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("1.2 | Check if questions are displayed in descending order of dates.", () => {
    const qTitles = [
      Q4_DESC,
      Q3_DESC,
      Q2_DESC,
      Q1_DESC,
    ];

    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("1.3 | successfully shows all questions in model in active order", () => {
    const qTitles = [
      Q1_DESC,
      Q2_DESC,
      Q4_DESC,
      Q3_DESC,
    ];
    cy.contains("Active").click().waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });
});