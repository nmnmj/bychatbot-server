const User = require('../models/User');
const { generateVerificationCode, generateAuthToken } = require('../utils/authUtils');
const { sendVerificationEmail } = require('../services/emailService');
const passport = require('passport');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const verificationCode = generateVerificationCode();
    
    const user = new User({
      name,
      email,
      password,
      verificationCode,
      isVerified: false
    });
    
    await user.save();
    await sendVerificationEmail(email, verificationCode);
    
    res.status(201).json({ message: 'Verification code sent' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();
    
    const token = generateAuthToken(user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Compare the password with the hashed password in the database
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // Generate an authentication token
    const token = generateAuthToken(user);

    // Send the token to the client
    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/api/auth/google'
}), (req, res) => {
  const token = generateAuthToken(req.user._id);
  res.redirect(process.env.FRONTEND_URL + `/verify?token=${token}`);
};