import express, { Response } from 'express';
import {
  Answer,
  AnswerRequest,
  AnswerResponse,
  CreateThreadRequest,
  FakeSOSocket,
  GetThreadsRequest,
} from '../types';
import {
  addAnswerToQuestion,
  addChatToQA,
  getChatFromQA,
  populateDocument,
  saveAnswer,
} from '../models/application';

const answerController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: AnswerRequest): boolean {
    return !!req.body.qid && !!req.body.ans;
  }

  /**
   * Checks if the provided answer contains the required fields.
   *
   * @param ans The answer object to validate.
   *
   * @returns `true` if the answer is valid, otherwise `false`.
   */
  function isAnswerValid(ans: Answer): boolean {
    return !!ans.text && !!ans.ansBy && !!ans.ansDateTime;
  }

  /**
   * Adds a new answer to a question in the database. The answer request and answer are
   * validated and then saved. If successful, the answer is associated with the corresponding
   * question. If there is an error, the HTTP response's status is updated.
   *
   * @param req The AnswerRequest object containing the question ID and answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addAnswer = async (req: AnswerRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isAnswerValid(req.body.ans)) {
      res.status(400).send('Invalid answer');
      return;
    }

    const { qid } = req.body;
    const ansInfo: Answer = req.body.ans;

    try {
      const ansFromDb = await saveAnswer(ansInfo);

      if ('error' in ansFromDb) {
        throw new Error(ansFromDb.error as string);
      }

      const status = await addAnswerToQuestion(qid, ansFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      const populatedAns = await populateDocument(ansFromDb._id?.toString(), 'answer');

      if (populatedAns && 'error' in populatedAns) {
        throw new Error(populatedAns.error as string);
      }

      // Populates the fields of the answer that was added and emits the new object
      socket.emit('answerUpdate', {
        qid,
        answer: populatedAns as AnswerResponse,
      });
      res.json(ansFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding answer: ${(err as Error).message}`);
    }
  };

  /**
   * Creates a new thread on an answer. The request must contain the question ID (qid) and the username.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The CreateThreadRequest object containing the question ID, the username and the chat id.
   * @param res The HTTP response object used to send back the result of the operation.
   */
  const createThread = async (req: CreateThreadRequest, res: Response): Promise<void> => {
    const { qid, username, threadId } = req.body;
    try {
      const status = await addChatToQA(qid, threadId, 'answer');
      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }
      res.json({ msg: status, threads: status.threads });
    } catch (err: unknown) {
      res.status(500).send(`Error when creating thread: ${(err as Error).message}`);
    }
  };

  /**
   * Gets a list of threads for an answer. The request must contain the question ID (qid).
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The Request object containing the question ID.
   * @param res The HTTP response object used to send back the result of the operation.
   */
  const getThreads = async (req: GetThreadsRequest, res: Response): Promise<void> => {
    const { qid } = req.body;
    try {
      const threads = await getChatFromQA(qid, 'answer');
      if ('error' in threads) {
        throw new Error(threads.error);
      }
      res.json(threads);
    } catch (err: unknown) {
      res.status(500).send(`Error when fetching threads: ${(err as Error).message}`);
    }
  };
  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addAnswer', addAnswer);
  router.post('/createThread', createThread);
  router.get('/getThreads', getThreads);

  return router;
};

export default answerController;
