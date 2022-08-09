const { Router } = require('express');
const Item = require('../models/Item');
const authorizeItem = require('../middleware/authorize');

module.exports = Router()
  .post('/', async ({ body, user }, res, next) => {
    try {
      const item = await Item.insert({ ...body, user_id: user.id });
      res.json(item);
    } catch (e) {
      next(e);
    }
  })
  
  .get('/:id', authorizeItem, async (req, res, next) => {
    try {
      const item = await Item.getById(req.params.id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })
  
  .get('/', async ({ user }, res, next) => {
    try {
      const items = await Item.getAll(user.id);
      res.json(items);
    } catch (e) {
      next(e);
    }
  })
  
  .put('/:id', authorizeItem, async (req, res, next) => {
    try {
      const item = await Item.updateById(req.params.id, req.user.id, req.body);
      res.json(item);
    } catch (e) {
      next(e);
    }
  })

  .delete('/:id', authorizeItem, async (req, res, next) => {
    try {
      const item = await Item.delete(req.params.id);
      res.json(item);
    } catch (e) {
      next(e);
    }
  });
