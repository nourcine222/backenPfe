const Teacher = require('../models/Teacher');
const User = require('../models/User');

const createTeacher = async (req, res) => {
  try {
    const {
      CIN,
      userID,
      qualification,
      department
      ,
      years_of_experience,
      institut // 👈 Make sure institut is passed from frontend
    } = req.body;
{console.log(req.body)}
    // Required field validation
    if (!CIN || !userID || !qualification || !years_of_experience || !institut) {
      return res.status(400).json({ message: "CIN, UserID, Qualification, Years of Experience, and Institut are required." });
    }

    // Check for duplicate teacher
    const existingTeacher = await Teacher.findOne({ userID });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher profile already exists for this user." });
    }

    // Defaults
    const leave_balance = 10;
    const date_of_hiring = new Date();
    const salary = 0;

    // Create teacher
    const teacherProfile = new Teacher({
      
      CIN,
      userID,
      institut,
      qualification,
      department,
      years_of_experience,
     
      leave_balance,
      date_of_hiring,
      salary
    });

    await teacherProfile.save();
    res.status(201).json(teacherProfile);
  } catch (error) {
    console.error("Error creating teacher profile:", error);
    res.status(500).json({ message: "Server error while creating teacher profile" });
  }
};

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    return res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a teacher by userID
const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userID: req.params.id });
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    return res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update teacher
const updateTeacher = async (req, res) => {
  const {
    CIN,
    subject,
    department,
    qualification,
    years_of_experience,
    leave_balance,
    date_of_hiring,
    salary,
    maxHoursPerWeek,
    Availability,
    institut,
    reports
  } = req.body;

  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    teacher.CIN = CIN || teacher.CIN;
    teacher.subject = subject || teacher.subject;
    teacher.department = department || teacher.department;
    teacher.qualification = qualification || teacher.qualification;
    teacher.years_of_experience = years_of_experience || teacher.years_of_experience;
    teacher.leave_balance = leave_balance || teacher.leave_balance;
    teacher.date_of_hiring = date_of_hiring || teacher.date_of_hiring;
    teacher.salary = salary || teacher.salary;
    teacher.maxHoursPerWeek= maxHoursPerWeek || teacher.maxHoursPerWeek;
    teacher.Availability = Availability || Availability.salary;
    teacher.institut= institut || teacher.institut;
    teacher.reports= reports||teacher.reports;
    await teacher.save();
    return res.status(200).json({ msg: 'Teacher updated successfully', teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete teacher
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ msg: 'Teacher not found' });

    await teacher.remove();
    return res.status(200).json({ msg: 'Teacher deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ msg: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Profile setup API
const setupTeacherProfile = async (req, res) => {
  try {
    const { userID, CIN, qualification, years_of_experience } = req.body;
    const newTeacher = new Teacher({ userID, CIN, qualification, years_of_experience });
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ msg: 'Error creating profile' });
  }
};
const searchTeacherByEmail = async (req, res) => {
  try {
  
      const  email  = req.params.email; // Get email from query parameters
      if (!email) {
          return res.status(400).json({ message: "Email is required" });
      }
console.log(email+" email")
      const userr = await User.findOne({ email }); // Find teacher by email
      if (!userr) {
        return res.status(404).json({ message: "Teacher not found" });
    }

      console.log(userr)
      const teacher = await Teacher.findOne({userID:userr.id}).populate("userID")
      if (!teacher) {
          return res.status(404).json({ message: "Teacher not found" });
      }

      res.status(200).json(teacher);
  } catch (error) {
      console.error("Error searching teacher:", error);
      res.status(500).json({ message: "Server error" });
  }
};
exports.getAllTeachers = async (req, res) => {
  try {
    const instituteId = req.params.id;
    console.log(instituteId)
    const teachers = await Teacher.find({institut :instituteId}).populate('userID');
    console.log(teachers)
    res.status(200).json(teachers.teachers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers", error });
  }
};
const getTeachersByInstitute = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const payments = await Teacher.find({ instituteId }).populate('userID courses');

       
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacher,  // New method to fetch teacher by userID
  updateTeacher,
  deleteTeacher,
  setupTeacherProfile,
  getTeacherProfile,
  searchTeacherByEmail,
  getTeachersByInstitute
};
