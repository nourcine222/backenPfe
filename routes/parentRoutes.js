const express = require('express');
const router = express.Router();
const { createParent, getParents, getParentsById,updateParent, deleteParent ,getStudents, addchild } = require('../controllers/parentController');

// Parent routes
router.post('/', createParent);           // Create a new parent
router.get('/', getParents); 
router.post('/addChild/child', addchild);   
router.get('/:id', getParentsById);               // Get all parents
router.put('/:id', updateParent);        // Update parent
router.delete('/:id', deleteParent);    // Delete parent
router.get("/:parentId/students", getStudents);
module.exports = router;
