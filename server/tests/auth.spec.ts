import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';

describe('POST /login', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should fail if data is missing', async () => {
    const response = await supertest(app).post('/auth/login');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      is_ok: false,
    });
  });
  it('should fail if username is missing', async () => {
    const response = await supertest(app).post('/auth/login').send({ password: 'bad' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      is_ok: false,
    });
  });
  it('should fail if password is missing', async () => {
    const response = await supertest(app).post('/auth/login').send({ username: 'kimsherry0416' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      is_ok: false,
    });
  });
  it('should fail if username is empty', async () => {
    const response = await supertest(app)
      .post('/auth/login')
      .send({ username: '', password: 'bad' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      is_ok: false,
    });
  });
  it('should fail if password is empty', async () => {
    const response = await supertest(app)
      .post('/auth/login')
      .send({ username: 'kimsherry0416', password: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      is_ok: false,
    });
  });
  it('should fail if password is wrong', async () => {
    const response = await supertest(app)
      .post('/auth/login')
      .send({ username: 'kimsherry0416', password: 'asdf' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      is_ok: false,
    });
  });
  it('should success if password is correct', async () => {
    const response = await supertest(app)
      .post('/auth/login')
      .send({ username: 'kimsherry0416', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      is_ok: true,
    });
  });
});
