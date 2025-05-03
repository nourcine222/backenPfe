const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// Admin Routes (require admin authentication)
router.post('/',  examController.createExam);
router.get('/',  examController.getAllExams);
router.get('/:id',  examController.getExamById);
router.put('/:id',  examController.updateExam);
router.delete('/:id',  examController.deleteExam);
router.get('/:examId/progress',  examController.getExamProgress);

// Student Routes (require student authentication)
router.get('/student/available/:studentId/course/:courseId',  examController.getAvailableExamsForStudent);
router.get('/student/:examId/:studentId',  examController.getExamForStudent);
router.post('/student/:examId/:studentId/submit',  examController.submitExam);

module.exports = router;