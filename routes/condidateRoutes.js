const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const JobOffer = require('../models/JobOffer');
const sendEmail = require('../config/emailingService');

// Create a new spontaneous candidate (no job offer)
router.post('/create/spontaneous', async (req, res) => {
  try {
    const { name, email, phoneNumber, role_applied_for, resume, instituteId } = req.body;

    const newCandidate = new Candidate({
      name,
      email,
      phoneNumber,
      role_applied_for,
      resume,
      isSpontaneous: true,
      institute: instituteId,
    });

    await newCandidate.save();
    // Send confirmation email
   
  
    res.status(201).json({ msg: 'Spontaneous candidate created successfully', newCandidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a candidate applying for a specific job offer
router.post('/create/job', async (req, res) => {
  try {
    const { name, email, phoneNumber, role_applied_for, resume,isSpontaneous, jobOfferId, instituteId } = req.body;
    console.log(req.body)
    // Check if job offer exists
    const jobOffer = await JobOffer.findById(jobOfferId);
    if (!jobOffer) {
      return res.status(404).json({ msg: 'Job offer not found' });
    }

    const newCandidate = new Candidate({
      name,
      email,
      phoneNumber,
      role_applied_for,
      resume,
      jobOffer: jobOfferId,
      isSpontaneous: false,
      institute: instituteId,
    });

    await newCandidate.save();
   
    res.status(201).json({ msg: 'Candidate created for job offer successfully', newCandidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all candidates by institute
router.get('/byInstitute/:instituteId', async (req, res) => {
  try {
    const { instituteId } = req.params;

    const candidates = await Candidate.find({ institute: instituteId }).populate('jobOffer');



    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all spontaneous candidates by institute
router.get('/spontaneous/byInstitute/:instituteId', async (req, res) => {
  try {
    const { instituteId } = req.params;

    const spontaneousCandidates = await Candidate.find({
      institute: instituteId,
      isSpontaneous: true,
    });


    res.status(200).json(spontaneousCandidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a specific candidate by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('jobOffer');

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});
// Get a specific candidate by ID
router.get('/', async (req, res) => {
    try {
      const candidate = await Candidate.find().populate('jobOffer');
  
      if (!candidate) {
        return res.status(404).json({ msg: 'Candidate not found' });
      }
  
      res.status(200).json(candidate);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
// Update a candidate by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phoneNumber, role_applied_for, resume, jobOfferId, instituteId } = req.body;

    // Check if job offer exists if provided
    let jobOffer = null;
    if (jobOfferId) {
      jobOffer = await JobOffer.findById(jobOfferId);
      if (!jobOffer) {
        return res.status(404).json({ msg: 'Job offer not found' });
      }
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { name, email, phoneNumber, role_applied_for, resume, jobOffer: jobOffer ? jobOfferId : null, institute: instituteId },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.status(200).json({ msg: 'Candidate updated successfully', updatedCandidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a candidate by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!deletedCandidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.status(200).json({ msg: 'Candidate deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Schedule Interview
router.post('/:id/schedule-interview', async (req, res) => {
    try {
      const { interviewLink } = req.body;
      const candidate = await Candidate.findById(req.params.id);
  
      if (!candidate) {
        return res.status(404).json({ msg: 'Candidate not found' });
      }
  
      // Optional: Add interview status info in DB if needed
      candidate.interview = { link: interviewLink, scheduled: true };
      await candidate.save();
  
      const subject = 'Interview Invitation';
      const html = `
        <p>Dear ${candidate.name},</p>
        <p>We would like to invite you to an interview for the role of <strong>${candidate.role_applied_for}</strong>.</p>
        <p>Please join the interview at the following link:</p>
        <a href="${interviewLink}">${interviewLink}</a>
        <p>Best regards,<br/>Recruitment Team</p>
      `;
  
     
  
      res.status(200).json({ msg: 'Interview link sent and candidate updated.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });

router.post('/:id/accept', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    candidate.status = 'accepted';
    await candidate.save();

    const subject = 'Congratulations!';
    const html = `
      <p>Dear ${candidate.name},</p>
      <p>We are thrilled to inform you that your application for the role of <strong>${candidate.role_applied_for}</strong> has been accepted.</p>
      <p>Welcome aboard!</p>
      <p>Best regards,<br/>Recruitment Team</p>
    `;

    
    res.status(200).json({ msg: 'Candidate accepted and email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post('/:id/reject', async (req, res) => {
    try {
      const candidate = await Candidate.findById(req.params.id);
  
      if (!candidate) {
        return res.status(404).json({ msg: 'Candidate not found' });
      }
  
      candidate.status = 'rejected';
      await candidate.save();
  
      const subject = 'Application Update';
      const html = `
        <p>Dear ${candidate.name},</p>
        <p>Thank you for your interest in the position of <strong>${candidate.role_applied_for}</strong>.</p>
        <p>After careful consideration, we regret to inform you that we won't be moving forward with your application at this time.</p>
        <p>We wish you all the best in your career.</p>
        <p>Kind regards,<br/>Recruitment Team</p>
      `;
  
      
  
      res.status(200).json({ msg: 'Candidate rejected and email sent.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  });
  // ACCEPT candidate
router.patch('/:id/accept', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });


    res.json(candidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error accepting candidate' });
  }
});

// REJECT candidate
router.patch('/:id/reject', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });



    res.json(candidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error rejecting candidate' });
  }
});
module.exports = router;
