const Institute = require("../models/Institute");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Program = require("../models/Program");
const cloudinary = require('../config/cloudinary');

exports.createInstitute = async (req, res) => {
  try {
    const { id,name, photo,type, location, contact, establishment_year, email, phone_number } = req.body;
    const adminId = id; // Assume admin is logged in and verified
    console.log(req.body);
    // Upload the photo to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(photo, {
      folder: 'institutes_photos', // Optional: create a folder in Cloudinary
    });

    // Get the URL of the uploaded photo
    const photoUrl = uploadResponse.secure_url;

    // Create a new Institute with the Cloudinary photo URL
    const newInstitute = new Institute({
      name,
      photo: photoUrl, // Save the URL of the image
      type,
      admin: adminId,
      location,
      contact,
      establishment_year,
      email,
      phone_number,
    });

    await newInstitute.save();
    res.status(201).json({ message: 'Institute created successfully', institute: newInstitute });
  } catch (error) {
    res.status(500).json({ message: 'Error creating institute', error });
  }
};

// Get Institute by ID
exports.getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id).populate("admin", "name email");
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    res.status(200).json(institute);
  } catch (error) {
    res.status(500).json({ message: "Error fetching institute", error });
  }
};

// Update Institute
exports.updateInstitute = async (req, res) => {
  try {
    const updatedInstitute = await Institute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInstitute) return res.status(404).json({ message: "Institute not found" });

    res.status(200).json({ message: "Institute updated", institute: updatedInstitute });
  } catch (error) {
    res.status(500).json({ message: "Error updating institute", error });
  }
};

// Delete Institute
exports.deleteInstitute = async (req, res) => {
  try {
    const deletedInstitute = await Institute.findByIdAndDelete(req.params.id);
    if (!deletedInstitute) return res.status(404).json({ message: "Institute not found" });

    res.status(200).json({ message: "Institute deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting institute", error });
  }
};


// Get Admin Info
exports.getAdminInfo = async (req, res) => {
  try {
    console.log(req.params.id)
    const institute = await Institute.find({ admin: req.params.id}).populate('admin');


    res.status(200).json(institute);  // This will return the admin info
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin info", error });
  }
};

// Get Institute Stats
exports.getInstituteStats = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const totalTeachers = institute.teachers.length;
    const totalRH = institute.employees.length; // RH employees
    const totalDepartments = institute.departments.length;
    const totalPrograms = institute.programs.length;

    const totalEmployees = totalTeachers + totalRH; // Employees = RH + Teachers

    res.status(200).json({
      instituteName: institute.name,
      totalTeachers,
      totalEmployees,
      totalDepartments,
      totalPrograms,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

// Add RH (HR Employee)
exports.addRH = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const adminId =  req.params.id;
    const institute = await Institute.findOne({ admin: adminId });

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const newRH = new User({ name, email, password, role: "RH", institute: institute._id });
    await newRH.save();

    institute.employees.push(newRH._id);
    await institute.save();

    res.status(201).json({ message: "RH added successfully", employee: newRH });
  } catch (error) {
    res.status(500).json({ message: "Error adding RH", error });
  }
};

// Remove RH
exports.removeRH = async (req, res) => {
  try {
    const { rhId } = req.body;
    const adminId =  req.params.id;
    const institute = await Institute.findOne({ admin: adminId });

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    await User.findByIdAndDelete(rhId);
    institute.employees = institute.employees.filter(id => id.toString() !== rhId);
    await institute.save();

    res.status(200).json({ message: "RH removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing RH", error });
  }
};

exports.linkTeacherToInstitute = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const instituteId = req.params.id;

    const institute = await Institute.findById(instituteId);
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    teacher.institut = institute._id;
    await teacher.save();

    if (!institute.teachers.includes(teacher._id)) {
      institute.teachers.push(teacher._id);
    }
    await institute.save();

    res.status(200).json({ message: "Teacher linked to institute", teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error linking teacher", error });
  }
};


// Remove Teacher from Institute
exports.removeTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const adminId =  req.params.id;
    const institute = await Institute.findOne({ admin: adminId });

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    await Teacher.findByIdAndDelete(teacherId);
    institute.teachers = institute.teachers.filter(id => id.toString() !== teacherId);
    await institute.save();

    res.status(200).json({ message: "Teacher removed from institute" });
  } catch (error) {
    res.status(500).json({ message: "Error removing teacher", error });
  }
};

