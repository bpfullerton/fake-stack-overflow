import { Q1_DESC, Q2_DESC, Q3_DESC, Q4_DESC } from '../../../server/data/posts_strings';
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


  it("6.1 | Adds a question, click active button, verifies the sequence", () => {
    // add a question
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    // add an answer to question of React Router
    cy.contains(Q1_DESC).click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#answerTextInput").type("Answer to React Router");
    cy.contains("Post Answer").click().waitForStableDOM(stabilizer_options);

    // go back to main page
    cy.contains("Questions").click().waitForStableDOM(stabilizer_options);

    // add an answer to question of Android Studio
    cy.contains(
      Q2_DESC
    ).click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#answerTextInput").type("Answer to android studio");
    cy.contains("Post Answer").click().waitForStableDOM(stabilizer_options);

    // go back to main page
    cy.contains("Questions").click().waitForStableDOM(stabilizer_options);

    // add an answer to question A
    cy.contains("Test Question A").click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#answerTextInput").type("Answer Question A");
    cy.contains("Post Answer").click().waitForStableDOM(stabilizer_options);

    // go back to main page
    cy.contains("Questions").click().waitForStableDOM(stabilizer_options);

    // clicks active
    cy.contains("Active").click().waitForStableDOM(stabilizer_options);

    const qTitles = [
      "Test Question A",
      Q2_DESC,
      Q1_DESC,
      Q4_DESC,
      Q3_DESC,
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("6.2 | Checks if a6 and a7 exist in q3 answers page", () => {
    const answers = [
      "Using GridFS to chunk and store content.",
      "Storing content as BLOBs in databases.",
    ];

    cy.contains(Q3_DESC).click().waitForStableDOM(stabilizer_options);
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
  });

  it("6.3 | Checks if a8 exist in q4 answers page", () => {
    cy.contains(Q4_DESC).click().waitForStableDOM(stabilizer_options);
    cy.contains("Store data in a SQLLite database.");
  });
});
