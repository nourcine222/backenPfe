// backend/controllers/examController.js
const Exam = require('../models/Exam');
const Course = require('../models/Course'); // Assuming you have a Course model
const Student = require('../models/Student'); // Assuming you have a Student model

// Admin CRUD Operations

// Create a new exam
const createExam = async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    const savedExam = await newExam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Failed to create exam', error: error.message });
  }
};

// Get all exams (with optional filtering)
const getAllExams = async (req, res) => {
  try {
    const { instituteId, courseId, type, status } = req.query;
    const filters = {};
    if (instituteId) filters.institute_id = instituteId;
    if (courseId) filters.course_id = courseId;
    if (type) filters.type = type;
    if (status) filters.status = status;

    const exams = await Exam.find(filters).populate('course_id').populate('teacher_id') .populate('institute_id');
    res.status(200).json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Failed to fetch exams', error: error.message });
  }
};

// Get a single exam by ID
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('institute_id', 'name')
      .populate('course_id', 'name')
      .populate('teacher_id', 'name');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
  }
};

// Update an exam by ID
const updateExam = async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('course_id', 'name')
      .populate('teacher_id', 'name');
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(updatedExam);
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ message: 'Failed to update exam', error: error.message });
  }
};

// Delete an exam by ID
const deleteExam = async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ message: 'Failed to delete exam', error: error.message });
  }
};

// Get Exam Progress (Admin)
const getExamProgress = async (req, res) => {
  const { examId } = req.params;
  try {
    const exam = await Exam.findById(examId).populate('grades.student_id', 'name');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam.grades);
  } catch (error) {
    console.error('Error fetching exam progress:', error);
    res.status(500).json({ message: 'Failed to fetch exam progress', error: error.message });
  }
};

// Student Exam Operations

// Get available exams for a student in a course
const getAvailableExamsForStudent = async (req, res) => {
  const { studentId, courseId } = req.params;
  const now = new Date();
  try {
    // Check if the student is enrolled in the course (you might have a separate enrollment model)
    const course = await Course.findById(courseId);
    if (!course || !course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    const exams = await Exam.find({
      course_id: courseId,
      status: 'active',
      $or: [
        { start_time: { $lte: now }, end_time: { $gte: now } }, // Exams within start and end time
        { start_time: { $exists: false }, end_time: { $exists: false } }, // Exams without specific time limits
        { start_time: { $lte: now }, end_time: { $exists: false } }, // Exams started, no end time
        { start_time: { $exists: false }, end_time: { $gte: now } }, // Exams with end time, no start time (active until end)
      ],
    }).select('-questions.correct_answer'); // Exclude correct answers for students

    // Filter out exams the student has already attempted the maximum number of times
    const availableExams = exams.filter(exam => {
      const attempts = exam.grades.filter(grade => grade.student_id.toString() === studentId).length;
      return attempts < exam.attempts_allowed;
    });

    res.status(200).json(availableExams);
  } catch (error) {
    console.error('Error fetching available exams:', error);
    res.status(500).json({ message: 'Failed to fetch available exams', error: error.message });
  }
};

// Get a specific exam for a student to take (excluding correct answers)
const getExamForStudent = async (req, res) => {
  const { examId, studentId } = req.params;
  try {
    const exam = await Exam.findById(examId)
      .where('status').equals('active')
      .select('-questions.correct_answer'); // Exclude correct answers
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found or not active' });
    }

    // Check if the student has reached the attempt limit
    const attempts = exam.grades.filter(grade => grade.student_id.toString() === studentId).length;
    if (attempts >= exam.attempts_allowed) {
      return res.status(400).json({ message: 'Attempt limit reached for this exam' });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error('Error fetching exam for student:', error);
    res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
  }
};

// Submit an exam taken by a student
const submitExam = async (req, res) => {
  const { examId, studentId } = req.params;
  const { answers } = req.body; // Answers should be an array corresponding to the questions

  try {
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam || exam.status !== 'active') {
      return res.status(404).json({ message: 'Exam not found or not active' });
    }

    // Check if the student has already submitted this exam
    const existingGrade = exam.grades.find(grade => grade.student_id.toString() === studentId);
    if (existingGrade) {
      return res.status(400).json({ message: 'You have already submitted this exam' });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== exam.questions.length) {
      return res.status(400).json({ message: 'Invalid number of answers submitted' });
    }

    let score = 0;
    const studentAnswers = [];
    let totalMarks = 0;

    exam.questions.forEach((question, index) => {
      totalMarks += question.marks;
      studentAnswers.push(answers[index]);
      const studentAnswer = answers[index];
      const correctAnswer = question.correct_answer;

      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        if (studentAnswer !== undefined && studentAnswer.toString() === correctAnswer.toString()) {
          score += question.marks;
        }
      } else if (question.question_type === 'short_answer') {
        // Short answer grading will likely require manual review
        // You might want to store the answer for review
      }
    });

    exam.grades.push({
      student_id: studentId,
      score: score,
      total_marks: totalMarks,
      answers: studentAnswers,
      submission_time: new Date(),
    });

    await exam.save();
    res.status(200).json({ message: 'Exam submitted successfully', score: score, totalMarks: totalMarks });

  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ message: 'Failed to submit exam', error: error.message });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getExamProgress,
  getAvailableExamsForStudent,
  getExamForStudent,
  submitExam,
};