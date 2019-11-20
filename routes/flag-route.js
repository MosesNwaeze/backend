const express = require('express');

const router = express();
const auth = require('../middleware/auth');
const flagCtrl = require('../controllers/flags-apis');

router.post('/articles/:id/flag', auth, flagCtrl.flaggedArticle);
router.post('/gifs/:id/flag', auth, flagCtrl.flaggedGif);
router.post('/articles/comments/:id/flag', auth, flagCtrl.flaggedArticleComment);
router.post('/gifs/comments/:id/flag', auth, flagCtrl.flaggedGifComment);
router.delete('/articles/:id/flag', auth, flagCtrl.deleteFlaggedArticle);
router.delete('/gifs/:id/flag', auth, flagCtrl.deleteFlaggedGif);
router.delete('/articles/comments/:id/flag', auth, flagCtrl.deleteFlaggedArticleComment);
router.delete('/gifs/comments/:id/flag', auth, flagCtrl.deleteFlaggedGifComment);

module.exports = router;
