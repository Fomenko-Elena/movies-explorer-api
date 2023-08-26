require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { JoiHelper } = require('./utils/utils');
const {
  addUser,
  login,
  logoff,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const otherErrors = require('./middlewares/errors');
const cors = require('./middlewares/cors');
const { NotFoundError } = require('./utils/errors');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

const {
  PORT = 3000,
  MONGODB_URI = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

const app = express();

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(cors);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: JoiHelper.email().required(),
      password: JoiHelper.userPassword().required(),
    }),
  }),
  login,
);

app.post(
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

app.post(
  '/signout',
  logoff,
);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('*', (req, res, next) => next(new NotFoundError('Страница по указанному маршруту не найдена')));

app.use(errorLogger);
app.use(errors());
app.use(otherErrors);

app.listen(PORT);
