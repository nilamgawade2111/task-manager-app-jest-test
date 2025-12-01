// run with: node src/seeds/createAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

async function run() {
  await connectDB(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const pw = process.env.ADMIN_PASSWORD || 'adminpass';
  let admin = await User.findOne({ email });
  if (!admin) {
    const hashed = await bcrypt.hash(pw, 10);
    admin = await User.create({ email, password: hashed, role: 'ADMIN', name: 'Admin' });
    console.log('Admin created:', admin.email);
  } else {
    console.log('Admin already exists:', admin.email);
  }
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
