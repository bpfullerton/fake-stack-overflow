import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Gets the token given a user's credentials.
 *
 * @param username - The username of the user.
 *
 * @throws Error if there is an issue fetching the token.
 *
 * @returns The token of the user.
 */
const getToken = async (username: string): Promise<string> => {
  const res = await api.get(`${USER_API_URL}/getToken/${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching token');
  }
  return res.data;
};

/**
 * Adds a new user to the database.
 *
 * @param username - The username of the user.
 * @param token - The token of the user.
 *
 * @returns The user object.
 */
const userLogin = async (username: string): Promise<string> => {
  const res = await api.post(`${USER_API_URL}/userLogin`, { username });
  if (res.status !== 201) {
    throw new Error('Error while adding user');
  }
  return res.data;
};

export { getToken, userLogin };
