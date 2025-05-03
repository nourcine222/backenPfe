const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  receipt: {
    type: String, // Cloudinary URL
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
