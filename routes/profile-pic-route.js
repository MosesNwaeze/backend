const express = require('express');
const cloudinary = require('cloudinary');
const cloudStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const auth = require('../middleware/auth');

const router = express.Router();

cloudinary.config({
  cloud_name: 'mosesnwaeze',
  api_key: '816574398113595',
  api_secret: 'TnxzHry48SL0L9-DN_PhNHBY6yY',
});

const storage = cloudStorage({
  cloudinary,
  folder: 'Profile Pics',
  allowedFormat: ['jpg', 'jpeg', 'gif', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }],
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },

});

const parser = multer({storage: storage})
router.post('/profile-pic', auth, parser.single('image'), (req, res) =>{	
	try{
		if(req.file) {
			return res.status(201).json({
				status: 'success',
				data: {
					message: "Image uploaded successfully",
					image: req.file
				}
		    });
	    }else {
		    throw new Error();
		
	    }
	
    }catch(error) {
	    console.error(error)
		return res.status(501).json({
			status: 'error',
			data: {
				message: error.message
			}
	    });

    }
	
});
module.exports = router;
