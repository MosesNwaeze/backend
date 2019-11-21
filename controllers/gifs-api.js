/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

exports.createGif = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.3) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 and above',
      },
    });
  }
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
      console.log(`Unable to connect to db ${err}`);
      done();
      return res.json({
        error: err,
      });
    }
    client.query(
      query,
      [req.body.title, req.file.url, req.file.created_at, email],
      (e) => {
        if (e) {
          console.log(e);
          return res.json({
            error: e,
          });
        }
        return res.status(201).json({
          status: 'Success',
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
  if (req.headers['accept-version'] < 1.3) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 and above',
      },
    });
  }
  const { id } = req.params;
  const query = 'DELETE FROM public.gifs where id = $1';
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, [id], (err) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
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
  if (req.headers['accept-version'] < 1.3) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 and above',
      },
    });
  }
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
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query1, [id], (err, results) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const result = results.rows;
      const rows = result.find((r) => r);
      Object.assign(row, rows);
    });
  });

  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query2, [createdOn, req.body.comment, parseInt(id), payload.email], (err) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'comment successfully created',
          createdOn,
          gifTitle: row.title,
          comment: req.body.comment,
        },
      });
    });
  });
};

exports.getAGif = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.3) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 and above',
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
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query1, [id], (err, results) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const { rows } = results;
      gifData.push(rows);
    });
  });
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log('error');
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query2, [id], (err, results) => {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const { rows } = results;
      gifData.push(rows);

      if (gifData.flat()[1] && gifData.flat()[0]) {
        return res.status(200).json({
          status: 'success',
          data: {
            id: gifData.flat()[0].id,
            createdOn: gifData.flat()[0].createdon,
            title: gifData.flat()[0].title,
            article: gifData.flat()[0].body,
            comments: [
              {
                commentId: gifData.flat()[1].id,
                comment: gifData.flat()[1].comment,
                authorId: gifData.flat()[0].postedby,
              },
            ],
          },
        });
      }
      return res.status(200).json({
        message: 'No comment for this gif post',
      });
    });
  });
};
