/* eslint-disable no-console */
/* eslint-disable consistent-return */
const bc = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

exports.createAdmin = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const query1 = `INSERT INTO admins (adminid,firstname,lastname,email,password,status,
    jobrole,department,address,gender) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
  const query2 = 'INSERT INTO signup (email,password,empid) values($1,$2,$3)';
  const admin = req.body.department.toUpperCase();
  const isAdmin = req.body.empid.substr(0, 3).toUpperCase() === 'ADM';

  if (isAdmin && admin === 'ADMINISTRATION') {
    bc.hash(req.body.password, 10)
      .then((hash) => {
        pool.connect((error, client, done) => {
          if (error) {
            done();
            console.log(error);
            return res.status(500).json({
              status: 'Error',
              data: {
                message: 'Internal Server Error',
              },
            });
          }
          // Insert into the signup table
          client.query(query2, [req.body.email, hash, req.body.empid], (err) => {
            if (err) {
              done();
              console.log(err);
              return res.status(500).json({
                status: 'Error',
                data: {
                  message: 'Internal Server error',
                },
              });
            }
          });
        });
        // insert into Admin table
        pool.connect((error, client, done) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              status: 'Error',
              data: {
                message: 'Internal Server Error',
              },
            });
          }
          client.query(
            query1,
            [
              req.body.empid,
              req.body.firstname,
              req.body.lastname,
              req.body.email,
              hash,
              true,
              req.body.jobrole,
              req.body.department,
              req.body.address,
              req.body.gender,
            ],
            (err) => {
              if (err) {
                done();
                console.log(err);
                res.status(500).json({
                  status: 'Error',
                  data: {
                    message: 'Internal Server Error',
                  },
                });
              }
            },
          );
        });
        const token = jwt.sign(
          { userId: req.body.empid, email: req.body.email },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '2hr' },
        );
        return res.status(201).json({
          status: 'Success',
          data: {
            userId: req.body.empid,
            token,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(501).json({
          status: 'Error',
          data: {
            message: err,
          },
        });
      });
  }
};
