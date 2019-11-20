const cloudinary = require('cloudinary');
const cloudStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'mosesnwaeze',
  api_key: '816574398113595',
  api_secret: 'TnxzHry48SL0L9-DN_PhNHBY6yY',
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
