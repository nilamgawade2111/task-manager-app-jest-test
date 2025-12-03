const bcrypt = require('bcryptjs');
const User = require('../../../models/User');
const { signToken } = require('../../../utils/auth');
const { validateRegisterInput, validateLoginInput } = require('../../../utils/validators');

module.exports = {
  register: async (_, { input }) => {
    let { email, password, name } = validateRegisterInput(
      input.email,
      input.password,
      input.name
    );
    const exists = await User.findOne({ email });
    if (exists) throw new Error('Email already in use');

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name, role: 'USER' });
    const token = signToken(user);

    return {
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    };
  },

  login: async (_, { email, password }) => {
    ({ email, password } = validateLoginInput(email, password));
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user found');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error('Invalid password');
    const token = signToken(user);
    return { token, user };
  }
};
