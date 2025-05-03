const mongoose = require('mongoose');
const Student = require('../models/Student');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create a new student
const createStudent = async (req, res) => {
  const student = req.body;

  try {
    const newStudent = new Student(student);
    await newStudent.save();
    return res.status(201).json({ msg: 'Student created successfully', student: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userID institute program');
    return res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get student by userID
const getStudentById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid ID format' });
    }

    const student = await Student.findOne({ userID: req.params.id })
      .populate('userID')
      .populate('institute')
      .populate('program');
      
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    return res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update student
const updateStudent = async (req, res) => {
  const updates = req.body;

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid ID format' });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    ).populate('userID institute program');
    
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    return res.status(200).json({ msg: 'Student updated successfully', student });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid ID format' });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    return res.status(200).json({ msg: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get students by institute
const getStudentsByInstitute = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid Institute ID format' });
    }

    const students = await Student.find({ institute: req.params.id })
      .populate('userID')
      .populate('program');
      
    if (!students || students.length === 0) {
      return res.status(404).json({ msg: 'No students found' });
    }

    return res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get students by program
const getStudentsByProgram = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid Program ID format' });
    }

    const students = await Student.find({ program: req.params.id })
      .populate('userID')
      .populate('program');
      
    if (!students || students.length === 0) {
      return res.status(404).json({ msg: 'No students found' });
    }

    return res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get students by multiple programs
// Get students by multiple programs
const getStudentsByPrograms = async (req, res) => {
  try {
    const { programs } = req.query;
    
    if (!programs) {
      return res.status(400).json({ msg: 'Programs parameter is required' });
    }

    // Convert string of IDs to array and validate
    const programIds = programs.split(',').map(id => id.trim());
    
    // Validate all IDs
    const invalidIds = programIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ 
        msg: 'Invalid program ID format',
        invalidIds
      });
    }

    const students = await Student.find({ program: { $in: programIds } })
      .populate('userID', 'name email')
      .populate('program', 'name code');

    return res.status(200).json(students);
    
  } catch (error) {
    console.error('Error in getStudentsByPrograms:', error);
    res.status(500).json({ 
      msg: 'Server error',
      error: error.message 
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByInstitute,
  getStudentsByProgram,
  getStudentsByPrograms
};