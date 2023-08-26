const router = require('express').Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('../middlewares/cors');
const {
  requestLogger,
  errorLogger,
} = require('../middlewares/logger');
const {
  addUser,
  login,
  logoff,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const otherErrors = require('../middlewares/errors');
const { NotFoundError } = require('../utils/errors');
const { validateSignUp, validateSignIn } = require('./validation');
const { rateLimitSettings } = require('../utils/constants');

router.use(rateLimit(rateLimitSettings));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(requestLogger);
router.use(cors);
router.use(helmet());

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, addUser);
router.post('/signout', logoff);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => next(new NotFoundError('Страница по указанному маршруту не найдена')));

router.use(errorLogger);
router.use(errors());
router.use(otherErrors);

module.exports = router;
