const { Router } = require('express');
const Item = require('../models/Item');

module.exports = Router({ mergeParams: true })
  .param('itemId', (req, res, next, itemId) => {
    req.itemId = itemId;
    next();
  })

  .post('/', async ({ body, listId }, res, next) => {
    try {
      const item = await Item.createItem(body, listId);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .put('/:itemId', async ({ listId, itemId, body }, res, next) => {
    try {
      const item = await Item.updateItem(itemId, body, listId);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:itemId', async ({ listId, itemId }, res, next) => {
    try {
      const count = await Item.deleteItem(itemId, listId);
      res.json({ deleted: !!count });
    } catch (e) {
      next(e);
    }
  });