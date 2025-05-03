const express = require('express');
const router = express.Router();
const { createTeacher,getTeacherProfile,setupTeacherProfile, getTeachers, updateTeacher, deleteTeacher , getTeacher,searchTeacherByEmail,getTeachersByInstitute} = require('../controllers/teacherController');

// Teacher routes

router.post('/setup/', setupTeacherProfile); 
router.post('/', createTeacher);           // Create a new teacher
router.get('/', getTeachers);             // Get all teachers
router.get('/setup/:id', getTeacher);  
router.get('/:id', getTeacherProfile); 
router.put('/:id', updateTeacher);        // Update teacher
router.delete('/:id', deleteTeacher);    // Delete teacher
router.get('/search/:email', searchTeacherByEmail); 

router.get('/institute/:id', getTeachersByInstitute); 
module.exports = router;
