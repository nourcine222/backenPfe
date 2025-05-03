const express = require('express');
const mongoose = require('mongoose');
const Report = require('../models/Report'); // Import the Report model

const router = express.Router();

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
router.post('/',  async (req, res) => {
  try {
    const { report } = req.body; // Destructure the report object directly

    const newReport = new Report({
      instituteId: report.instituteId,
      creator: report.creator, // Assuming user is authenticated
      reference: report.reference,
      referenceType: report.referenceType,
      reportType: report.reportType,
      description: report.description,
      title: report.title,
      materials: report.materials || [], // If no materials are provided, default to empty array
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private

const Student = require('../models/Student');
const Program = require('../models/Program');
const Course = require('../models/Course');
const Exam = require('../models/Exam');

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('instituteId')
      .populate('creator')
      .lean(); // Use lean() for better performance and easier manipulation

    // Manually populate the dynamic 'reference' based on referenceType
    const populatedReports = await Promise.all(
      reports.map(async (report) => {
        let model;
        switch (report.referenceType) {
          case 'student':
            model = Student;
            break;
          case 'program':
            model = Program;
            break;
          case 'course':
            model = Course;
            break;
          case 'exam':
            model = Exam;
            break;
          default:
            model = null;
        }

        if (model) {
          const refData = await model.findById(report.reference).lean();
          return { ...report, reference: refData };
        }

        return report;
      })
    );

    res.status(200).json(populatedReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Get a single report by ID
// @route   GET /api/reports/:id
// @access  Private
router.get('/:id',  async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('instituteId') // Populate Institute details
      .populate('creator'); // Populate creator (user) details

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all reports by instituteId
// @route   GET /api/reports/institute/:instituteId
// @access  Private
router.get('/institute/:instituteId',  async (req, res) => {
  try {
    const reports = await Report.find({ instituteId: req.params.instituteId })
      .populate('instituteId') // Populate Institute details
      .populate('creator'); // Populate creator (user) details

    if (!reports.length) {
      return res.status(404).json({ message: 'No reports found for this institute' });
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports by institute:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all reports by creatorId
// @route   GET /api/reports/creator/:creatorId
// @access  Private
router.get('/creator/:creatorId',  async (req, res) => {
  try {
    const reports = await Report.find({ creator: req.params.creatorId })
      .populate('instituteId') // Populate Institute details
      .populate('creator'); // Populate creator (user) details

    if (!reports.length) {
      return res.status(404).json({ message: 'No reports found for this creator' });
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports by creator:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a report
// @route   PUT /api/reports/:id
// @access  Private
router.put('/:id',  async (req, res) => {
  try {
    const { report } = req.body; // Destructure the report object directly

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      {
        instituteId: report.instituteId,
        reference: report.reference,
        referenceType: report.referenceType,
        reportType: report.reportType,
        description: report.description,
        title: report.title,
        materials: report.materials || [], // Update materials if provided
      },
      { new: true } // Return the updated document
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
router.delete('/:id',  async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
