const mongoose = require('mongoose');

const QnASessionSchema = new mongoose.Schema(
  {
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
    messages: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: { type: String, required: true },
      }
    ],
    created_at: { type: Date, default: Date.now },
    status: { type: String, enum: ['open', 'answered', 'closed'], default: 'open' },
  },{ timestamps: true }
);
module.exports = mongoose.model('QnASession', QnASessionSchema);
