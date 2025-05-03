const Event = require('../models/Event');
const mongoose = require('mongoose');

// Create a new event
const createEvent = async (req, res) => {
  const { event } = req.body; // Extract event from body

  try {
    const newEvent = new Event(event);
    await newEvent.save();
    return res.status(201).json({ msg: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update event
const updateEvent = async (req, res) => {
  const { event } = req.body; // Extract event from body

  try {
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) return res.status(404).json({ msg: 'Event not found' });

    // Update the fields
    existingEvent.title = event.title || existingEvent.title;
    existingEvent.type = event.type || existingEvent.type;
    existingEvent.status = event.status || existingEvent.status;
    existingEvent.date = event.date || existingEvent.date;
    existingEvent.location = event.location || existingEvent.location;
    existingEvent.hosted_by = event.hosted_by || existingEvent.hosted_by;
    existingEvent.creator = event.creator || existingEvent.creator;
    existingEvent.institute = event.institute || existingEvent.institute;
    existingEvent.programs = event.programs || existingEvent.programs;
    existingEvent.employees = event.employees || existingEvent.employees;
    existingEvent.parents = event.parents || existingEvent.parents;
    existingEvent.attachments = event.attachments || existingEvent.attachments;

    await existingEvent.save();
    return res.status(200).json({ msg: 'Event updated successfully', event: existingEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    console.log(req.params.id);
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    await event.deleteOne();
    return res.status(200).json({ msg: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error fetching event' });
  }
};

// Get upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'upcoming' });

    if (events.length === 0) {
      return res.status(200).json({ msg: 'No upcoming events found', count: 0 });
    }

    res.status(200).json({ events, count: events.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch upcoming events" });
  }
};

const getEventsByInstitute = async (req, res) => {
  const { id } = req.params;

  try {
    const events = await Event.find({ institute: id });

    if (events.length === 0) {
      return res.status(200).json(events);
    }

    res.status(200).json({ events, count: events.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to fetch events for this institute' });
  }
};


module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
  getUpcomingEvents,
  getEventsByInstitute
};
