/* eslint-disable consistent-return */
/* eslint-disable no-console */
const bc = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

module.exports = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const query = 'SELECT * FROM signup';
  pool.connect((err, client, done) => {
    if (err) {
      console.log(`Error connecting ${err}`);
      return res.status(500).json({
		status: 'error',
		data: {
		 message: 'Internal Server Error',
		}
	 });
    }
    client.query(query, (error, result) => {
      done();
      if (error) {
        console.log(`Error collecting data ${err}`);
        return res.status(500).json({
			status: 'error',
			data: {
				message: 'Internal Server Error',
			}
		});
      }
      const data = Object.keys(req.body);
      const requestData = JSON.parse(data);

	//console.log(JSON.parse(req.body).employeeid);
      const results = result.rows;
      const user = results.find((item) => item.empid === requestData.employeeid);
      if (!user || !req.body) {
        return res.status(401).json({
          status: 'error',
          data: {
            message: 'Invalid User',
          },
        });
      }
      bc.compare(requestData.password, user.password)
        .then(() => {
          if (requestData.employeeid !== user.empid) {
            return req.status(401).json({
              status: 'error',
              data: {
                message: 'Invalid User',
              },
            });
          }

          const token = jwt.sign(
            {
              userId: requestData.employeeid,
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
              email: user.email,
              userId: requestData.employeeid,
              firstname: user.firstname,
              lastname: user.lastname,

            },
          });
          // res.redirect('/');
        })
        .catch(() => {
          console.log('error pocessing employee');
          return res.status(401).json({
            status: 'error',
            data: {
              message: 'Unauthorized',
            },
          });
        });
    });
  });
};
