const mongoose = require('mongoose');
require('dotenv').config(); // Ensure dotenv is loaded

const connectDB = async () => {
  try {
    const uri = process.env.DB_URI; // Get DB_URI from .env

    if (!uri) {
      throw new Error("MongoDB connection URI is missing!");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully...');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
