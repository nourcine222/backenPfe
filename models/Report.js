const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Report Schema
const reportSchema = new Schema(
  {
    instituteId: {
      type: Schema.Types.ObjectId,
      ref: 'Institute', // Assuming you have an Institute model
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model for report creator
      required: true,
    },
    reference: {
      type: Schema.Types.ObjectId,
      required: true,
      // Can refer to Student, Program, Course, or Exam models
    },
    referenceType: {
      type: String,
      enum: ['student', 'program', 'course', 'exam'], // What the reference refers to
     
    },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'resolved', 'rejected'],
      default: 'pending',
    },    
    reportType: {
      type: String,
      enum: ['performance', 'attendance', 'academic', 'behavior', 'other'], // Types of reports
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true, // Title is now a required field
    },
    materials: [
      {
        type: String, // Can be a URL to a file or other media
        required: false, // Optional materials
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
