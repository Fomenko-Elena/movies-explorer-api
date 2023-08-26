const { Joi } = require('celebrate');
const validator = require('validator');

module.exports.URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]{0,1}\.([a-zA-Z]{1,6}|[a-zA-Z0-9-]{1,30}\.[a-zA-Z]{2,3}))([a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+)+$/;

module.exports.noVersionKeyOptions = { versionKey: false };

module.exports.noVersionKeyProjection = '-__v';

module.exports.JoiHelper = {
  id: () => Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  userName: () => Joi.string().min(2).max(30),
  url: () => Joi.string().pattern(module.exports.URL_REGEX),
  email: () => Joi.string().custom((value, helper) => {
    if (!validator.isEmail(value)) {
      return helper.message('Некорректный email');
    }
    return value;
  }),
};
