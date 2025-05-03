const Program = require('../models/Program');

// Create a new program
const createProgram = async (req, res) => {
  const { 
    name, 
    courses, 
    level, 
    type, 
    certification, 
    passing_grade, 
    description, 
    institute, 
    duration,  // { value, unit }
    teachers, 
    fees, 
    requirements,
    subjects // Added subjects
  } = req.body;

  try {
    const newProgram = new Program({
      name,
      courses,
      level,
      type,
      certification: certification || false,
      passing_grade,
      description,
      institute,
      duration,  // Ensure duration is passed as { value, unit }
      teachers,
      fees,
      requirements,
      subjects // Adding subjects to the new program
    });

    await newProgram.save();
    return res.status(201).json({ msg: 'Program created successfully', program: newProgram });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all programs
const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find().populate('courses institute subjects.assigned_teacher');
    return res.status(200).json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get program by ID
const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('courses teachers institute subjects.assigned_teacher');
    if (!program) return res.status(404).json({ msg: 'Program not found' });
    return res.status(200).json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update program
const updateProgram = async (req, res) => {
  const { 
    name, 
    courses, 
    level, 
    type, 
    certification, 
    passing_grade, 
    description, 
    institute, 
    duration, 
    teachers, 
    fees, 
    requirements,
    subjects // Added subjects for update
  } = req.body;

  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ msg: 'Program not found' });

    program.name = name || program.name;
    program.courses = courses || program.courses;
    program.level = level || program.level;
    program.type = type || program.type;
    program.certification = certification !== undefined ? certification : program.certification;
    program.passing_grade = passing_grade || program.passing_grade;
    program.description = description || program.description;
    program.institute = institute || program.institute;
    program.duration = duration || program.duration;
    program.teachers = teachers || program.teachers;
    program.fees = fees || program.fees;
    program.requirements = requirements || program.requirements;
    program.subjects = subjects || program.subjects; // Update subjects

    await program.save();
    return res.status(200).json({ msg: 'Program updated successfully', program });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete program
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ msg: 'Program not found' });

    await program.deleteOne();
    return res.status(200).json({ msg: 'Program deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getTeacherPrograms = async (req, res) => {
  
  const { id } = req.params;
console.log(id)
 
  try {
    const programs = await Program.find({ 'subjects.assigned_teacher': req.params.id })
      .populate('subjects.assigned_teacher', 'name email') // Optional: include teacher details
      .populate('institute', 'name') // Optional: include institute info
      .select('name level type subjects');

    res.status(200).json(programs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching teacher programs' });
  }
};

module.exports = { getTeacherPrograms };
// Get programs by institute
const getProgramsByInstitute = async (req, res) => {
  try {
    
    const { instituteId } = req.params.id;
    console.log( req.params.id)
    const programs = await Program.find({ institute:  req.params.id }).populate('courses  subjects.assigned_teacher');
    
    if (!programs.length) return res.status(404).json({ msg: 'No programs found for this institute' });

    return res.status(200).json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  getProgramsByInstitute,
  getTeacherPrograms
};
