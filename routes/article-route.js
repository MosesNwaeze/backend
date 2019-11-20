const express = require('express');

const router = express();
const articleCtrl = require('../controllers/article-api');
const auth = require('../middleware/auth');

router.post('/article', auth, articleCtrl.createArticle);
router.patch('/articles/:id', auth, articleCtrl.updateArticle);
router.delete('/articles/:id', auth, articleCtrl.deleteArticle);
router.post('/articles/:id/comment', auth, articleCtrl.createArticleComment);
router.get('/articles/:id', auth, articleCtrl.getAnArticle);
router.get('/articles?tag', auth, articleCtrl.category);

module.exports = router;
