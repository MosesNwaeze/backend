/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: 'error',
      data: {
        message: 'Please signin',
      },
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const empId = payload.userId;
  try {
    pool.connect((err, client, done) => {
      if (err) {
        console.log(`Unable to connect to db ${err}`);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      client.query('Select * FROM signup', (error, result) => {
        done();
        if (error) {
          console.log(`Error retrieving data ${error}`);
          res.status(500).json({ error: 'Internal Server Error' });
        }
        const row = result.rows;
        const users = row.find((user) => user.empid === empId);
        if (users) {
          next();
        } else {
          throw new Error('Invalid user!');
        }
      });
    });
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
