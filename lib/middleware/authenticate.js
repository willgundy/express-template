

const { verify } = require('../utils/jwtToken.js');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    if (!cookie) throw new Error('You must be signed in to continue');

    const user = verify(cookie);

    req.user = user;

    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

