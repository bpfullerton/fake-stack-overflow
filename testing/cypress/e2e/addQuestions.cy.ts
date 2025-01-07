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


  it("2.1 | Ask a Question creates and displays expected meta data", () => {
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question Q1");
    cy.get("#formTextInput").type("Test Question Q1 Text T1");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);
    cy.contains("Fake Stack Overflow");
    cy.contains("5 questions");
    cy.contains("testuser asked 0 seconds ago");
    const answers = [
      "0 answers",
      "1 answers",
      "2 answers",
      "3 answers",
      "2 answers",
    ];
    const views = [
      "0 views",
      "0 views",
      "2 views",
      "1 views",
      "3 views",
    ];
    cy.get(".postStats").each(($el, index, $list) => {
      cy.wrap($el).should("contain", answers[index]);
      cy.wrap($el).should("contain", views[index]);
    });
    cy.contains("Unanswered").click().waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").should("have.length", 1);
    cy.contains("1 question");
  });

  it("2.2 | Ask a Question with empty title shows error", () => {
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);
    cy.contains("Title cannot be empty");
  });
});