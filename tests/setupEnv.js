// tests/setupEnv.js
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });

// Optional guard: fail fast if JWT_SECRET missing
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env.test');
}
