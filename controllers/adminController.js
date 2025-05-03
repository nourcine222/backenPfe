const Admin = require('../models/Admin');

// Create a new admin
const createAdmin = async (req, res) => {
  const { userID, institute, department, permissions } = req.body;

  try {
    const newAdmin = new Admin({ userID, institute, department, permissions });
    await newAdmin.save();
    return res.status(201).json({ msg: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  const { userID, institute, department, permissions } = req.body;

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });

    admin.userID = userID || admin.userID;
    admin.institute = institute || admin.institute;
    admin.department = department || admin.department;
    admin.permissions = permissions || admin.permissions;

    await admin.save();
    return res.status(200).json({ msg: 'Admin updated successfully', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });

    await admin.remove();
    return res.status(200).json({ msg: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
};