// CRUD for Programs
exports.createProgram = async (req, res) => {
  try {
    const { name, description, duration } = req.body;
    const adminId =  req.params.id;
    const institute = await Institute.findOne({ admin: adminId });

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const newProgram = new Program({
      name,
      description,
      duration,
      institute: institute._id
    });

    await newProgram.save();

    institute.programs.push(newProgram._id);
    await institute.save();

    res.status(201).json({ message: "Program created successfully", program: newProgram });
  } catch (error) {
    res.status(500).json({ message: "Error creating program", error });
  }
};

// Get All Programs
exports.getPrograms = async (req, res) => {
  try {
    const adminId =  req.params.id;
    const institute = await Institute.findOne({ admin: adminId }).populate("programs");

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    res.status(200).json(institute.programs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching programs", error });
  }
};

// Update Program
exports.updateProgram = async (req, res) => {
  try {
    const { programId, name, description, duration } = req.body;

    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      { name, description, duration },
      { new: true }
    );

    if (!updatedProgram) return res.status(404).json({ message: "Program not found" });

    res.status(200).json({ message: "Program updated", program: updatedProgram });
  } catch (error) {
    res.status(500).json({ message: "Error updating program", error });
  }
};

// Delete Program
exports.deleteProgram = async (req, res) => {
  try {
    const { programId } = req.body;

    await Program.findByIdAndDelete(programId);

    res.status(200).json({ message: "Program deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting program", error });
  }
};
// Create Department
exports.createDepartment = async (req, res) => {
  try {
    const { name, responsableEmail, description } = req.body;
    const adminId = req.params.id;
    const institute = await Institute.findOne({ admin: adminId });

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const newDepartment = {
      name,
      responsableEmail, // RH responsible by email
      description,
    };

    institute.departments.push(newDepartment);
    await institute.save();

    res.status(201).json({ message: "Department created successfully", department: newDepartment });
  } catch (error) {
    res.status(500).json({ message: "Error creating department", error });
  }
};
// Get All Departments
exports.getDepartments = async (req, res) => {
  try {
    const adminId =  req.params.id;
    const institute = await Institute.findOne({ admin: req.params.id }).populate("departments");

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    res.status(200).json(institute.departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error });
  }
};
// Update Department
exports.updateDepartment = async (req, res) => {
  try {
    const { departmentId, name, responsableEmail, description } = req.body;
    const adminId =  req.params.id;
    const institute = await Institute.findOne({ admin: adminId });

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const department = institute.departments.id(departmentId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    department.name = name || department.name;
    department.responsableEmail = responsableEmail || department.responsableEmail;
    department.description = description || department.description;

    await institute.save();

    res.status(200).json({ message: "Department updated successfully", department });
  } catch (error) {
    res.status(500).json({ message: "Error updating department", error });
  }
};
// Delete Department
exports.deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;
    const adminId =  req.params.id;
    const institute = await Institute.findOne({ admin: adminId });

    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const department = institute.departments.id(departmentId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    department.remove();
    await institute.save();

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting department", error });
  }
};
// Get All Institutes
exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json(institutes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching institutes", error });
  }
};

// Get All RH Employees
exports.getAllRH = async (req, res) => {
  try {
    const instituteId = req.params.id;
    const rhEmployees = await User.find({ institute: instituteId, role: "RH" });
    res.status(200).json(rhEmployees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching RH employees", error });
  }
};

// Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const instituteId = req.params.id;
    console.log(instituteId)
    const teachers = await Teacher.find({institut :instituteId}).populate('userID');
    console.log(teachers)
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers", error });
  }
};

// Get All Programs
exports.getAllPrograms = async (req, res) => {
  try {
    const instituteId = req.params.id;
    const programs = await Program.find({ adminId: instituteId });
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching programs", error });
  }
};

// Get All Departments
exports.getAllDepartments = async (req, res) => {
  try {
    const instituteId = req.params.id;
    const institute = await Institute.findById(instituteId);
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    res.status(200).json(institute.departments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments", error });
  }
};
