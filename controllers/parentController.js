const Parent = require('../models/Parent');
const Student = require('../models/Student')
// Create a new parent
const createParent = async (req, res) => {
  const { userID, contact_information, child } = req.body;

  try {
    const newParent = new Parent({ userID, contact_information, child });
    await newParent.save();
    return res.status(201).json({ msg: 'Parent created successfully', parent: newParent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all parents
const getParents = async (req, res) => {
  try {
    const parents = await Parent.find();
    return res.status(200).json(parents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all parents
const getParentsById = async (req, res) => {
  try {
    console.log(req.params.id)
    const parent = await Parent.find({userID :req.params.id});
    return res.status(200).json(parent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
// Update parent
const updateParent = async (req, res) => {
  const {  contact_information, child } = req.body;

  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ msg: 'Parent not found' });

    parent.userID = parent.userID;
    parent.contact_information = contact_information || parent.contact_information;
    parent.child = child || parent.child;

    await parent.save();
    return res.status(200).json({ msg: 'Parent updated successfully', parent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete parent
const deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ msg: 'Parent not found' });

    await parent.remove();
    return res.status(200).json({ msg: 'Parent deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
const getStudents = async (req, res) => {
  try {
    // Log the incoming request for debugging
    console.log("Received request to get students for parentId:", req.params.parentId);

    // Query the parent by ID and populate the 'students' field
    const parent = await Parent.findById(req.params.parentId).populate('students');
    
    // Log the result of the query
    console.log("Parent found:", parent);
    
    if (!parent) {
      // Log the case where no parent is found
      console.log(`No parent found with ID: ${req.params.parentId}`);
      return res.status(404).json({ msg: "Parent not found" });
    }

    if (!parent.students || parent.students.length === 0) {
      // Log the case where the parent has no students
      console.log(`Parent with ID ${req.params.parentId} has no students.`);
      return res.status(404).json({ msg: "No students found for this parent" });
    }

    // Log the students found for the parent
    console.log(`Found students for parent with ID ${req.params.parentId}:`, parent.students);

    res.status(200).json({ students: parent.students });
  } catch (error) {
    // Log any errors that occur during the try block
    console.error("Error while fetching students:", error);
    res.status(500).json({ msg: "Failed to fetch students" });
  }
};

const User = require('../models/User');


// Create Student User and Student Document
const addchild = async (req, res) => {
  const { name, email, password, student_id, parent_id, program, academic_year, enrolled_courses, completed_courses, grades, attendance, fees_status } = req.body;

  try {
    // Create the student user (using User model)
    const newUser = new User({ name, email, password, role: 'student' });  // Set the role as 'student'
    await newUser.save();

    // Create the student document
    const newStudent = new Student({
      student_id,
      userID: newUser._id,
      parent_id,
      program,
      academic_year,
      enrolled_courses,
      completed_courses,
      grades,
      attendance,
      fees_status
    });
    await newStudent.save();

    // Optionally, update the Parent document to reference the new student
    const parent = await Parent.findById(parent_id);
    parent.child.push(newStudent._id);
    await parent.save();

    res.status(201).json({ message: 'Student account created successfully!', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student account', error });
  }
};

module.exports = {
  createParent,
  getParents,
  updateParent,
  deleteParent,
  getStudents,
  getParentsById,
  addchild
};
