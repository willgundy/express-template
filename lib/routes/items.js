const { Router } = require('express');
const Item = require('../models/Item');

module.exports = Router()
  .post('/', async ({ body, user }, res, next) => {
    try {
      const item = await Item.insert({ ...body, user_id: user.id });
      res.json(item);
    } catch (e) {
      next(e);
    }
  });
