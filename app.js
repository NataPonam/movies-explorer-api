const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/filmsdb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(cors);

app.use(router);

app.use(errorLogger);
app.use(errors());

// app.listen(PORT);
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
