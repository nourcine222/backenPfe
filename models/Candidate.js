const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure no two candidates have the same email
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role_applied_for: {
    type: String,
    required: true, // The role the candidate is applying for
  },
  resume: {
    type: String, // URL to resume (can be uploaded to Cloudinary or another service)
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  interview: {
    link: String,
    scheduled: Boolean,
  },  
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  jobOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOffer', // Reference to the JobOffer schema (nullable for spontaneous candidates)
    default: null, // A spontaneous candidate will not have a job offer associated
  },
  isSpontaneous: {
    type: Boolean,
    default: true, // By default, a candidate is considered spontaneous
  },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
