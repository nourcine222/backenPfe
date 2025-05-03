const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    message: { type: String },
    type: { type: String },
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
