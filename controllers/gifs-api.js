/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

exports.createGif = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  console.log(req.file);
  
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const { email } = payload;
  // error management
  const error = new Error('Internal Server Error');
  error.httpStatusCode = 500;
  pool.connect((err, client, done) => {
    const query = `INSERT INTO public.gifs (
                  title,
                  url,
                  createdon,
                  postedby
                  )values(
                  $1,
                  $2,
                  $3,
                  $4

              )`;
    if (err) {
      console.error(`Unable to connect to db ${err}`);
      done();
      return res.status(500).json({
        status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
      });
    }
    client.query(
      query,
      [req.body.title, req.file.url, req.file.created_at, email],
      (e) => {
        if (e) {
          console.log(e);
          return res.status(500).json({
          status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
          });
        }
        return res.status(201).json({
          status: 'success',
          data: {
            message: 'Gif image successfully posted',
            createdOn: req.file.created_at,
            title: req.body.title,
            imageUrl: req.file.url,
          },
        });
      },
    );
  });
};

exports.deleteGif = (req, res) => {
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
  const query = 'DELETE FROM public.gifs where id = $1';
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
    client.query(query, [id], (err) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({
        	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
        });
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'gif successfully deleted',
        },
      });
    });
  });
};

exports.createGifComment = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const requestData = Object.keys(req.body);
  const clientData = JSON.parse(requestData);
  const { id } = req.params;
  const query1 = 'SELECT * FROM public.gifs where id = $1';
  const query2 = 'INSERT INTO public.gifcomment (createdon, comment, gifs, commentedby) values($1, $2, $3, $4)';
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const createdOn = new Date();
  const row = {};
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.error(error);
      return res.status(500).json({ 
      	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
       });
    }
    client.query(query1, [id], (err, results) => {
      done();
      if (err) {
        console.error(err);
        return res.status(500).json({ 
        	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
         });
      }
      const result = results.rows;
      const rows = result.find((r) => r);
      Object.assign(row, rows);
    });
  });

  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.error(error);
      return res.status(500).json({ 
      	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
       });
    }
    client.query(query2, [createdOn, clientData.comment, parseInt(id), payload.email], (err) => {
      done();
      if (err) {
        console.error(err);
        return res.status(500).json({
        	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
        });
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'comment successfully created',
          createdOn,
          gifTitle: row.title,
          comment: clientData.comment,
        },
      });
    });
  });
};

exports.getAGif = (req, res) => {
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
  const query1 = 'SELECT * FROM public.gifs WHERE id = $1 ORDER BY createdon';
  const query2 = 'SELECT * FROM public.gifcomment WHERE gifs = $1';
  const gifData = [];

  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log('error');
      return res.status(500).json({ 
      	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
      });
    }
    client.query(query1, [id], (err, results) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({
        	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
        });
      }
      const { rows } = results;
      gifData.push(rows);
    });
  });
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log('error');
      return res.status(500).json({
      	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
      });
    }
    client.query(query2, [id], (err, results) => {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({ 
        	status: 'error',
          data: {
            message: 'Internal Server Error',
       
          },
         });
      }
      const { rows } = results;
      gifData.push(rows);
      const comments = [];
      rows.forEach((row) => {
        comments.push({
          commentId: row.id,
          comment: row.comment,
          authorId: gifData.flat()[0].postedby,
        });
      });

      if (gifData.flat()[1] && gifData.flat()[0]) {
        return res.status(200).json({
          status: 'success',
          data: {
            id: gifData.flat()[0].id,
            createdOn: gifData.flat()[0].createdon,
            title: gifData.flat()[0].title,
            article: gifData.flat()[0].body,
            comments,
          },
        });
      }
      if (gifData.flat()[0]) {
        return res.status(206).json({
          status: 'error',
          error: {
            message: 'No comment for this gif post',
          },
          data: {
		    id: gifData.flat()[0].id,
			createdOn: gifData.flat()[0].createdon,
			title: gifData.flat()[0].title,
			article: gifData.flat()[0].body,

          }
        });
      }
      return res.status(200).json({
        status: 'error',
        data: {
          message: 'Request Not Understood',
        },
      });
    });
  });
};
