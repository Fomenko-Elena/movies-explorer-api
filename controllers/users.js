const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoServerError } = require('mongoose').mongo;
const User = require('../models/user');
const {
  noVersionKeyProjection,
  noVersionKeyOptions,
} = require('../utils/utils');
const {
  PASSWORD_SALT_LENGTH,
  SECRET_KEY,
  JWT_OPTIONS,
  COOKIE_OPTIONS,
  COOKIE_NAME,
  HTTP_CREATED,
} = require('../utils/constants');
const {
  NotFoundError,
  DuplicateError,
} = require('../utils/errors');

function chekUserNotNull(user, userId) {
  if (!user) {
    throw new NotFoundError(`Запрашиваемый пользователь не найден. Id: ${userId}`);
  }
}

function checkDuplicateError(error) {
  if (error instanceof MongoServerError && error.code === 11000) {
    return new DuplicateError('Пользователь с таким email уже существует');
  }
  return error;
}

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User
    .findById(_id, noVersionKeyProjection)
    .then((user) => {
      chekUserNotNull(user, _id);
      res.send(user);
    })
    .catch(next);
};

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, PASSWORD_SALT_LENGTH)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const result = user.toJSON({
        useProjection: true,
        ...noVersionKeyOptions,
      });
      res.status(HTTP_CREATED).send(result);
    })
    .catch((error) => next(checkDuplicateError(error)));
};

module.exports.updateCurrentUser = (req, res, next) => {
  const { email, name } = req.body;
  const { _id } = req.user;
  User
    .findByIdAndUpdate(
      _id,
      { email, name },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      chekUserNotNull(user, _id);
      res.send(user.toJSON(noVersionKeyOptions));
    })
    .catch((error) => next(checkDuplicateError(error)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        SECRET_KEY,
        JWT_OPTIONS,
      );
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS).send({ message: 'Авторизация успешна' });
    })
    .catch(next);
};

module.exports.logoff = (req, res) => res
  .clearCookie(COOKIE_NAME)
  .send({ message: 'Сессия завершена' });
