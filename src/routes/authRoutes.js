const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, getAdminProfile, updateOwnPassword, createUserByAdmin, getAllUsers, deleteUser, updateUserPassword, forgotPassword, resetPassword, updateUser, getUserById } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Register admin (optional — bisa dimatikan di production)
router.post('/register', registerAdmin);

// Login admin
router.post('/login', loginAdmin);

// Admin Profile
router.get('/profile', protect, getAdminProfile);

// Change own password
router.put('/update-password', protect, updateOwnPassword);

// Change others password (superadmin)
router.put('/password/:userId', protect, updateUserPassword);

// Create new admin (superadmin)
router.post('/create-admin', protect, createUserByAdmin);

// Get all users 
router.get('/users', protect, getAllUsers);

// Delete users (superadmin)
router.delete('/users/:userId', protect, deleteUser);

// FORGOT / RESET PASSWORD (tanpa login)
router.post('/forgot-password', forgotPassword);          
router.post('/reset-password/:token', resetPassword);

// Update user detail (superadmin)
router.put("/users/:userId", protect, updateUser);

// Get users id (superadmin)
router.get('/users/:userId', protect, getUserById);


module.exports = router;
