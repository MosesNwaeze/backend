const multer = require('multer');


const mimeType = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/gif': 'gif',
	'image/png': 'png'
};
const localStorage = multer.diskStorage(
  {
    destination: (req, file, callback) => {
      callback(null, 'profile-pics');
    },
    filename: (req, file, callback) => {
      const extension = mimeType[file.mimetype];
      const name = file.originalname.split(' ').join('-');
      callback(null, name );
    },
  },
);


module.exports = multer({ storage: localStorage }).single('image');
