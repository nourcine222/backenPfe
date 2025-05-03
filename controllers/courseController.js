const Course = require('../models/Course');

// Create a new course
const createCourse = async (req, res) => {
  const {
    program, course_name, description, credits, teacher, subject,
    modules, schedule, attendance, scheduled_exams, category, status,
    startDate, endDate, quizs,
  } = req.body;

  try {
    const newCourse = new Course({
      program,
      course_name,
      description,
      credits,
      teacher,
      subject,
      modules,
      schedule,
      attendance,
      scheduled_exams,
      category,
      status: status || 'active', // Default status to 'active'
      startDate,
      endDate,
      quizs,
    });

    await newCourse.save();
    return res.status(201).json({ msg: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find() .populate('program')  // Populate 'program' field (assuming it's a reference to a Program model)
    .populate('teacher');;
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id) .populate('program')  // Populate 'program' field (assuming it's a reference to a Program model)
    .populate('teacher');;
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update course
const updateCourse = async (req, res) => {
  const {
    program, course_name, description, credits, teacher, subject,
    modules, schedule, attendance, scheduled_exams, category, status,
    startDate, endDate, quizs,
  } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    course.course_name = course_name || course.course_name;
    course.description = description || course.description;
    course.credits = credits || course.credits;
    course.teacher = teacher || course.teacher;
    course.subject = subject || course.subject;
    course.modules = modules || course.modules;
    course.schedule = schedule || course.schedule;
    course.attendance = attendance || course.attendance;
    course.scheduled_exams = scheduled_exams || course.scheduled_exams;
    course.category = category || course.category;
    course.status = status || course.status;
    course.startDate = startDate || course.startDate;
    course.endDate = endDate || course.endDate;
    course.quizs = quizs || course.quizs;

    await course.save();
    return res.status(200).json({ msg: 'Course updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    await course.remove();
    return res.status(200).json({ msg: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getCoursesByTeacher = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.params.teacherId })
      .populate('program')
      .populate('teacher');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses by teacher', error });
  }
};

// Get courses by institute
const getCoursesByInstitute = async (req, res) => {
  try {
    const programs = await Program.find({ institute: req.params.instituteId }).select('_id');
    const programIds = programs.map(p => p._id);

    const courses = await Course.find({ program: { $in: programIds } })
      .populate('program')
      .populate('teacher');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses by institute', error });
  }
};

// Get courses by program
const getCoursesByProgram = async (req, res) => {
  try {
    const courses = await Course.find({ program: req.params.programId })
      .populate('program')
      .populate('teacher');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses by program', error });
  }
};
module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByTeacher,
  getCoursesByInstitute,
  getCoursesByProgram
};
