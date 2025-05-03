const express = require('express');
const router = express.Router();
const { createProgram, getPrograms, getProgramById, updateProgram, deleteProgram,getProgramsByInstitute ,getTeacherPrograms } = require('../controllers/programController');

// Program routes
router.post('/', createProgram);           // Create a new program
router.get('/', getPrograms);             // Get all programs
router.get('/:id', getProgramById);       // Get program by ID
router.put('/:id', updateProgram);        // Update program
router.delete('/:id', deleteProgram);    // Delete program
router.get('/teacher/:id',getTeacherPrograms);
router.get('/institute/:id', getProgramsByInstitute);  
module.exports = router;
