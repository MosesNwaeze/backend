/* eslint-disable no-console */
/* eslint-disable consistent-return */
const bc = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

const createAdmin = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }

  
  const clientData = req.body;
  const query1 = 'INSERT INTO admins (adminid,firstname,lastname,email,password,status,jobrole,department,address,gender) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
  const query2 = 'INSERT INTO signup (email,password,empid,firstname,lastname) values($1,$2,$3,$4,$5)';
  const admin = clientData.department.toUpperCase();
  const isAdmin = clientData.employeeid.substr(0, 3).toUpperCase() === 'ADM';

  if (isAdmin && admin === 'ADMIN') {

    bc.hash(clientData.password, 10)
      .then((hash) => {
        pool.connect((error, client, done) => {
          if (error) {
            done();
            console.log(error);
            return res.status(500).json({
              status: 'error',
              data: {
                message: 'Internal Server Error',
              },
            });
          }
          // Insert into the signup table
          client.query(query2, [clientData.email, hash, clientData.employeeid, clientData.firstname, clientData.lastname], (err) => {
            if (err) {
              done();
              console.log(err);
              return res.status(500).json({
                status: 'error',
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
              status: 'error',
              data: {
                message: 'Internal Server Error',
              },
            });
          }

          client.query(
            query1,
            [
              clientData.employeeid,
              clientData.firstname,
              clientData.lastname,
              clientData.email,
              hash,
              true,
              clientData.jobrole,
              clientData.department,
              clientData.address,
              clientData.gender,
            ],
            (err) => {
              if (err) {
                done();
                console.log(err);
                res.status(500).json({
                  status: 'error',
                  data: {
                    message: 'Internal Server Error',
                  },
                });
              }
            },
          );
        });
        const token = jwt.sign(
          { userId: clientData.employeeid, email: clientData.email },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '2hr' },
        );
        return res.status(201).json({
          status: 'success',
          data: {
            userId: clientData.employeeid,
            token,
            firstname: clientData.firstname,
            lastname: clientData.lastname
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(501).json({
          status: 'error',
          data: {
            message: err,
          },
        });
      });
  }
};
module.exports = createAdmin;