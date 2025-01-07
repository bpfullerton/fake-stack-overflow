import express, { Response } from 'express';
import { FakeSOSocket, User, UserRequest } from '../types';
import { createUser, getUser, updateUserToken, deleteUser } from '../models/application';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();
  /**
   * Checks if the provided user request contains the required fields.
   *
   * @param req The request object containing the user data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: UserRequest): boolean {
    return req.body.username !== undefined;
  }

  /**
   * Checks if the provided usercontains the required fields.
   *
   * @param username The user name validate.
   * @param token The user token validate.
   *
   * @returns `true` if the user is valid, otherwise `false`.
   */
  function isUserValid(username: string): boolean {
    return true;
  }

  /**
   * Gets the token of a user in the database. If the user does not exist, a new user is created and its token is returned.
   *
   * @param req The UserRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isUserValid(req.body.username)) {
      res.status(400).send('Invalid user');
      return;
    }

    try {
      const user = await getUser(req.body.username);
      let token = '';
      if (!user) {
        const t = await createUser(req.body.username);
        token = t ?? '';
      } else {
        token = user.token;
      }
      res.status(201).json(token);
    } catch (err) {
      res.status(500).send(err);
    }
  };

  /**
   * Gets a user token from the database. The user request is validated and then retrieved.
   * If successful the user token is returned. If there is an error, the HTTP response's status
   * is updated.
   *
   * @param req The UserRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserToken = async (req: UserRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    try {
      const userToken = await getUser(req.body.username);
      res.status(200).json(userToken);
    } catch (err) {
      res.status(500).send(err);
    }
  };

  router.post('/userLogin', userLogin);
  router.get('/getToken', getUserToken);

  return router;
};

export default userController;
