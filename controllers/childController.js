const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const bcrypt = require('bcryptjs');

// 📌 Helper Function: Auto-generate the current academic year
const getCurrentAcademicYear = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getFullYear() + 1}`;
};

/**
 * ✅ Create a Student (Add Child)
 * 1️⃣ Create a User for the student
 * 2️⃣ Create a Student record linked to the User & Parent
 */
const addChild = async (req, res) => {
  const { name, email, password, parent_id, program, enrolled_courses, completed_courses, grades, attendance, fees_status } = req.body;

  try {
    // Step 1: Create a User for the Student
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: 'student' });
    await newUser.save();

    // Step 2: Create a Student linked to the User & Parent
    const newStudent = new Student({
      userID: newUser._id, // Linked to User
      parent_id,           // Linked to Parent
      program,
      academic_year: getCurrentAcademicYear(), // Auto-set academic year
      enrolled_courses,
      completed_courses,
      grades,
      attendance,
      fees_status
    });
    await newStudent.save();

    // Step 3: Link Student to Parent
    await Parent.findByIdAndUpdate(parent_id, { $push: { child: newStudent._id } });

    res.status(201).json({ message: 'Student account created successfully!', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student account', error });
  }
};

/**
 * ✅ Get All Students (Children)
 */
const getAllChildren = async (req, res) => {
  try {
    const students = await Student.find().populate('userID parent_id');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve students', error });
  }
};

/**
 * ✅ Get a Single Student by ID
 */
const getChildById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('userID parent_id');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve student', error });
  }
};

/**
 * ✅ Get All Children of One Parent
 */
const getChildrenByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const children = await Student.find({ parent_id: parentId }).populate('userID');

    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve children for the parent', error });
  }
};

/**
 * ✅ Update a Student's Information
 */
const updateChild = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error });
  }
};

/**
 * ✅ Delete a Student
 * - Also deletes the associated User
 * - Removes Student reference from Parent
 */
const deleteChild = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Remove the Student's User account
    await User.findByIdAndDelete(student.userID);

    // Remove Student from Parent's child list
    await Parent.findByIdAndUpdate(student.parent_id, { $pull: { child: student._id } });

    // Delete the Student record
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error });
  }
};
// Get parent by childId
const getParentByChildId = async (req, res) => {
  try {
    // Log the incoming request for debugging
    console.log("Received request to get parent for childId:", req.params.childId);

    // Find the child (student) by its ID
    const child = await Student.findById(req.params.childId).populate('parent_id'); // Populate parent data

    if (!child) {
      // Log if no child is found
      console.log(`No child found with ID: ${req.params.childId}`);
      return res.status(404).json({ msg: "Child not found" });
    }

    // Log the parent found for the child
    console.log(`Found parent for child with ID ${req.params.childId}:`, child.parent_id);

    if (!child.parent_id) {
      // Log if no parent is associated with the child
      console.log(`Child with ID ${req.params.childId} has no parent associated.`);
      return res.status(404).json({ msg: "No parent found for this child" });
    }

    // Return the parent details
    res.status(200).json({ parent: child.parent_id });
  } catch (error) {
    // Log any errors that occur during the try block
    console.error("Error while fetching parent:", error);
    res.status(500).json({ msg: "Failed to fetch parent" });
  }
};

module.exports = {
  addChild,
  getAllChildren,
  getChildById,
  getChildrenByParent,
  updateChild,
  deleteChild,
  getParentByChildId
};
