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
  
  const clientData = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const isAdmin = payload.userId.substr(0, 3).toUpperCase() === 'ADM';
  if(clientData.department === 'Administration') {
	  return res.status(401).json({
		  status: 'Error',
		  data: {
			  message: 'User of this account must be an admin',
		  }
	  });
  }
  if (isAdmin) {
    try {
      bc.hash(clientData.password, 10).then((hash) => {
        // push data to the signup relation
        pool.connect((err, client, done) => {
          const query = 'INSERT INTO public.signup (email,password,empid,firstname,lastname) values($1,$2,$3,$4,$5)';

          if (err) {
            done();
            console.log(`Error connecting ${err}`);
            res.status(500).json({
				status: 'error',
				data: {
					message: 'Internal Server Error'
				}
			});
          }
          client.query(query, [clientData.email, hash, clientData.employeeid, clientData.firstname, clientData.lastname], (error) => {
            done();
            if (error) {
              console.log(`Unable to query database ${error}`);
              res.status(500).json({
				  status: 'error',
				  data: {
					  message: 'Internal Server Error'
				  }
			  });
            }
          });
        });

        // New employee
        pool.connect((err, client, done) => {
          const query = 'INSERT INTO public.employees (empid,firstname,lastname,email,password,jobrole,address,department,status,gender) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
          if (err) {
            console.log(`Error connecting ${err}`);
            res.status(500).json({
				status: 'error',
				data: {
					message: 'Internal Server Error'
				}
			});
          }
          client.query(
            query,
            [
              clientData.employeeid,
              clientData.firstname,
              clientData.lastname,
              clientData.email,
              hash,
              clientData.jobrole,
              clientData.address,
              clientData.department,
              true,
              clientData.gender
            ],
            (error) => {
              done();
              if (error) {
                console.log(`Error Inserting data ${error}`);
                res.status(500).json({
					status: 'error',
					data: {
						message: 'Internal Server Error'
					}
				});
              }

              const tokens = jwt.sign(
                {
                  userId: clientData.employeeid,
                  email: clientData.email
                },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '2hr' }
              );
              res.status(201).json({
                status: 'success',
                data: {
                  message: 'User account created successfully',
                  token: tokens,
                  userId: clientData.employeeid
                }
              });
            }
          );
        });
      });
    } catch (err) { console.error(err)}

  } else {
    return res.status(401).json({
      status: 'error',
      data: {
        message: 'You have to login as an admin in order to create an account'
      }
    });
  }
};

exports.updateAccount = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.3 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above'
      }
    });
  }

  const { email } = req.params;
  const data = req.body;
  const query = `UPDATE employees SET empid = $1, firstname = $2, lastname = $3, email = $4,
  gender = $5, jobrole = $6, department = $7, address = $8 WHERE email = $9`;
  
  pool.connect((error, client, done) => {
    if(error) {
      done();
      console.log(error);
      return res.status(500).json({
        status: 'error',
        data: {
          message: error.message
        }
      });
    }
    client.query(
     query, 
     [
      data.employeeid,
      data.firstname,
      data.lastname,
      data.email,
      data.gender,
      data.jobrole,
      data.department,
      data.address,
      email,
     ],
     (err) => {
      done();
      if(err) {
        console.log(error);
        return res.status(500).json({
          status: 'error',
          data: {
            message: err.message
          }
        });
      }

      return res.status(201).json({
        status: 'success',
        data: {
          message: 'Account successfully updated!'
        }
      })
    });
  });
  
}

exports.fetchAccount = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.3 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above'
      }
    });
  }

  const {email} = req.params;
  const query = "SELECT * FROM employees WHERE email = $1";
  pool.connect((error, client, done) => {
    if(error) {
      done();
      console.error(error);
      return res.status(500).json({
        status: 'error',
        data: {
          message: 'Internal Server Error'
        }
      });
    }
    client.query(query, [email], (err, results) => {
      done();
      if(err) {
        console.error(error);
        return res.status(500).json({
          status: 'error',
          data: {
            message: 'Internal Server Error'
          }
        });
      }
      const result = results.rows;
      res.status(201).json({
        status: 'success',
        data: {
          result
        }
      });

    });
  });
}