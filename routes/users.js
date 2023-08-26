const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser,
  updateCurrentUser,
} = require('../controllers/users');
const { JoiHelper } = require('../utils/utils');

router.get('/me', getCurrentUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: JoiHelper.email().required(),
      name: JoiHelper.userName().required(),
    }),
  }),
  updateCurrentUser,
);

module.exports = router;
