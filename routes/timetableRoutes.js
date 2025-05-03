const express = require('express');
const router = express.Router();
const {
    createTimetable,
    getTimetables,
    getTimetableById,
    updateTimetable,
    deleteTimetable,
    getTimetablesByInstitute
  } = require('../controllers/timetableController');
  
// Timetable routes
router.post('/', createTimetable);            // Create a new timetable
router.get('/', getTimetables);               // Get all timetables
router.get('/:id', getTimetableById);         // Get timetable by ID
router.put('/:id', updateTimetable);          // Update timetable
router.delete('/:id', deleteTimetable);      // Delete timetable
router.get('/institute/:id', getTimetablesByInstitute);   
module.exports = router;
