const MongoStore = require('rate-limit-mongo');

const {
  PORT = 3000,
  MONGODB_URI = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

module.exports.PORT = PORT;

module.exports.MONGODB_URI = MONGODB_URI;

module.exports.PASSWORD_SALT_LENGTH = 10;

module.exports.HTTP_CREATED = 201;

const {
  NODE_ENV,
  JWT_SECRET,
  CORS_LIST,
  COOKIE_DOMAIN,
} = process.env;
const isProd = NODE_ENV === 'production';

module.exports.isProd = isProd;

module.exports.SECRET_KEY = isProd ? JWT_SECRET : 'mjS2yitfZGHArmjphff3E6Q1D3ONTttU';
module.exports.JWT_OPTIONS = {
  expiresIn: '7d',
};
module.exports.COOKIE_NAME = 'token';
module.exports.COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24 * 7 * 1000,
  domain: COOKIE_DOMAIN || null,
};

module.exports.allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3001',
].concat(((CORS_LIST && JSON.parse(CORS_LIST)) || []));

module.exports.rateLimitSettings = {
  windowMs: 5 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  store: new MongoStore({
    uri: MONGODB_URI,
    expireTimeMs: 5 * 60 * 1000,
  }),
};
