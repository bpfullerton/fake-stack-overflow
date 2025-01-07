import express, { Response, Router } from 'express';
import { AuthRequest, AuthResponse } from '../types';

const authController = () => {
  const router: Router = express.Router();

  /**
   * Requests a user login.
   *
   * @param req The HTTP request object
   * @param res The HTTP response object used to send back the authentication result
   *
   * @returns A Promise that resolves to void.
   */
  const login = async (req: AuthRequest, res: Response): Promise<void> => {
    const data = req.body;
    if (
      !data ||
      !('username' in data) ||
      !('password' in data) ||
      !data.username ||
      !data.password
    ) {
      res.status(400).json({
        is_ok: false,
      } as AuthResponse);
      return;
    }
    const { password } = data;
    // NOTE: Skip implementation of account system
    if (password === '123456') {
      res.status(200).json({
        is_ok: true,
      } as AuthResponse);
    } else {
      res.status(400).json({
        is_ok: false,
      } as AuthResponse);
    }
  };
  // Add appropriate HTTP verbs and their endpoints to the router.
  router.post('/login', login);

  return router;
};

export default authController;
