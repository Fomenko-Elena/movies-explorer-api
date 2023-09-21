require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { MONGODB_URI, PORT } = require('./utils/settings');

const app = express();

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
});

app.use(require('./routes'));

app.listen(PORT);
