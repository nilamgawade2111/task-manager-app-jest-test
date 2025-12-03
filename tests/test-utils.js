// tests/test-utils.js
const jwt = require('jsonwebtoken');

function getTokenForUser(user) {
  // Accept mongoose document or plain object
  const payload = {
    sub: user._id ? user._id.toString() : user.id,
    role: user.role || 'USER',
    email: user.email || ''
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '1d' });
}

module.exports = { getTokenForUser };
