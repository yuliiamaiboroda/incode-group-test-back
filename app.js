const express = require('express');
const cors = require('cors');
const logger = require('morgan');
require('dotenv').config();
// Todo: fix on index files in routes

const authRouter = require('./routes/api/auth');

const { globalErrorHandler } = require('./middlewares');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(globalErrorHandler);

module.exports = app;
