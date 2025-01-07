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

  it("3.1 | Search for a question using text content that does not exist", () => {
    const searchText = "Web3";

    cy.get("#searchBar").type(`${searchText}{enter}`).waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").should("have.length", 0);
  });

  it("3.2 | Search string in question text", () => {
    const qTitles = [Q3_DESC];
    cy.get("#searchBar").type("40 million{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("3.3 | earch string in question text", () => {
    const qTitles = [Q4_DESC];
    cy.get("#searchBar").type("data remains{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("4.1 | Search a question by tag (t1)", () => {
    const qTitles = [Q1_DESC];
    cy.get("#searchBar").type("[react]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("4.2 | Search a question by tag (t2)", () => {
    const qTitles = [
      Q2_DESC,
      Q1_DESC,
    ];
    cy.get("#searchBar").type("[javascript]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("4.3 | Search a question by tag (t3)", () => {
    const qTitles = [
      Q4_DESC,
      Q2_DESC,
    ];
    cy.get("#searchBar").type("[android-studio]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("4.4 | Search a question by tag (t4)", () => {
    const qTitles = [
      Q4_DESC,
      Q2_DESC,
    ];
    cy.get("#searchBar").type("[shared-preferences]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("4.5 | Search for a question using a tag that does not exist", () => {
    cy.get("#searchBar").type("[nonExistentTag]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").should("have.length", 0);
  });
});
