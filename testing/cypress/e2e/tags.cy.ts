import { Q1_DESC, Q4_DESC } from '../../../server/data/posts_strings';
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

  it("7.1 | Adds a question with tags, checks the tags existied", () => {
    // add a question with tags
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("test1 test2 test3");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    // clicks tags
    cy.contains("Tags").click().waitForStableDOM(stabilizer_options);
    cy.contains("test1");
    cy.contains("test2");
    cy.contains("test3");
  });

  it("7.2 | Checks if all tags exist", () => {
    // all tags exist in the page
    cy.contains("Tags").click().waitForStableDOM(stabilizer_options);
    cy.contains("react", { matchCase: false });
    cy.contains("javascript", { matchCase: false });
    cy.contains("android-studio", { matchCase: false });
    cy.contains("shared-preferences", { matchCase: false });
    cy.contains("storage", { matchCase: false });
    cy.contains("website", { matchCase: false });
  });

  it("7.3 | Checks if all questions exist inside tags", () => {
    // all question no. should be in the page
    cy.contains("Tags").click().waitForStableDOM(stabilizer_options);
    cy.contains("6 Tags");
    cy.contains("1 question");
    cy.contains("2 question");
  });

  it("8.1 | go to question in tag react", () => {
    // all question no. should be in the page
    cy.contains("Tags").click().waitForStableDOM(stabilizer_options);
    cy.contains("react").click().waitForStableDOM(stabilizer_options);
    cy.contains(Q1_DESC);
  });

  it("8.2 | go to questions in tag storage", () => {
    // all question no. should be in the page
    cy.contains("Tags").click().waitForStableDOM(stabilizer_options);
    cy.contains("storage").click().waitForStableDOM(stabilizer_options);
    cy.contains(Q4_DESC);
  });

  it("8.3 | create a new question with a new tag and finds the question through tag", () => {
    // add a question with tags
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question A");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("test1-tag1");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    // clicks tags
    cy.contains("Tags").click().waitForStableDOM(stabilizer_options);
    cy.contains("test1-tag1").click().waitForStableDOM(stabilizer_options);
    cy.contains("Test Question A");
  });

  it("10.1 | Clicks on a tag and verifies the tag is displayed", () => {
    const tagNames = "javascript";

    cy.contains("Tags").click().waitForStableDOM(stabilizer_options);

    cy.contains(tagNames).click().waitForStableDOM(stabilizer_options);
    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });

  it("10.2 | Clicks on a tag in homepage and verifies the questions related tag is displayed", () => {
    const tagNames = "storage";

    //clicks the 3rd tag associated with the question.
    cy.get(".question_tag_button").eq(2).click().waitForStableDOM(stabilizer_options);

    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });
});
