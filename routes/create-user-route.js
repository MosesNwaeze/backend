const express = require('express');

const router = express();
const createUserCtrl = require('../controllers/create-user-api');
const adminCtrl = require('../controllers/admin-apis');
const auth = require('../middleware/auth');

router.post('/auth/user', auth, createUserCtrl.createAccount);
router.post('/auth/admin', auth, adminCtrl.createAdmin);

module.exports = router;
