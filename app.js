const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorHandler = require('./src/utils/errorHandler');
const routes = require('./src/routes');
const { requestLogger, errorLogger } = require('./src/middlewares/logger');
const { PORT, DATABASE_URL } = require('./src/configs');

const app = express();

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server crash');
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose.connect(DATABASE_URL);
app.listen(PORT);
