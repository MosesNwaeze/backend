/* eslint-disable consistent-return */
const express = require('express');
const auth = require('../middleware/auth');

const router = express();

const url = 'https://documenter.getpostman.com/view/7037741/SW7aXnoy';
router.get('/doc', auth, (req, res) => {
  // Version control
  if (req.headers['accept-version'] < 1.0 || !req.headers['accept-version']) {
    return res.status(409).json({
      status: 'Error',
      data: {
        message: 'Upgrade to version 1.0 or above',
      },
    });
  }
  res.setHeader('Content-Type', 'text/html');
  res.status(307);
  res.redirect(url);
});

module.exports = router;
