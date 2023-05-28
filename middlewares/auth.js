require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors/allErrors');
const { NODE_ENV, JWT_SECRET, JWT_SECRET_STRING } = require('../utils/constants');
const { UNAUTHORIZED } = require('../utils/errorTypes');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized(UNAUTHORIZED));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_STRING);
  } catch (err) {
    return next(new Unauthorized(UNAUTHORIZED));
  }
  req.user = payload;
  return next();
};
