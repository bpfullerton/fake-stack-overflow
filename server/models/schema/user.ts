import { Schema } from 'mongoose';
/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each user includes the following fields:
 * - `username`: The user's name.
 * - `token`: The user's authentication token.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { collection: 'User' },
);

export default userSchema;
