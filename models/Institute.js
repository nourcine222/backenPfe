const mongoose = require("mongoose");

const InstituteSchema = new mongoose.Schema(
  {
    name: { type: String },
    photo: { type: String },  // Cloudinary URL
    type: { 
      type: String, 
      enum: [
        "Primary School",
        "Middle School",
        "High School",
        "University",
        "Training Center",
        "Vocational School",
        "Private School",
        "Technical Institute"
      ],
      required: true
    },
    departments: [{
      name: { type: String, required: true },
      responsableEmail: { type: String, required: true }, // RH user ID
      description: { type: String, required: true },
      programs :[{type: mongoose.Schema.Types.ObjectId, ref: "Program"}]
    }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: { type: String },
    contact: { type: String },
    establishment_year: { type: Number },
    email: { type: String },
    phone_number: { type: String },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // RH
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }], // Teachers
    programs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }] // Linked programs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institute", InstituteSchema);
