const jwt = require('jsonwebtoken');

exports.generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.generateAuthToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};