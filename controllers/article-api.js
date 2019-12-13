/* eslint-disable radix */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

exports.createArticle = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  // Error Message
  const error = new Error('Internal Server Error');
  error.httpStatusCode = 500;

  // Retrieve payload from auth
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const query = 'INSERT INTO public.articles (title, body, createdon, postedby) values($1, $2, $3, $4)';

  const requestData = Object.keys(req.body);
  const clientData = JSON.parse(requestData);

  pool.connect((error, client, done) => {
    if (error) {
      done();
      return res.status(500).json({ error: error.message });
    }
    const createdTime = new Date();
    let count = 0;
    client.query(
      query,
      [clientData.title, clientData.body, createdTime, payload.email],
      (er) => {
        done();
        if (er) {
          console.log(er);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(201).json({
          status: 'Success',
          data: {
            message: 'Article successfully created',
            articleId: ++count,
            createdOn: createdTime,
            title: clientData.title,
          },
        });
      },
    );
  });
};

exports.updateArticle = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const id = parseInt(req.params.id);
  const requestData = Object.keys(req.body);
  const clientData = JSON.parse(requestData);
  const query = 'UPDATE public.articles SET title = $1, body = $2 where id = $3';
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
    client.query(query, [clientData.title, clientData.body, id], (error) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.status(201).json({
        status: 'success',
        data: {
          message: 'Article successfully updated',
          title: clientData.title,
          body: clientData.body,
        },
      });
    });
  });
};

exports.deleteArticle = (req, res) => {
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
  const query = 'DELETE FROM public.articles where id = $1';
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, [id], () => {
      done();
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Article successfully deleted!',
        },
      });
    });
  });
};

exports.createArticleComment = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const requestData = Object.keys(req.body);
   console.log(req.body);
  const clientData = JSON.parse(requestData);
  console.log(req.body);
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const { id } = req.params;
  const createdOn = new Date();
  const query = 'SELECT * FROM public.articles where id = $1';
  const query2 = 'INSERT INTO public.articlecomment (createdon, comment, commentedby, article) values($1, $2, $3, $4) ';
  const result = [];
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, [id], (err, results) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      result.push(results.rows);
    });
  });

  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(
      query2,
      [createdOn, clientData.comment, payload.email, result.flat(2)[0].id],
      (err) => {
        done();
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        let response;
        result.forEach((item) => {
          response = {
            message: 'Comment sucessfully created',
            createdOn,
            articleTitle: item.title,
            article: item.body,
            comment: clientData.comment,
          };
        });
        return res.status(200).json({
          status: 'success',
          data: [response],
        });
      },
    );
  });
};

exports.getAnArticle = (req, res) => {
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
  const query1 = 'SELECT * FROM public.articles WHERE id = $1 ORDER BY createdon desc';
  const query2 = 'SELECT * FROM public.articlecomment WHERE article = $1';
  const articleData = [];

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
      articleData.push(rows);
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
      articleData.push(rows);
      const comments = [];
      rows.forEach((row) => {
        comments.push({
          commentId: row.id,
          comment: row.comment,
          authorId: articleData.flat()[0].postedby,
        });
      });

      if (articleData.flat()[1] && articleData.flat()[0]) {
        return res.status(200).json({
          status: 'success',
          data: {
            id: articleData.flat()[0].id,
            createdOn: articleData.flat()[0].createdon,
            title: articleData.flat()[0].title,
            article: articleData.flat()[0].body,
            comments,
          },
        });
      }
      if (articleData.flat()[0]) {
        return res.status(206).json({
          status: 'error',
          data: {
            id: articleData.flat()[0].id,
			createdOn: articleData.flat()[0].createdon,
			title: articleData.flat()[0].title,
            article: articleData.flat()[0].body,
          },
          error: {
			message: 'No comment for this article post'
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

exports.category = (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  const { tag } = req.params;
  const categories = ['title', 'createdon', 'postedby'];
  const isContained = categories.includes(tag);
  if (!isContained) {
    return res.status(404).json({ error: 'Not Found' });
  }
  const employee = categories.find((item) => item === 'postedby');
  let query;
  if (employee) {
    query = `SELECT postedby FROM public.articles WHERE postedby = (SELECT department from public.employees WHERE email = ${tag}) `;
  }
  query = `SELECT ${tag} from public.articles`;
  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, (err, results) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const { rows } = results;
      return res.status(200).json({
        status: 'success',
        data: rows,
      });
    });
  });
};
