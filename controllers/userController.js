const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password, role, phone_number, address, gender, age, institute } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone_number,
      address,
      gender,
      profile_picture: "https://res.cloudinary.com/dkq3vlps8/image/upload/v1722650427/i50vceflan1tnbk6rur7.webp",
      last_login: null,
      spentTime: 0,
      status: 'active',
      points: 0,
      age,
      institute
    });

    await newUser.save();

    return res.status(201).json({ msg: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user
const updateUser = async (req, res) => {
  const {
    name, email, currentPassword, newPassword, role, phone_number,
    address, profile_picture, status, gender, age, institute
  } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ msg: 'Current password is required' });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Incorrect current password' });
      if (newPassword.length < 6) return res.status(400).json({ msg: 'New password must be at least 6 characters' });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: 'Email is already in use' });
      user.email = email;
    }

    user.name = name || user.name;
    user.role = role || user.role;
    user.phone_number = phone_number || user.phone_number;
    user.address = address || user.address;
    user.profile_picture = profile_picture || user.profile_picture;
    user.status = status || user.status;
    user.gender = gender || user.gender;
    user.age = age || user.age;
    user.institute = institute || user.institute;

    await user.save();

    return res.status(200).json({ msg: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user for RH
const updaterh = async (req, res) => {
  const { name, email, role, phone_number, address, profile_picture, status, gender, age, institute } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.name = name || user.name;
    user.role = role || user.role;
    user.phone_number = phone_number || user.phone_number;
    user.address = address || user.address;
    user.profile_picture = profile_picture || user.profile_picture;
    user.status = status || user.status;
    user.gender = gender || user.gender;
    user.age = age || user.age;
    user.institute = institute || user.institute;

    await user.save();
    return res.status(200).json({ msg: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete user with password verification
const deleteUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    await User.findByIdAndDelete(user._id);
    return res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete user by ID
const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await User.findByIdAndDelete(id);
    return res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updaterh,
  deleteUser,
  deleteUserById
};
