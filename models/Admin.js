  const mongoose = require('mongoose');

  const AdminSchema = new mongoose.Schema(
    {

      userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
      department: { type: String },
      permissions: [{ type: String }],
    },
    { timestamps: true }
  );

  module.exports = mongoose.model('Admin', AdminSchema);
