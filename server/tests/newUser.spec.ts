import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';

const createUserSpy = jest.spyOn(util, 'createUser');
const getUserSpy = jest.spyOn(util, 'getUser');

describe('POST /userLogin', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should create a new user and return a token', async () => {
    const mockReqBody = {
      username: 'testUser',
    };

    const mockUser = {
      username: 'testUser',
      token: 'testToken',
    };
    getUserSpy.mockResolvedValueOnce(null);
    createUserSpy.mockResolvedValueOnce(mockUser.token);

    const response = await supertest(app).post('/user/userLogin').send(mockReqBody).expect(201);

    expect(response.body).toBe(mockUser.token);
  });

  it('should return a token for an existing user', async () => {
    const mockReqBody = {
      username: 'testUser',
    };

    const mockUser = {
      username: 'testUser',
      token: 'test Token',
    };
    getUserSpy.mockResolvedValueOnce(mockUser);

    const response = await supertest(app).post('/user/userLogin').send(mockReqBody).expect(201);

    expect(response.body).toBe(mockUser.token);
  });

  it('should return a 400 status for an invalid request', async () => {
    const mockReqBody = {
      token: '',
    };

    const response = await supertest(app).post('/user/userLogin').send(mockReqBody).expect(400);

    expect(response.text).toBe('Invalid request');
  });
});
