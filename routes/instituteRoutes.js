const express = require("express");
const router = express.Router();
const instituteController = require("../controllers/instituteController");

// Institute CRUD
router.post("/", instituteController.createInstitute);
router.get("/:id", instituteController.getInstituteById);
router.put("/:id", instituteController.updateInstitute);
router.delete("/:id", instituteController.deleteInstitute);

// Get All Institutes
router.get("/", instituteController.getAllInstitutes);  // <-- Added route to get all institutes

// Admin Info & Stats
router.get("/:id/admin", instituteController.getAdminInfo);
router.get("/:id/stats", instituteController.getInstituteStats);

// RH (HR Employee) Management
router.post("/:id/rh", instituteController.addRH);
router.delete("/:id/rh", instituteController.removeRH);
router.get("/:id/rh", instituteController.getAllRH);  // <-- Added route to get all RH employees

// Teacher Management
router.post("/:id/teachers/link", instituteController.linkTeacherToInstitute);
router.delete("/:id/teachers/remove", instituteController.removeTeacher);
router.get("/:id/teachers", instituteController.getAllTeachers);  // <-- Added route to get all teachers

// Programs CRUD
router.post("/:id/programs", instituteController.createProgram);
router.get("/:id/programs", instituteController.getPrograms);
router.put("/:id/programs", instituteController.updateProgram);
router.delete("/:id/programs", instituteController.deleteProgram);
router.get("/:id/programs/all", instituteController.getAllPrograms);  // <-- Added route to get all programs

// Departments CRUD
router.post("/:id/departments", instituteController.createDepartment); // Create Department
router.get("/:id/departments", instituteController.getDepartments); // Get All Departments
router.put("/:id/departments", instituteController.updateDepartment); // Update Department
router.delete("/:id/departments", instituteController.deleteDepartment); // Delete Department
router.get("/:id/departments/all", instituteController.getAllDepartments);  // <-- Added route to get all departments

module.exports = router;
