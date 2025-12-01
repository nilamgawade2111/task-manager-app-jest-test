const User = require('../../../models/User');
const { ensureAdmin } = require('../../../utils/auth');

module.exports = {
  me: (_, __, ctx) => ctx.user || null,

  users: async (_, __, ctx) => {
    ensureAdmin(ctx);
    return User.find().select('-password');
  }
};
