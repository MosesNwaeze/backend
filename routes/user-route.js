const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user-api');
const auth = require('../middleware/auth');
const adminCtrl = require('../controllers/admin-apis');
const multer = require('multer');

const formData = multer();

router.post('/auth/user', auth, formData.none(), userCtrl.createAccount);
router.patch('/auth/user/:email', auth, formData.none(), userCtrl.updateAccount);
router.get('/auth/user/:email', auth, userCtrl.fetchAccount);
router.post('/auth/admin', auth, formData.none(), adminCtrl);

module.exports = router;



