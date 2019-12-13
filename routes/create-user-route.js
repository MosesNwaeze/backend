const express = require('express');

const router = express.Router();
const createUserCtrl = require('../controllers/create-user-api');
const auth = require('../middleware/auth');
const adminCtrl = require('../controllers/admin-apis');

exports.user = (router.post('/auth/user', auth, createUserCtrl.createAccount));
exports.admin = (router.post('/auth/admin', auth, adminCtrl));



