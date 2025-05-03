const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'upcoming'], default: 'active' },
    date: { type: Date, required: true },
    location: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    duration: { type: Number },

    // Categorizing the event
    programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }],
    
    // Simplified attachments - just an array of strings (URLs)
    attachments: [{ type: String }],  // Array of Cloudinary URLs or other file links
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
