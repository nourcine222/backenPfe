const express = require('express');
const router = express.Router();
const JobOffer = require('../models/JobOffer');

// Create a new job offer
router.post('/create', async (req, res) => {
  try {
    const { job } = req.body;

    const newJobOffer = new JobOffer(
     job
    );

    await newJobOffer.save();
    res.status(201).json({ msg: 'Job offer created successfully', newJobOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all job offers by institute
router.get('/byInstitute/:instituteId', async (req, res) => {
  try {
    const { instituteId } = req.params;
    const jobOffers = await JobOffer.find({ institute:instituteId });

    if (!jobOffers || jobOffers.length === 0) {
      return res.status(404).json({ msg: 'No job offers found for this institute' });
    }

    res.status(200).json(jobOffers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get a specific job offer by its ID
router.get('/:id', async (req, res) => {
  try {
    const jobOffer = await JobOffer.findById(req.params.id);

    if (!jobOffer) {
      return res.status(404).json({ msg: 'Job offer not found' });
    }

    res.status(200).json(jobOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});
// Get a specific job offer by its ID
router.get('/', async (req, res) => {
  try {
    const jobOffer = await JobOffer.find();


    res.status(200).json(jobOffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});
router.put('/:id', async (req, res)=> {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        role,
        requirements,
        postedAt,
        closedAt,
        status,
        creator,
        institute
      } = req.body;
  
      // Find the job offer by ID
      const jobOffer = await JobOffer.findById(id);
      if (!jobOffer) {
        return res.status(404).json({ msg: 'Job offer not found' });
      }
  
      // Update the job offer fields
      jobOffer.title = title || jobOffer.title;
      jobOffer.description = description || jobOffer.description;
      jobOffer.role = role || jobOffer.role;
      jobOffer.requirements = requirements || jobOffer.requirements;
      jobOffer.postedAt = postedAt || jobOffer.postedAt;
      jobOffer.closedAt = closedAt || jobOffer.closedAt;
      jobOffer.status = status || jobOffer.status;
      jobOffer.creator = creator || jobOffer.creator;
      jobOffer.institute = institute || jobOffer.institute;
  
      // Save the updated job offer
      await jobOffer.save();
  
      return res.status(200).json({ msg: 'Job offer updated successfully', jobOffer });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

// Delete a job offer by its ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedJobOffer = await JobOffer.findByIdAndDelete(req.params.id);

    if (!deletedJobOffer) {
      return res.status(404).json({ msg: 'Job offer not found' });
    }

    res.status(200).json({ msg: 'Job offer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
