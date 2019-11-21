/* eslint-disable no-undef */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bc = require('bcrypt');
const pool = require('../models/db');

exports.createAccount = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.3 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above'
      }
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const isAdmin = payload.userId.substr(0, 3).toUpperCase() === 'ADM';
  if (isAdmin) {
    try {
      bc.hash(req.body.password, 10).then((hash) => {
        // push data to the signup relation
        pool.connect((err, client, done) => {
          const query = 'INSERT INTO public.signup (email,password,empid) values($1,$2,$3)';

          if (err) {
            done();
            console.log(`Error connecting ${err}`);
            res.status(500).json({ error: 'Internal Server Error' });
          }
          client.query(query, [req.body.email, hash, req.body.empid], (error) => {
            done();
            if (error) {
              console.log(`Unable to query database ${error}`);
              res.status(500).json({ error: 'Internal Server Error' });
            }
          });
        });

        // New employee
        pool.connect((err, client, done) => {
          const query = 'INSERT INTO public.employees (empid,firstname,lastname,email,password,jobrole,address,department,status,gender) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
          if (err) {
            console.log(`Error connecting ${err}`);
            res.status(500).json({ error: 'Internal Server Error' });
          }
          client.query(
            query,
            [
              req.body.empid,
              req.body.firstname,
              req.body.lastname,
              req.body.email,
              hash,
              req.body.jobrole,
              req.body.address,
              req.body.department,
              true,
              req.body.gender
            ],
            (error) => {
              done();
              if (error) {
                console.log(`Error Inserting data ${error}`);
                res.status(500).json({ error: 'Internal Server Error' });
              }

              const tokens = jwt.sign(
                {
                  userId: req.body.empid,
                  email: req.body.email
                },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '2hr' }
              );
              res.status(201).json({
                status: 'success',
                data: {
                  message: 'User account created successfully',
                  token: tokens,
                  userId: req.body.empid
                }
              });
            }
          );
        });
      });
    } catch (err) {
      return res.status(401).json({ error: new Error('Invalid user') });
    }
  } else {
    return res.status(401).json({
      status: 'Error',
      data: {
        message: 'You have to login as an admin in order to create an account'
      }
    });
  }
};
