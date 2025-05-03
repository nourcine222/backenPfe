// cloudinaryRoutes.js
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Cloudinary configuration (from .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST route for image upload
router.post('/upload', async (req, res) => {
  try {
    const { image } = req.body;

    // Check if image is provided
    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'institutes_photos', // Optionally specify folder in Cloudinary
    });

    // Return the URL of the uploaded image
    res.status(200).json({ secure_url: uploadResponse.secure_url });
  } catch (err) {
    console.error('Error uploading image: ', err);
    res.status(500).send({ message: 'Error uploading image', error: err });
  }
});

module.exports = router;
