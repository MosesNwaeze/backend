/* eslint-disable consistent-return */
/* eslint-disable no-console */
const bc = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

module.exports = (req, res) => {
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
      if (!user || !req.body) {
        return res.status(401).json({
          status: 'Error',
          data: {
            message: 'Invalid User',
          },
        });
      }
      bc.compare(req.body.password, user.password)
        .then(() => {
          if (req.body.empid !== user.empid) {
            return req.status(401).json({
              status: 'Error',
              data: {
                message: 'Invalid User',
              },
            });
          }

          const token = jwt.sign(
            {
              userId: req.body.empid,
              email: user.email,
            },
            'RANDOM_TOKEN_SECRET',
            {
              expiresIn: '2hr',
            },
          );
          return res.status(200).json({
            status: 'success',
            data: {
              message: 'Signin successful',
              token,
            },
          });
          // res.redirect('/');
        })
        .catch(() => {
          console.log('error pocessing employee');
          return res.status(401).json({
            status: 'Error',
            data: {
              message: 'Unauthorized',
            },
          });
        });
    });
  });
};
