const QnASession = require('../models/QnASession');

// Create a new QnA session
const createQnASession = async (req, res) => {
  const { course_id, title, messages, status } = req.body;

  try {
    const newQnASession = new QnASession({
      course_id,
      title,
      messages,
      status: status || 'open',
    });

    await newQnASession.save();
    return res.status(201).json({ msg: 'QnA session created successfully', qnaSession: newQnASession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all QnA sessions
const getQnASessions = async (req, res) => {
  try {
    const qnaSessions = await QnASession.find();
    return res.status(200).json(qnaSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get QnA session by ID
const getQnASessionById = async (req, res) => {
  try {
    const qnaSession = await QnASession.findById(req.params.id);
    if (!qnaSession) return res.status(404).json({ msg: 'QnA session not found' });
    return res.status(200).json(qnaSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update QnA session
const updateQnASession = async (req, res) => {
  const { title, messages, status } = req.body;

  try {
    const qnaSession = await QnASession.findById(req.params.id);
    if (!qnaSession) return res.status(404).json({ msg: 'QnA session not found' });

    qnaSession.title = title || qnaSession.title;
    qnaSession.messages = messages || qnaSession.messages;
    qnaSession.status = status || qnaSession.status;

    await qnaSession.save();
    return res.status(200).json({ msg: 'QnA session updated successfully', qnaSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete QnA session
const deleteQnASession = async (req, res) => {
  try {
    const qnaSession = await QnASession.findById(req.params.id);
    if (!qnaSession) return res.status(404).json({ msg: 'QnA session not found' });

    await qnaSession.remove();
    return res.status(200).json({ msg: 'QnA session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createQnASession,
  getQnASessions,
  getQnASessionById,
  updateQnASession,
  deleteQnASession,
};
