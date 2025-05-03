const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema(
  {
  
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    child: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    relationship_to_student: { type: String },
    contact_information: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Parent', ParentSchema);
