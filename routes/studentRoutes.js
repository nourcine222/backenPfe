const express = require('express');
const router = express.Router();
const { createStudent, getStudents,getStudentsByInstitute, getStudentById, updateStudent, deleteStudent,getStudentsByProgram ,getStudentsByPrograms} = require('../controllers/studentController');

// Student routes
router.post('/', createStudent);          // Create a new student
router.get('/', getStudents);             // Get all students
router.get('/:id', getStudentById);       // Get student by ID
router.put('/:id', updateStudent);        // Update student
router.delete('/:id', deleteStudent);    // Delete student
router.get('/programs', getStudentsByPrograms); // multiple programs (query)
router.get('/institute/:id', getStudentsByInstitute);  
   
router.get('/program/:id', getStudentsByProgram);
module.exports = router;
