const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema(
  {
    
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' }, // Program the class is for
    institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' }, // Institute where the timetable is for
    semester: { type: String },
    start_time: { type: Date },
    end_time: { type: Date },
    sessions: [
      {
        day_of_week: { type: String },
        start_time: { type: String },
        end_time: { type: String },
        teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
        subject: { type: String },
        course_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course'  , default:null}],
      },
    ],
    status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', TimetableSchema);
