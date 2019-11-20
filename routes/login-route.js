const express = require('express');

const router = express();
const loginCtrl = require('../controllers/login-api');

router.post('/auth/signin', loginCtrl);

module.exports = router;
