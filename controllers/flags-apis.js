/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const pool = require('../models/db');


exports.flaggedArticle = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const query = 'INSERT INTO public.flags(article, flaggedon) values($1, $2)';
  const { id } = req.params;
  const flaggedOn = new Date();
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({
		  status: 'error',
		  data: {
			  message: 'Internal Server Error'
		  }
	  });
    }
    client.query(query, [parseInt(id), flaggedOn], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
			status: 'error',
			data: {
				message: 'Internal Server Error'
			}
		});
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Article flag successfully',
          flaggedOn,
        },
      });
    });
  });
};

exports.flaggedGif = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const query = 'INSERT INTO public.flags(gif, flaggedon) values($1, $2)';
  const { id } = req.params;
  const flaggedOn = new Date();
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({
		status: 'error',
		data: {
		  message: 'Internal Server Error'
		}
	  });
    }
    client.query(query, [parseInt(id), flaggedOn], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
			status: 'error',
			data: {
				message: 'Internal Server Error'
			}
		});
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Gif flag successfully',
          flaggedOn,
        },
      });
    });
  });
};

exports.flaggedArticleComment = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const { id } = req.params;
  const query = 'INSERT INTO public.flags(articlecomment, flaggedon)values($1, $2)';
  const flaggedOn = new Date();
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({
	  			status: 'error',
	  			data: {
	  				message: 'Internal Server Error'
	  			}
		});
    }
    client.query(query, [parseInt(id), flaggedOn], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
					status: 'error',
					data: {
						message: 'Internal Server Error'
					}
		});
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'comment flagged successfully',
          flaggedOn,
        },
      });
    });
  });
};

exports.flaggedGifComment = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const { id } = req.params;
  const query = 'INSERT INTO public.flags(gifcomment, flaggedon)values($1, $2)';
  const flaggedOn = new Date();
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({
	  			status: 'error',
	  			data: {
	  				message: 'Internal Server Error'
	  			}
		});
    }
    client.query(query, [parseInt(id), flaggedOn], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
					status: 'error',
					data: {
						message: 'Internal Server Error'
					}
		});
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'comment flagged successfully',
          flaggedOn,
        },
      });
    });
  });
};


exports.deleteFlagged = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const empId = payload.userId;
  const isAdmin = empId.substr(0, 3).toUpperCase() === 'ADM';
  if (isAdmin) {
    const query = 'DELETE FROM flags';
    pool.connect((error, client, done) => {
      if (error) {
        done();
        console.log(error);
        return res.status(500).json({
					status: 'error',
					data: {
						message: 'Internal Server Error'
					}
		});
      }
      client.query(query, (err) => {
        done();
        if (err) {
          console.log(err);
          return res.status(500).json({
		  			status: 'error',
		  			data: {
		  				message: 'Internal Server Error'
		  			}
		});
        }

        return res.status(200).json({
          status: 'success',
          data: {
            message: 'Flagged deleted successfully',
          },
        });
      });
    });
    return;
  }
  return res.status(403).json({
    status: 'error',
    data: {
      message: 'Forbidden',
    },
  });
};
exports.getFlags = (req, res) => {
// Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
	return res.status(409).json({
	  status: 'Error',
	  data: {
		message: 'Upgrade to version 1.0 or above',
	  },
	});
  }

  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const empId = payload.userId;
  const isAdmin = empId.substr(0, 3).toUpperCase() === 'ADM';
  if(isAdmin) {
    const query = 'SELECT * FROM flags ORDER BY flaggedon desc';
    pool.connect((error, client, done) => {
      if (error) {
        done()
        console.error(error);
        return res.status(500).json({
          status: 'error',
          data: {
            message: 'Internal Server Error',
          }
        })
      }
      client.query(query, (err, results) => {
        done();
        if(err) {
          cosole.error(err);
          return res.status(500).json({
            status: 'error',
            data: {
              message: 'Internal Server Error',
            }
          })
        }
        const result = results.rows
        res.status(200).json({
          status: 'success',
          data: {
            data: result,
          }
        })
      });

    });
  }

};