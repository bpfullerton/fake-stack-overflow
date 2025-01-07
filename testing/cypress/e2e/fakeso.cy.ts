import {
  A1_TXT,
  A2_TXT,
  Q1_DESC,
  Q2_DESC,
  Q3_DESC,
  Q4_DESC,
} from '../../../server/data/posts_strings';
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
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("1.2 | Check if questions are displayed in descending order of dates.", () => {
    const qTitles = [Q4_DESC, Q3_DESC, Q2_DESC, Q1_DESC];

    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("1.3 | successfully shows all questions in model in active order", () => {
    const qTitles = [Q1_DESC, Q2_DESC, Q4_DESC, Q3_DESC];
    cy.contains("Active").click().waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("2.1 | Adds multiple questions one by one and displays them in All Questions", () => {
    // Add multiple questions
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question 1");
    cy.get("#formTextInput").type("Test Question 1 Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question 2");
    cy.get("#formTextInput").type("Test Question 2 Text");
    cy.get("#formTagInput").type("react");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("Test Question 3");
    cy.get("#formTextInput").type("Test Question 3 Text");
    cy.get("#formTagInput").type("java");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);

    // verify the presence of multiple questions in most recently added order.
    cy.contains("Fake Stack Overflow");
    const qTitles = [
      "Test Question 3",
      "Test Question 2",
      "Test Question 1",
      Q4_DESC,
      Q3_DESC,
      Q2_DESC,
      Q1_DESC,
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });

    // verify that when clicking "Unanswered", the unanswered questions are shown
    cy.contains("Unanswered").click().waitForStableDOM(stabilizer_options);
    const qTitlesUnanswered = [
      "Test Question 3",
      "Test Question 2",
      "Test Question 1",
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitlesUnanswered[index]);
    });
  });

  it("2.2 | Ask a Question creates and displays expected meta data", () => {
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

  it("2.3 | Ask a Question with empty title shows error", () => {
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTextInput").type("Test Question 1 Text Q1");
    cy.get("#formTagInput").type("javascript");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);
    cy.contains("Title cannot be empty");
  });

  it("3.1 | Search for a question using text content that does not exist", () => {
    const searchText = "Web3";

    cy.get("#searchBar").type(`${searchText}{enter}`).waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").should("have.length", 0);
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
    const qTitles = [Q2_DESC, Q1_DESC];
    cy.get("#searchBar").type("[javascript]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("4.3 | Search a question by tag (t3)", () => {
    const qTitles = [Q4_DESC, Q2_DESC];
    cy.get("#searchBar").type("[android-studio]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("4.4 | Search a question by tag (t4)", () => {
    const qTitles = [Q4_DESC, Q2_DESC];
    cy.get("#searchBar").type("[shared-preferences]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("4.5 | Search for a question using a tag that does not exist", () => {
    cy.get("#searchBar").type("[nonExistentTag]{enter}").waitForStableDOM(stabilizer_options);
    cy.get(".postTitle").should("have.length", 0);
  });

  it("5.1 | Created new answer should be displayed at the top of the answers page", () => {
    const answers = ["Test Answer 1", A1_TXT, A2_TXT];
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
    cy.contains(Q2_DESC).click().waitForStableDOM(stabilizer_options);
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

    const qTitles = ["Test Question A", Q2_DESC, Q1_DESC, Q4_DESC, Q3_DESC];
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

  it("9.1 | Adds a question with a hyperlink and verifies", () => {
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type("How to add a hyperlink in Markdown?");
    cy.get("#formTextInput").type(
      "Here is a link: [Google](https://www.google.com)",
    );
    cy.get("#formTagInput").type("markdown");
    cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);
    cy.contains("How to add a hyperlink in Markdown?").click().waitForStableDOM(stabilizer_options);
    cy.get("#questionBody")
      .find("a")
      .should("have.attr", "href", "https://www.google.com");
  });

  it("9.2 | Create new answer should be displayed at the top of the answers page", () => {
    const answers = [
      "Check this link for more info: [Documentation](https://docs.example.com)",
      A1_TXT,
      A2_TXT,
    ];
    cy.contains(Q1_DESC).click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#answerTextInput").type(
      "Check this link for more info: [Documentation](https://docs.example.com)",
    );
    cy.contains("Post Answer").click().waitForStableDOM(stabilizer_options);
    cy.get(".answerText")
      .first()
      .within(() => {
        cy.get("a").should("have.attr", "href", "https://docs.example.com");
      });
    cy.contains("testuser");
    cy.contains("0 seconds ago");
  });

  it("9.3 | Tries to add a question with an invalid hyperlink and verifies failure", () => {
    const invalidUrls = [
      "[Google](htt://www.google.com)",
      "[Microsoft](microsoft.com)",
      "[](https://www.google.com/)",
      "[link]()",
      "dfv[]()",
      "[link](http://www.google.com/)",
      "[Google](https//www.google.com)",
      "[GitHub](http//github.com)",
      "[Facebook](https:/facebook.com)",
      "[Twitter](://twitter.com)",
      "[Netflix](htps://www.netflix)",
      "[Google](htts://www.goo<gle.com)",
      "[Google](http://www.google)",
      "[Dropbox](ttps://www.dropbox.c-m)",
      "[LinkedIn](ps:/www.linkedin.com)",
      "[Adobe](ttps://www.adobe..com)",
      "[Spotify](ttp:///www.spotify.com)",
      "[Reddit](http://reddit)",
      "[Wikipedia](tps://www.wikipedia=com)",
    ];
    cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#formTitleInput").type(
      "How to add an invalid hyperlink in Markdown?"
    );
    invalidUrls.forEach((url) => {
      cy.get("#formTextInput").clear().type(`This is an invalid link: ${url}`);
      cy.get("#formTagInput").clear().type("markdown");
      cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);
      cy.contains("Invalid hyperlink");
    });
    
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get('#usernameInput').type('testuser');
    cy.get('#passwordInput').type('123456');
    cy.get('.login-button').click().waitForStableDOM(stabilizer_options);
    cy.contains("How to add an invalid hyperlink in Markdown?").should(
    "not.exist"
    );
  });

  it("9.4 | Attempts to add an answer with an invalid hyperlink and verifies failure", () => {
    cy.contains(Q1_DESC).click().waitForStableDOM(stabilizer_options);
    cy.contains("Answer Question").click().waitForStableDOM(stabilizer_options);
    cy.get("#answerTextInput").type(
      "Check this invalid link: [](https://wrong.url)",
    );
    cy.contains("Post Answer").click().waitForStableDOM(stabilizer_options);
    cy.contains("Invalid hyperlink");
    cy.visit("http://localhost:3000");
    cy.contains('Welcome to FakeStackOverflow!');
    cy.get('#usernameInput').type('testuser');
    cy.get('#passwordInput').type('123456');
    cy.get('.login-button').click().waitForStableDOM(stabilizer_options);
    cy.contains(Q1_DESC).click().waitForStableDOM(stabilizer_options);
    cy.get(".answerText").should("not.contain", "https://wrong.url");
  });

  it("9.5 | Adds multiple questions with valid hyperlinks and verify", () => {
    // List of question data
    const questions = [
      {
        title: "Test Question 1",
        text: "Test Question 1 Text [Google](https://www.google.com)",
        tag: "javascript",
        link: "https://www.google.com",
      },
      {
        title: "Test Question 2",
        text: "Test Question 2 Text [Yahoo](https://www.yahoo.com)",
        tag: "react",
        link: "https://www.yahoo.com",
      },
      {
        title: "How to add a hyperlink in Markdown?",
        text: "Here is a link: [Google](https://www.google.com)",
        tag: "markdown",
        link: "https://www.google.com",
      },
    ];

    // Add multiple questions with hyperlinks
    questions.forEach((question) => {
      cy.contains("Ask a Question").click().waitForStableDOM(stabilizer_options);
      cy.get("#formTitleInput").type(question.title);
      cy.get("#formTextInput").type(question.text);
      cy.get("#formTagInput").type(question.tag);
      cy.contains("Post Question").click().waitForStableDOM(stabilizer_options);
    });

    cy.contains("Questions").click().waitForStableDOM(stabilizer_options);
    questions.reverse().forEach((q) => {
      cy.contains(q.title).click().waitForStableDOM(stabilizer_options);
      cy.get("#questionBody").find("a").should("have.attr", "href", q.link);
      cy.contains("Questions").click().waitForStableDOM(stabilizer_options);
    });
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
