const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const flagCtrl = require('../controllers/flags-apis');

router.post('/articles/:id/flag', auth, flagCtrl.flaggedArticle);
router.post('/gifs/:id/flag', auth, flagCtrl.flaggedGif);
router.post('/articles/comments/:id/flag', auth, flagCtrl.flaggedArticleComment);
router.post('/gifs/comments/:id/flag', auth, flagCtrl.flaggedGifComment);
router.delete('/flags', auth, flagCtrl.deleteFlagged);
router.get('/flags', auth, flagCtrl.getFlags);

module.exports = router;
