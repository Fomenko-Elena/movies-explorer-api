const { celebrate, Joi } = require('celebrate');
const { JoiHelper } = require('../utils/utils');

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: JoiHelper.email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    email: JoiHelper.email().required(),
    password: Joi.string().required(),
    name: JoiHelper.userName(),
  }),
});

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    email: JoiHelper.email().required(),
    name: JoiHelper.userName(),
  }),
});

module.exports.validateMovieIdParam = celebrate({
  params: Joi.object().keys({
    movieId: JoiHelper.id().required(),
  }),
});

module.exports.validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: JoiHelper.url().required(),
    trailerLink: JoiHelper.url().required(),
    thumbnail: JoiHelper.url().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
