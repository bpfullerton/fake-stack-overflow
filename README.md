[CS 4530 Fundamentals of Software Engineering Final Report.pdf](https://github.com/user-attachments/files/17970403/CS.4530.Fundamentals.of.Software.Engineering.Final.Report.pdf)The individual and team project for this class are designed to mirror the experiences of a software engineer joining a new development team: you will be “onboarded” to our codebase, make several individual contributions, and then form a team to propose, develop and implement new features. The codebase that we’ll be developing on is a Fake Stack Overflow project (let’s call it HuskyFlow). You will get an opportunity to work with the starter code which provides basic skeleton for the app and then additional features will be proposed and implemented by you! All implementation will take place in the TypeScript programming language, using React for the user interface.

Refer to the [Project Overview](https://neu-se.github.io/CS4530-Fall-2024/assignments/project-overview) for more instructions on the project deliverables and expectations.

{ : .note } Refer to [IP1](https://neu-se.github.io/CS4530-Fall-2024/assignments/ip1) and [IP2](https://neu-se.github.io/CS4530-Fall-2024/assignments/ip2) for instructions related to setting up MongoDB, setting environment variables, and running the client and server.

{ : .note } The fields of the Schemas were changed. As a result, features such as view counts will not work on database entries that were made in IP1 and IP2. If you want to test features, delete old database entries and make new questions either through manually making it in the client or run populate_db.ts.

## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](class-diagram.png)

## Installation Guide
- On both `./server` and `./client` run: `npm install` to install all dependencies.
- Create a `.env` file in `./client` and paste the following into it: `REACT_APP_SERVER_URL=http://localhost:8000`
- Create a `.env` file in `./server` and paste the following into it:
  - `MONGODB_URI=mongodb+srv://[user]:[pw]@db-cs4530-f24-911.14jmu.mongodb.net`
  - `CLIENT_URL=http://localhost:3000`
  - `PORT=8000`
- Run `npx ts-node ./server/populate_db.ts` to populate the initial database.

## Running the Project
- On a separate terminal within `./server`, run `npm run start`.
- On a separate terminal within `./client`, run `npm run start`.
    - If not opened automatically, go to `localhost:3000` in your browser.

## Login and Feature Instructions
For the purposes of this assignment, our login system uses a *static password* that is the same for all users. In a secure real-world product, this app would have a more robust login system with unique private passwords for each user.

**The login password for our site is '123456'.**
Your username may be whatever you like.

Further documentation on how to use our implemented features is included in the User Manual section within our final report:

[CS 4530 Fundamentals of Software Engineering Final Report.pdf](https://github.com/user-attachments/files/17970404/CS.4530.Fundamentals.of.Software.Engineering.Final.Report.pdf)
