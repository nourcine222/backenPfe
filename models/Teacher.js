const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema(
  {
   CIN: { type: String, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    specialty: { type: String},
    department: { type: String },
    qualification: { type: String },
    years_of_experience: { type: Number },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    leave_balance: { type: Number, default: 10 },
    reports: [{ 
      title:{type:String },
      body:{type:String },
      attachement:{type:String },
    }],
    maxHoursPerWeek :{ type: Number , default:10 },
    date_of_hiring: { type: Date , default: new Date() },
    salary: { type: Number, default: 0 },
    institut :{ type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required:true},
    Availability :[{
      day: {
      type: String,
      enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Everyday'
      ]},
       hours :{
        type: [Number],
        enum: Array.from({ length: 24 }, (_, i) => i), // Enum for hours 0-23
      }}],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', TeacherSchema);
