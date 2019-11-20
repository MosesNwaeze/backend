const express = require('express');

const router = express();
const createUserCtrl = require('../controllers/create-user-api');
const auth = require('../middleware/auth');

router.post('/auth/create-user', auth, createUserCtrl.createAccount);

module.exports = router;
