const cloudinary = require('cloudinary').v2;

// Upload file to Cloudinary
const uploadFile = async (req, res) => {
  const { file } = req.files;  // Assuming you're using `express-fileupload`

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'university_erp',
      resource_type: 'auto',
    });

    res.status(200).json({
      msg: 'File uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Cloudinary upload failed' });
  }
};

// Delete file from Cloudinary
const deleteFile = async (req, res) => {
  const { public_id } = req.body;

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ msg: 'File deleted successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Cloudinary delete failed' });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
