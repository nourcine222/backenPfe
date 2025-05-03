const { uploadFile } = require('../controllers/cloudinaryController');

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'institutes_photos', // Upload folder
      resource_type: 'auto',
    });
    
    res.json({ secure_url: uploadResponse.secure_url });
  } catch (err) {
    console.error('Error uploading image: ', err);
    res.status(500).send('Error uploading image');
  }
};
module.exports = cloudinary
