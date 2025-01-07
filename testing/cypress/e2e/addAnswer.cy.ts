import { A1_TXT, A2_TXT, Q1_DESC } from '../../../server/data/posts_strings';
import { db_uri, stabilizer_options } from '../fixtures/util_data.json';
describe("Cypress Tests to verify adding new answers", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec(`npx ts-node ../server/populate_db.ts ${db_uri}/fake_so`);

    // Log in before each test in order to initialize the current userspace
    cy.visit('http://localhost:3000');
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get('#usernameInput').type('testuser');
    cy.get('#passwordInput').type('123456');
    cy.get('.login-button').click().waitForStableDOM(stabilizer_options);
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec(`npx ts-node ../server/remove_db.ts ${db_uri}/fake_so`);
  });

  it("5.1 | Created new answer should be displayed at the top of the answers page", () => {
    const answers = [
      "Test Answer 1",
      A1_TXT,
      A2_TXT,
    ];
    cy.contains(Q1_DESC).click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#answerTextInput").type(answers[0]);
    cy.contains("Post Answer").click().waitForStableDOM(stabilizer_options);
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
    cy.contains("testuser");
    cy.contains("0 seconds ago");
  });


  it("5.3 | Answer is mandatory when creating a new answer", () => {
    cy.contains(Q1_DESC).click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer Question").click().waitForStableDOM(stabilizer_options);
    cy.contains("Post Answer").click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer text cannot be empty");
  });
});
