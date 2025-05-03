const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Response = require('../models/Assignment'); // Make sure this points to your Response model

// Create Assignment
router.post('/', async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read Assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('responses');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Assignment by ID (PUT)
router.put('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Assignment by ID (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Assignment by ID
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Assignments by Creator
router.get('/creator/:createdBy', async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.params.createdBy });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Assignments by Institute
router.get('/institute/:instituteId', async (req, res) => {
  try {
    const assignments = await Assignment.find({ instituteId: req.params.instituteId });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Response for Assignment
router.post('/:assignmentId/responses', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    assignment.responses.push(req.body);
    await assignment.save();
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Response by ID
router.get('/:assignmentId/responses/:responseId', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId).populate('responses');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    const response = assignment.responses.id(req.params.responseId);
    if (!response) return res.status(404).json({ message: 'Response not found' });
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Response by ID
router.patch('/:assignmentId/responses/:responseId', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    const response = assignment.responses.id(req.params.responseId);
    if (!response) return res.status(404).json({ message: 'Response not found' });
    
    Object.assign(response, req.body);
    await assignment.save();
    
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Response by ID
router.delete('/:assignmentId/responses/:responseId', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    const responseIndex = assignment.responses.findIndex(r => r._id.toString() === req.params.responseId);
    if (responseIndex === -1) return res.status(404).json({ message: 'Response not found' });
    
    assignment.responses.splice(responseIndex, 1);
    await assignment.save();
    
    res.status(200).json({ message: 'Response deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Responses by Student ID
router.get('/:assignmentId/responses/student/:studentId', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId).populate('responses');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    const studentResponses = assignment.responses.filter(response => 
      response.student.toString() === req.params.studentId
    );
    
    if (studentResponses.length === 0) {
      return res.status(404).json({ message: 'No responses found for this student' });
    }
    
    res.status(200).json(studentResponses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;