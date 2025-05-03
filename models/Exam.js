const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema(
  {
    institute_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        question_text: { type: String, required: true },
        question_type: {
          type: String,
          enum: ['multiple_choice', 'true_false', 'short_answer'],
          required: true,
        },
        options: [{ type: String }], // For multiple choice
        correct_answer: { type: mongoose.Schema.Types.Mixed }, // Can be index, boolean, or text
        marks: { type: Number, default: 1 },
        time_limit_seconds: { type: Number }, // Time limit per question (optional)
      },
    ],
    duration_minutes: { type: Number, required: true },
    start_time: { type: Date }, // Optional start time for scheduled exams
    end_time: { type: Date },   // Optional end time
    attempts_allowed: { type: Number, default: 1 },
    shuffle_questions: { type: Boolean, default: false },
    shuffle_options: { type: Boolean, default: false },
    instructions: { type: String },
    exam_materials: [{ type: String }], // Cloudinary URLs for general exam materials
    grades: [{
      student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      score: { type: Number },
      total_marks: { type: Number }, // Store the total marks of the exam at the time of submission
      answers: [{ type: mongoose.Schema.Types.Mixed }], // Store student's answers per question
      submission_time: { type: Date },
      review_status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
      feedback: { type: String },
    }],
    type: { type: String, enum: ['test', 'ds', 'exam' , 'offline'], required: true },
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Might be managed separately
    status: { type: String, enum: ['draft', 'scheduled', 'active', 'completed'], default: 'draft' },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to the teacher who created the exam
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', ExamSchema);