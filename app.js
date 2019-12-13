const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const articleRouter = require('./routes/article-route');
const gifRouter = require('./routes/gif-route');
const flagRouter = require('./routes/flag-route');
const loginRouter = require('./routes/login-route');
const feedRouter = require('./routes/feed-route');
const createUserRouter = require('./routes/create-user-route');
const doc = require('./routes/doc');


// CORS implementation
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Accept,Authorization,Content-Type,X-Requested-With,Content,Origin,Accept-Version');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PATCH,DELETE,PUT,OPTIONS');
  next();
});

// Body parser for json object
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1', articleRouter);
app.use('/api/v1', gifRouter);
app.use('/api/v1', flagRouter);
app.use('/api/v1', loginRouter);
app.use('/api/v1', feedRouter);
app.use('/api/v1', createUserRouter.user);
app.use('/api/v1', createUserRouter.admin);
app.use('/api/v1', doc);

module.exports = app;
