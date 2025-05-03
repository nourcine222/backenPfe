const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByTeacher,
  getCoursesByInstitute,
  getCoursesByProgram,
} = require('../controllers/courseController');

// Course routes
router.post('/', createCourse);          
router.get('/', getCourses);             
router.get('/:id', getCourseById);       
router.put('/:id', updateCourse);        
router.delete('/:id', deleteCourse);

// New filter routes
router.get('/teacher/:teacherId', getCoursesByTeacher);
router.get('/institute/:instituteId', getCoursesByInstitute);
router.get('/program/:programId', getCoursesByProgram);

module.exports = router;
