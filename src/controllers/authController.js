const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ==========================
// REGISTER ADMIN (optional)
// ==========================
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const validRole = ['admin', 'superadmin', 'editor'].includes(role) ? role : 'admin';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: validRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// LOGIN ADMIN
// ==========================
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!['admin', 'superadmin', 'editor'].includes(user.role))
      return res.status(403).json({ message: 'Access denied' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// GET ADMIN PROFILE
// ==========================
exports.getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// UPDATE OWN PASSWORD
// ==========================
exports.updateOwnPassword = async (req, res) => {
  try {
    if (!['admin', 'superadmin', 'editor'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Editors cannot change password' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both passwords required' });

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// CREATE USER (admin/editor by superadmin)
// ==========================
exports.createUserByAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can create users' });
    }

    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const validRole = ['admin', 'superadmin', 'editor'].includes(role) ? role : 'admin';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: validRole,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// GET ALL USERS
// ==========================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// UPDATE OTHERS PASSWORD (superadmin)
// ==========================
exports.updateUserPassword = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can change others password' });
    }

    const { userId } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    res.json({ message: `Password for ${user.name} updated successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// DELETE USER (superadmin)
// ==========================
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// FORGOT PASSWORD
// ==========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 menit
    await user.save();

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetURL}">${resetURL}</a>
             <p>Link valid for 15 minutes.</p>`,
    });

    console.log('Reset token:', resetToken);

    res.json({ message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// RESET PASSWORD
// ==========================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// UPDATE USER (superadmin)
// ==========================
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can update user data' });
    }

    const { userId } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email?.toLowerCase() || user.email;
    if (role && ['admin', 'superadmin', 'editor'].includes(role)) user.role = role;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// GET USER BY ID (superadmin)
// ==========================
exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can access this' });
    }

    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
