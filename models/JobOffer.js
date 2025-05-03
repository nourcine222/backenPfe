const mongoose = require('mongoose');

const jobOfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true, // The role the candidate is applying for
  },
  requirements: {
    type: String,
    required: true, // Any special qualifications or skills required
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
    default: null, // Set when the job offer is closed
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open', // Status of the job offer
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
});

const JobOffer = mongoose.model('JobOffer', jobOfferSchema);

module.exports = JobOffer;
