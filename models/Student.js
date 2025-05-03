const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const getCurrentAcademicYear = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getFullYear() + 1}`;
};
const StudentSchema = new mongoose.Schema(
  {

    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
    institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program'},
    date_of_admission: { type: Date, default: Date.now },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    academic_year: { type: String, default: getCurrentAcademicYear },
    CIN: { type: Number, required: true, min: 1 },
    enrolled_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    completed_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    grades: [{ type: Object }],
    attendance: [
      {course :{type: mongoose.Schema.Types.ObjectId, ref: 'Course', },
      missed :{type:Number, default:0}
      }],
    fees_status: { type: String, enum: ['paid', 'pending', 'scholarship'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);
