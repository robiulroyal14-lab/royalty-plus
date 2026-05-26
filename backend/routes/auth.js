const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }
    
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    if (user.isLocked()) {
      return res.status(423).json({ error: 'Account locked. Try again later.' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min
      }
      await user.save();
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    
    // Reset failed attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      lastLogin: req.user.lastLogin
    }
  });
});

// POST /api/auth/setup (run once to create admin user)
router.post('/setup', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(403).json({ error: 'Setup already completed.' });
    }
    
    const { username, password, email } = req.body;
    const user = await User.create({
      username: username || 'admin',
      password: password || 'Admin@123456',
      email,
      role: 'admin'
    });
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully.',
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
