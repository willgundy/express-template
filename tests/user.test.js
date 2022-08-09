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
});
