
// const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
// const app = require('../lib/app');

describe('/api/v1/items', () => {
  beforeEach(setupDb);

  it('POST / creates a new shopping item with the current user', async () => {
    const { agent, user } = await signUpUser();

    const newItem = { description: 'eggs' };
    const { status, body } = await agent.post('/api/v1/items').send(newItem);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newItem,
      id: expect.any(String),
      user_id: user.id,
      created_at: expect.any(String)
    });
  });
  
  it('GET / returns all items associated with the authenticated User', async () => {
    const { agent } = await signUpUser();
    const { body: user1Item } = await agent.post('/api/v1/items').send({
      description: 'apples'
    });

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { body: user2Item } = await agent2.post('/api/v1/items').send({
      description: 'eggs'
    });

    const resp1 = await agent.get('/api/v1/items');
    expect(resp1.status).toEqual(200);
    expect(resp1.body).toEqual([user1Item]);

    const resp2 = await agent2.get('/api/v1/items');
    expect(resp2.status).toEqual(200);
    expect(resp2.body).toEqual([user2Item]);
  });
});
