/* eslint-disable no-trailing-spaces */
/* eslint-disable no-const-assign */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable indent */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable radix */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const bc = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const express = require('express');
const pool = require('./models/db');
const auth = require('./middleware/auth');

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Accept,Authorization,Content-Type,X-Requested-With,Content,Origin'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST,GET,PATCH,DELETE,PUT,OPTIONS'
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const admin = req.body.empid.substring(0, 3).toUpperCase();

  const query = 'SELECT * FROM signup';
  pool.connect((err, client, done) => {
    if (err) {
      console.log(`Error connecting ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, (error, result) => {
      done();
      if (error) {
        console.log(`Error collecting data ${err}`);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const results = result.rows;
      const user = results.find((item) => item.empid === req.body.empid);
      bc.compare(req.body.password, user.password)
        .then(() => {
          // console.log(signup.getEmpId());
          if (req.body.empid !== user.empid) {
            return req.status(401).json({ error: 'Unauthorized' });
          }

          const token = jwt.sign(
            {
              userId: req.body.empid,
              admin: admin === 'ADM',
              email: user.email
            },
            'RANDOM_TOKEN_SECRET',
            {
              expiresIn: '24hr'
            }
          );
          return res.status(200).json({
            status: 'success',
            data: {
              message: 'Login successful',
              token
            }
          });
          // res.redirect('/');
        })
        .catch(() => {
          console.log('error pocessing employee');
          return res.status(401).json({ error: 'Unauthorized' });
        });
    });
  });
});
app.listen(process.env.PORT || 11000, () => {
  console.log('Listening on port 11000');
});
