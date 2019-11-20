const multer = require('multer');


const localStorage = multer.diskStorage(
  {
    destination: (req, file, callback) => {
      callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  },
);


module.exports = multer({ storage: localStorage }).single('image');
