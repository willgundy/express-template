
const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
const app = require('../lib/app');

describe('/api/v1/items', () => {
  beforeEach(setupDb);

  async function addGroceryList(agent) {
    const { body } = await agent
      .post('/api/v1/lists')
      .send({ name: 'groceries' });
    return body;
  }

  it('POST / creates a new shopping item with the current user', async () => {
    const { agent } = await signUpUser();
    const list = await addGroceryList(agent);

    const newItem = { description: 'eggs', qty: 12 };
    const { status, body } = await agent.post(`/api/v1/lists/${list.id}/items`).send(newItem);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newItem,
      id: expect.any(Number),
      bought: false,
      listId: list.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });
  
  it.skip('GET / returns all items associated with the authenticated User', async () => {
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

  it.skip('GET /:id should get an item', async () => {
    const { agent } = await signUpUser();

    const { body: item } = await agent.post('/api/v1/items').send({
      description: 'apples'
    });
    const { status, body: got } = await agent.get(`/api/v1/items/${item.id}`);

    expect(status).toBe(200);
    expect(got).toEqual(item);
  });

  it.skip('GET / should return a 401 if not authenticated', async () => {
    const { status } = await request(app).get('/api/v1/items');
    expect(status).toEqual(401);
  });

  it.skip('UPDATE /:id should update an item', async () => {
    const { agent } = await signUpUser();

    const { body: item } = await agent.post('/api/v1/items').send({
      description: 'apples'
    });

    const { status, body: updated } = await agent
      .put(`/api/v1/items/${item.id}`)
      .send({ description: 'eggs' });

    expect(status).toBe(200);
    expect(updated).toEqual({ ...item, description: 'eggs' });
  });

  it.skip('UPDATE /:id should 403 for invalid users', async () => {
    const { agent } = await signUpUser();

    const { body: item } = await agent.post('/api/v1/items').send({
      description: 'apples'
    });

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { status, body } = await agent2
      .put(`/api/v1/items/${item.id}`)
      .send({ description: 'eggs' });

    expect(status).toBe(403);
    expect(body).toEqual({
      status: 403,
      message: 'You do not have access to view this page',
    });
  });

  it.skip('DELETE /:id should delete items for valid user', async () => {
    const { agent } = await signUpUser();
    const list = await addGroceryList(agent);

    const newItem = { description: 'eggs', qty: 12 };
    const { body: item } = await agent.post(`/api/v1/lists/${list.id}/items`).send(newItem);

    const { status, body } = await agent.delete(`/api/v1/items/${item.id}`);
    expect(status).toBe(200);
    expect(body).toEqual(item);

    const { body: items } = await agent.get('/api/v1/items');

    expect(items.length).toBe(0);
  });
});
