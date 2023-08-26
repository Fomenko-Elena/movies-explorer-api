require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const {
  PORT = 3000,
  MONGODB_URI = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

const app = express();

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});

app.use(require('./routes'));

app.listen(PORT);
