require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./utils/rateLimit');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const {
  NODE_ENV, PORT, DATABASE, MONGODB_URL,
} = require('./utils/constants');
const { serverError } = require('./errors/allErrors');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DATABASE : MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(requestLogger);
app.use(cors);

app.use(limiter);
app.use(router);

app.use(errorLogger);
app.use(errors());

app.use(serverError);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
