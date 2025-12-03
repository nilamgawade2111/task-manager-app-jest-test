const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

// sign token
function signToken(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '7d' });
}

async function getUserFromToken(header) {
  if (!header) return null;
  try {
    const cleaned = header.replace(/^Bearer\s+/i, '');
    const payload = jwt.verify(cleaned, process.env.JWT_SECRET);
    // payload.sub or id — choose what you signed
    const userId = payload.sub || payload.id || payload._id;
    if (!userId) return null;
    const user = await User.findById(userId).select('-password');
    if (!user) return null;
    return { id: user._id.toString(), role: user.role, email: user.email, name: user.name };
  } catch (e) {
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
