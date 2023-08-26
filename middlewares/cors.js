const { allowedCors } = require('../utils/constants');

const OPTIONS = 'OPTIONS';
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);

    const accessControlRequestHeaders = req.headers['access-control-request-headers'];
    if (method === OPTIONS) {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', accessControlRequestHeaders);
      return res.send();
    }
  }

  return next();
};
