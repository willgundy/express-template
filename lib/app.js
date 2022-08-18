const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const user = require('./routes/user');
const notFound = require('./middleware/not-found');
const error = require('./middleware/error');
const authenticate = require('./middleware/authenticate');
const items = require('./routes/items');

const app = express();

// Built in middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cookieParser());

// App routes
app.use('/api/v1/user', user);
app.use('/api/v1/items', authenticate, items);

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(notFound);
app.use(error);

module.exports = app;

