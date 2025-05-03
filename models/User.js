const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
   
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student', 'Uni student', 'parent','RH','SuperAdmin'], required: true },
    phone_number: { type: String },
    address: { type: String },
    profile_picture: { type: String  , default: "url(https://res.cloudinary.com/dkq3vlps8/image/upload/v1722650427/i50vceflan1tnbk6rur7.webp)"},  // Cloudinary URL
    last_login: { type: Date },
    spentTime: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    points: { type: Number, default: 0 },
    gender: { type: String, enum: ['male', 'female'] },
    age :{type:Number},
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Institute'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
