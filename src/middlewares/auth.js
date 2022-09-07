const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');
const { JWT_SECRET } = require('../configs');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('You need to be authorized');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('You need to be authorized');
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
