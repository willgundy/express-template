const { Router } = require('express');
const List = require('../models/List');
const items = require('./items.js');

module.exports = Router()
  .param('listId', (req, res, next, listId) => {
    req.listId = listId;
    next();
  })

  .use('/:listId/items', items)

  .post('/', async ({ body, user }, res, next) => {
    try {
      const list = await List.create(body, user.id);
      res.json(list);
    } catch (e) {
      next(e);
    }
  })

  .get('/:listId', async ({ listId, user }, res, next) => {
    try {
      const list = await List.findByUserId(listId, user.id);
      res.json(list);
    } catch (e) {
      next(e);
    }
  })

  .get('/', async ({ user }, res, next) => {
    try {
      const lists = await List.findAllByUserId(user.id);
      res.json(lists);
    } catch (e) {
      next(e);
    }
  })

  .put('/:listId', async ({ listId, user, body }, res, next) => {
    try {
      const list = await List.updateByUserId(listId, body, user.id);
      res.json(list);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:listId', async ({ listId, user }, res, next) => {
    try {
      const count = await List.deleteByUserID(listId, user.id);
      res.json({ deleted: !!count });
    } catch (e) {
      next(e);
    }
  });

