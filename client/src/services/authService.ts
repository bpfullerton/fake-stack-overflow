import api from './config';

const AUTH_API_URL = `${process.env.REACT_APP_SERVER_URL}/auth`;

/**
 * Logs in a user.
 *
 * @param username - The username of the user.
 * @param password - The password of the user.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const login = async (username: string, password: string): Promise<boolean> => {
  const data = { username, password };

  let res: { data: { is_ok: boolean } };
  try {
    res = await api.post(`${AUTH_API_URL}/login`, data);
  } catch (error) {
    return false;
  }
  return res.data.is_ok;
};

export default login;
