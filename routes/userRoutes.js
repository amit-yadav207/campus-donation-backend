const express = require('express');
const {  getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();



// CRUD operations
router.get('/', getAllUsers);            // Get all users
router.get('/:id', getUserById);         // Get user by ID
router.put('/:id', updateUser);          // Update user
router.delete('/:id', deleteUser);       // Delete user

module.exports = router;
