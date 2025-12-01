const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

// sign token
function signToken(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '7d' });
}

// get user from auth header (context helper)
async function getUserFromToken(token) {
  if (!token) return null;
  try {
    const cleaned = token.replace('Bearer ', '');
    const payload = jwt.verify(cleaned, JWT_SECRET);
    const user = await User.findById(payload.sub).select('-password');
    return user ? { id: user._id.toString(), role: user.role, email: user.email, name: user.name } : null;
  } catch (err) {
    return null;
  }
}

// role helpers
function ensureAuth(ctx) {
  if (!ctx.user) {
    const err = new Error('Not authenticated');
    err.code = 'UNAUTHENTICATED';
    throw err;
  }
}

function ensureAdmin(ctx) {
  ensureAuth(ctx);
  if (ctx.user.role !== 'ADMIN') {
    const err = new Error('Not authorized — admin only');
    err.code = 'FORBIDDEN';
    throw err;
  }
}

module.exports = { signToken, getUserFromToken, ensureAuth, ensureAdmin };
