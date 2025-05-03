require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const cloudinary = require('./config/cloudinary')
// Import middleware
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import Routes
const AssignmentRoutes = require('./routes/assignmentRouters');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const parentRoutes = require('./routes/parentRoutes');
const examRoutes = require('./routes/examRoutes');
const eventRoutes = require('./routes/eventRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const programRoutes = require('./routes/programRoutes');
const qnaSessionRoutes = require('./routes/qnaSessionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const childRoutes = require('./routes/childRoutes');
const payment = require('./routes/paymentRoutes');
const jobs = require('./routes/jobOfferRoutes');
const condidate = require('./routes/condidateRoutes');
const instituteRoutes = require('./routes/instituteRoutes');
const app = express();
const reportRoutes = require('./routes/reportRoutes');
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes
app.use('/api/institutes',instituteRoutes );
app.use('/api/child',childRoutes );
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/qna', qnaSessionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/payments', payment);
app.use('/api/jobs', jobs);
app.use('/api/condidates', condidate);
app.use('/api/reports', reportRoutes);
app.use('/api/assignments', AssignmentRoutes)
//app.use('/api/ai', aiRoutes)
const multer = require("multer");



// Set up multer storage and file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure you have this directory or change as needed
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }
  
    cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          return res.status(500).send({ message: "Upload failed", error });
        }
        res.status(200).send(result);
        console.log(result)
      }
    );
  });
  
  
  app.delete('/delete', async (req, res) => {
    const { public_id } = req.body;
  
    if (!public_id) {
      return res.status(400).json({ error: 'Missing public_id in request.' });
    }
  
    try {
      const result = await cloudinary.uploader.destroy(public_id);
  
      if (result.result === 'ok' || result.result === 'not_found') {
        return res.status(200).json({ result: 'ok', message: 'File deleted successfully.' });
      } else {
        return res.status(500).json({ error: 'Failed to delete file from Cloudinary.' });
      }
    } catch (err) {
      console.error('Error deleting from Cloudinary:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  });
  
//app.use('/api/cloudinary', cloudinaryRoutes);
// Error Handling Middleware
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
