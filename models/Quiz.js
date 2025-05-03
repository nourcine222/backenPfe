const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema(
  {
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    quiz_name: { type: String, required: true },
    description: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    duration_minutes: { type: Number, required: true },
    questions: [
      {
        question_text: { type: String, required: true },
        question_type: { type: String, enum: ['multiple_choice', 'true_false'], required: true },
        options: [{ type: String }],
        correct_answer: { type: Number, required: true },  // Position of the correct option in the options array
        marks: { type: Number, required: true },
      }
    ],
    students: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        mark: { type: Number },
      }
    ],
    status: { type: String, enum: ['completed', 'active', 'inactive'], default: 'active' },
    attempts_allowed: { type: Number, default: 1 },
    time_per_question: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', QuizSchema);
