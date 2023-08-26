const router = require('express').Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('../middlewares/cors');
const {
  requestLogger,
  errorLogger,
} = require('../middlewares/logger');
const { celebrate, Joi, errors } = require('celebrate');
const { JoiHelper } = require('../utils/utils');
const {
  addUser,
  login,
  logoff,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const otherErrors = require('../middlewares/errors');
const { NotFoundError } = require('../utils/errors');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(requestLogger);
router.use(cors);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: JoiHelper.email().required(),
      password: JoiHelper.userPassword().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: JoiHelper.email().required(),
      password: JoiHelper.userPassword().required(),
      name: JoiHelper.userName(),
    }),
  }),
  addUser,
);

router.post(
  '/signout',
  logoff,
);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => next(new NotFoundError('Страница по указанному маршруту не найдена')));

router.use(errorLogger);
router.use(errors());
router.use(otherErrors);

module.exports = router;
