require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const {
  BadRequest, ConflictError, NotFound, Unauthorized,
} = require('../errors/allErrors');
const {
  USER_ID_NOT_FOUND, SAME_USER_ERROR, SAME_EMAIL_ERROR, BAD_REQUEST, EMAIL_OR_PASSWORD_ERROR,
} = require('../utils/errorTypes');

const { NODE_ENV, JWT_SECRET } = process.env;

// регистрация
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((newUser) => {
      res.status(200).send({
        name: newUser.name,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(SAME_EMAIL_ERROR));
      } else if (err.name === 'ValidationError') {
        return next(new BadRequest(BAD_REQUEST));
      } return next(err);
    });
};

// вход
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized(EMAIL_OR_PASSWORD_ERROR);
      }
      return bcrypt.compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            throw new Unauthorized(EMAIL_OR_PASSWORD_ERROR);
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.status(200).send({ token });
        });
    })
    .catch(next);
};

// текущий пользователь
const currentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      throw new NotFound(USER_ID_NOT_FOUND);
    })
    .catch((err) => { next(err); });
};

// обновление данных пользователя
const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw next(new NotFound(USER_ID_NOT_FOUND));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(SAME_USER_ERROR));
      } else if (err.name === 'ValidationError') {
        return next(new BadRequest(BAD_REQUEST));
      } return next(err);
    });
};

module.exports = {
  createUser, currentUser, login, updateUser,
};
