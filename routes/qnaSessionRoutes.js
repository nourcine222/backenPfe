const express = require('express');
const router = express.Router();
const { createQnASession, getQnASessions, getQnASessionById, updateQnASession, deleteQnASession } = require('../controllers/qnaSessionController');

// QnA Session routes
router.post('/', createQnASession);           // Create a new QnA session
router.get('/', getQnASessions);             // Get all QnA sessions
router.get('/:id', getQnASessionById);       // Get QnA session by ID
router.put('/:id', updateQnASession);        // Update QnA session
router.delete('/:id', deleteQnASession);    // Delete QnA session

module.exports = router;
