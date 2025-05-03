const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema(
  {
    name: { type: String },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    level: { type: String, required: true }, 
    type: { type: String, enum: ["University", "Formation", "Workshop", "Certification"], required: true }, 
    certification: { type: Boolean, default: false },
    passing_grade: { type: Number },
    description: { type: String },
    institute: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
    duration: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ["Days", "Months", "Semesters"], required: true }
    }, // In years
        fees: { type: Number },
    requirements: [{ type: String }],
    subjects: [
      {
        name: { type: String, required: true },  // Subject name
        coef: { type: Number, required: true },  // Coefficient of the subject
        hours_per_week: { type: Number, required: true }, // Number of hours per week
        assigned_teacher: {
          type: mongoose.Schema.Types.ObjectId, // Still ObjectId for real teacher references
          ref: 'Teacher',
          default: null
        },// Assigned teacher
        description: { type: String },
        module :{type:String ,required:true},
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Program', ProgramSchema);
