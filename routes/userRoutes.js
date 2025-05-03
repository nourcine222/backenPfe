const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser ,updaterh ,deleteUserById} = require('../controllers/userController');

// User routes
router.post('/', createUser);            // Create a new user
router.get('/', getUsers);               // Get all users
router.get('/:id', getUserById);         // Get user by ID
router.put('/:id', updateUser);   
router.put('/rh/:id', updaterh);        // Update user
router.delete('/:id', deleteUser);      // Delete user
router.delete('/user/:id', deleteUserById); 
module.exports = router;
