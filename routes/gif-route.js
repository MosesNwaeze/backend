const express = require('express');
const multer = require('multer');
const cloudinary = require('../middleware/cloudinaryConfig');

const router = express();
const auth = require('../middleware/auth');

const parser = multer({ storage: cloudinary.storage });
const gifCtrl = require('../controllers/gifs-api');

router.post('/gifs', auth, parser.single('image'), gifCtrl.createGif);
router.delete('/gifs/:id', auth, gifCtrl.deleteGif);
router.post('/gifs/:id/comment', auth, gifCtrl.createGifComment);
router.get('/gifs/:id', auth, gifCtrl.getAGif);

module.exports = router;
