const express = require('express');
const { addChild, getAllChildren, getParentByChildId,getChildById, getChildrenByParent, updateChild, deleteChild } = require('../controllers/childController');

const router = express.Router();

router.post('/', addChild);                // ✅ Create a Student (Add Child)
router.get('/', getAllChildren);           // ✅ Get All child
router.get('/:id', getChildById);         // ✅ Get a Single Student
router.get('/parent/:parentId', getChildrenByParent); // ✅ Get All Children of One Parent
router.get('/parent-by-child/:childId', getParentByChildId); 
router.put('/:id', updateChild);          // ✅ Update Student
router.delete('/:id', deleteChild);       // ✅ Delete Student

module.exports = router;
