const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const feedCtrl = require('../controllers/feeds');

router.get('/feed', auth, feedCtrl);

module.exports = router;
