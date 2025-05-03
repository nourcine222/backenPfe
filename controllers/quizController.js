const Quiz = require('../models/Quiz');

// Create a new quiz
const createQuiz = async (req, res) => {
  const { course_id, quiz_name, description, teacher, duration_minutes, questions, attempts_allowed, time_per_question, status } = req.body;

  try {
    const newQuiz = new Quiz({
      course_id,
      quiz_name,
      description,
      teacher,
      duration_minutes,
      questions,
      attempts_allowed: attempts_allowed || 1,
      time_per_question,
      status: status || 'active',
    });

    await newQuiz.save();
    return res.status(201).json({ msg: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    return res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update quiz
const updateQuiz = async (req, res) => {
  const { quiz_name, description, teacher, duration_minutes, questions, attempts_allowed, time_per_question, status } = req.body;

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    quiz.quiz_name = quiz_name || quiz.quiz_name;
    quiz.description = description || quiz.description;
    quiz.teacher = teacher || quiz.teacher;
    quiz.duration_minutes = duration_minutes || quiz.duration_minutes;
    quiz.questions = questions || quiz.questions;
    quiz.attempts_allowed = attempts_allowed || quiz.attempts_allowed;
    quiz.time_per_question = time_per_question || quiz.time_per_question;
    quiz.status = status || quiz.status;

    await quiz.save();
    return res.status(200).json({ msg: 'Quiz updated successfully', quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Use deleteOne on the model to remove the document by its _id
    const result = await Quiz.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Quiz deleted successfully' });
    } else {
      // This case might happen if the findById didn't actually fetch a deletable document
      res.status(500).json({ message: 'Failed to delete quiz' });
    }
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add student answer to a quiz
const addStudentAnswer = async (req, res) => {
  const { student_id, mark } = req.body;

  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    const studentAnswer = { id: student_id, mark };
    quiz.students.push(studentAnswer);
    await quiz.save();

    return res.status(200).json({ msg: 'Student answer added successfully', quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addStudentAnswer,
};
