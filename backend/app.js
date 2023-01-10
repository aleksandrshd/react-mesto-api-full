require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { apiLimiter } = require('./utils/apiLimiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');
const { PORT, MONGO_IP, MONGO_PORT } = require('./utils/config');

const app = express();

app.use(cors());

app.use(helmet());

app.use(apiLimiter);

app.use(bodyParser.json());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

mongoose.connect(`mongodb://${MONGO_IP}:${MONGO_PORT}/mestodb`, {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
  });
});
