const { setupDb, signUpUser } = require('./utils.js');
// const request = require('supertest');
// const app = require('../lib/app');

describe('/api/v1/user', () => {
  beforeEach(setupDb);

  it('/signup', async () => {
    const res = await signUpUser();

    expect(res.user).toEqual({
      id: expect.any(String),
      email: res.user.email,
    });

    const { statusCode } = await res.agent.get('/api/v1/user/verify');
    expect(statusCode).toBe(200);
  });

  it('/signup with duplicate email', async () => {
    await signUpUser();
    const { res } = await signUpUser();
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: 400,
      message: 'Email already exists',
    });
  });
});
