const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { generateAuthToken, generateVerificationCode } = require('../utils/authUtils');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.get('/google', authController.googleAuth);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google'
  }),
  async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.user.email });
      
      if (existingUser) {
        return res.redirect(process.env.FRONTEND_URL + '/setup?message=already_registered');
      }
      
      const verificationCode = generateVerificationCode();
      
      const user = new User({
        name: req.user.displayName,
        email: req.user.email,
        password: '',
        verificationCode,
        isVerified: true
      });
      
      await user.save();
      await sendVerificationEmail(req.user.email, verificationCode);
      
      console.log(req.user);
      const token = generateAuthToken(req.user._id);
      res.redirect(process.env.FRONTEND_URL + `/verify?token=${token}`);
    } catch (error) {
      console.error(error);
      res.redirect(process.env.FRONTEND_URL + '/error?message=server_error');
    }
  }
);

module.exports = router;