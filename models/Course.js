const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    course_name: { type: String, required: true },
    description: { type: String },
    
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: { type: String, required: true },
    modules: [
      {
        name: { type: String },
        description: { type: String },
        material: [{ type: String }]  // Cloudinary URLs
        ,status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        sessionLink:{ type: String },
        date :{ type: Date },
      }
    ],
    startDate: { type: Date }, // Added start date
  endDate: { type: Date }, // Added end date
  quizs:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    schedule: [{ type: Object }],
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    scheduled_exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
