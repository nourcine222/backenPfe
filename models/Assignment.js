const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Assuming you have a Student model
    required: true,
  },
  submissionType: {
    type: String,
    enum: ['online', 'email'], // Indicate how the response was submitted
    required: true,
  },
  submittedText: {
    type: String,
    trim: true,
  },
  submittedMaterial: [{
    type: String, // Store file paths or URLs of submitted materials
  }],
  emailDetails: {
    from: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      trim: true,
    },
    attachments: [{
      type: String, // Store file paths or URLs of email attachments
    }],
    sentAt: {
      type: Date,
    },
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  graded: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: Number,
    min: 0,
  },
  feedback: {
    type: String,
    trim: true,
  },
  // --- NEW FIELD FOR RESPONSE STATUS ---
  status: {
    type: String,
    enum: ['pending', 'submitted', 'graded', 'returned'],
    default: 'pending',
    required: true,
  },
  // --- END OF NEW FIELD ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}); // Prevent Mongoose from creating a default _id for sub-documents

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program', // Assuming you have a Program model
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for teachers/admins
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Assuming you have a Course model
    required: true,
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute', // Assuming you have an Institute model
    required: true,
  },
  materials: [{
    type: String, // Store file paths or URLs of attached materials
  }],
  submissionType: {
    type: String,
    enum: ['online', 'offline', 'both'],
    default: 'online',
  },
  maxPoints: {
    type: Number,
    default: 100,
    min: 0,
  },
  responses: [responseSchema], // Embed the response schema as an array
  // --- NEW FIELD FOR ASSIGNMENT STATUS ---
  status: {
    type: String,
    enum: ['draft', 'published', 'closed', 'archived'],
    default: 'draft',
    required: true,
  },
  // --- END OF NEW FIELD ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  email :{
    type:String
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;