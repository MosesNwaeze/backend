const cloudinary = require('cloudinary');
const cloudStorage = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.storage = cloudStorage({
  cloudinary,
  folder: 'images',
  allowedFormat: ['jpg', 'jpeng', 'gif', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },

});
