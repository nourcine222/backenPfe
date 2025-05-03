const Timetable = require('../models/Timetable');

// Get all timetables by institute ID
const getTimetablesByInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    const timetables = await Timetable.find({ institute: id });
    return res.status(200).json(timetables);
  } catch (error) {
    console.error("Error fetching timetables by institute:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Create a new timetable
const createTimetable = async (req, res) => {
  try {
    const { timetable } = req.body;
    console.log("Timetable.sessions = ", timetable.sessions);

    console.log("Received timetable:", req.body)
    if (!timetable) {
      return res.status(400).json({ msg: 'Timetable data is required' });
    }

    const newTimetable = new Timetable({ ...timetable });

    // Optional: Check if sessions are present
    if (!Array.isArray(newTimetable.sessions) || newTimetable.sessions.length === 0) {
      console.warn('⚠️ Warning: Timetable created without sessions');
    }

    await newTimetable.save();
    return res.status(201).json({ msg: 'Timetable created successfully', timetable: newTimetable });
  } catch (error) {
    console.error("Error creating timetable:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all timetables
const getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find();
    return res.status(200).json(timetables);
  } catch (error) {
    console.error("Error fetching all timetables:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get timetable by ID
const getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ msg: 'Timetable not found' });
    return res.status(200).json(timetable);
  } catch (error) {
    console.error("Error fetching timetable by ID:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update timetable
const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const timetable = await Timetable.findById(id);
    if (!timetable) return res.status(404).json({ msg: 'Timetable not found' });

    // Only update if values are provided
    timetable.course_id = updates.course_id ?? timetable.course_id;
    timetable.semester = updates.semester ?? timetable.semester;
    timetable.start_time = updates.start_time ?? timetable.start_time;
    timetable.end_time = updates.end_time ?? timetable.end_time;
    timetable.sessions = updates.sessions ?? timetable.sessions;
    timetable.status = updates.status ?? timetable.status;

    await timetable.save();
    return res.status(200).json({ msg: 'Timetable updated successfully', timetable });
  } catch (error) {
    console.error("Error updating timetable:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete timetable
const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Timetable.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ msg: 'Timetable not found' });
    return res.status(200).json({ msg: 'Timetable deleted successfully' });
  } catch (error) {
    console.error("Error deleting timetable:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createTimetable,
  getTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
  getTimetablesByInstitute
};
