const express = require('express');
const router = express.Router();
const { createEvent, getEvents, updateEvent, deleteEvent ,getEventById ,getUpcomingEvents,getEventsByInstitute} = require('../controllers/eventController');

// Event routes
router.post('/', createEvent);            // Create a new event
router.get('/', getEvents);               // Get all events
router.get('/:id', getEventById);         // Get event by ID
router.put('/:id', updateEvent);          // Update event
router.delete('/:id', deleteEvent);      // Delete event
router.get("/event/upcoming", getUpcomingEvents);
router.get('/institute/:id', getEventsByInstitute);
module.exports = router;
