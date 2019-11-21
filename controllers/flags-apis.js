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
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, [parseInt(id), flaggedOn], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
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
      status: 'Error',
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
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, [parseInt(id), flaggedOn], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
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
      status: 'Error',
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
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, [parseInt(id), flaggedOn], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
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
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    client.query(query, [parseInt(id), flaggedOn], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
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

exports.deleteFlaggedArticle = (req, res) => {
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
  const { id } = req.params;
  const isAdmin = empId.substr(0, 3).toUpperCase() === 'ADM';
  if (isAdmin) {
    const query = 'DELETE FROM public.articles WHERE id = $1';
    pool.connect((error, client, done) => {
      if (error) {
        done();
        console.log(error);
        res.status(500).json({
          error: 'Internal Server Error',
        });
      }
      client.query(query, [parseInt(id)], (err) => {
        done();
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({
          status: 'success',
          data: {
            message: 'Article deleted successfully',
          },
        });
      });
    });
    return;
  }
  return res.status(403).json({
    status: 'Error',
    data: {
      message: 'Forbidden',
    },
  });
};

exports.deleteFlaggedGif = (req, res) => {
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
  const { id } = req.params;
  const isAdmin = empId.substr(0, 3).toUpperCase() === 'ADM';
  if (isAdmin) {
    const query = 'DELETE FROM public.gifs WHERE id = $1';
    pool.connect((error, client, done) => {
      if (error) {
        done();
        console.log(error);
        res.status(500).json({
          error: 'Internal Server Error',
        });
      }
      client.query(query, [parseInt(id)], (err) => {
        done();
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({
          status: 'success',
          data: {
            message: 'Gif deleted successfully',
          },
        });
      });
    });
    return;
  }
  return res.status(403).json({
    status: 'Error',
    data: {
      message: 'Forbidden',
    },
  });
};

exports.deleteFlaggedArticleComment = (req, res) => {
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
  const { id } = req.params;
  const isAdmin = empId.substr(0, 3).toUpperCase() === 'ADM';
  if (isAdmin) {
    const query = 'DELETE FROM public.articlecomment WHERE id = $1';
    pool.connect((error, client, done) => {
      if (error) {
        done();
        console.log(error);
        res.status(500).json({
          error: 'Internal Server Error',
        });
      }
      client.query(query, [parseInt(id)], (err) => {
        done();
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({
          status: 'success',
          data: {
            message: 'Comment deleted successfully',
          },
        });
      });
    });
    return;
  }
  return res.status(403).json({
    status: 'Error',
    data: {
      message: 'Forbidden',
    },
  });
};

exports.deleteFlaggedGifComment = (req, res) => {
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
  const { id } = req.params;
  const isAdmin = empId.substr(0, 3).toUpperCase() === 'ADM';
  if (isAdmin) {
    const query = 'DELETE FROM public.gifcomment WHERE id = $1';
    pool.connect((error, client, done) => {
      if (error) {
        done();
        console.log(error);
        res.status(500).json({
          error: 'Internal Server Error',
        });
      }
      client.query(query, [parseInt(id)], (err) => {
        done();
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res.status(200).json({
          status: 'success',
          data: {
            message: 'Comment deleted successfully',
          },
        });
      });
    });
    return;
  }
  return res.status(403).json({
    status: 'Error',
    data: {
      message: 'Forbidden',
    },
  });
};
