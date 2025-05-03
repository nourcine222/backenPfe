const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzes, getQuizById, updateQuiz, deleteQuiz, addStudentAnswer } = require('../controllers/quizController');

// Quiz routes
router.post('/', createQuiz);               // Create a new quiz
router.get('/', getQuizzes);                // Get all quizzes
router.get('/:id', getQuizById);           // Get quiz by ID
router.put('/:id', updateQuiz);            // Update quiz
router.delete('/:id', deleteQuiz);        // Delete quiz
router.post('/:id/student-answer', addStudentAnswer); // Add student answer to quiz

module.exports = router;
