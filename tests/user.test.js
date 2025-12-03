// tests/user.test.js
const { createTestServer } = require('./test-server');
const { connect, closeDatabase, clearDatabase } = require('./test-db');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

// Import shared GraphQL queries
const { REGISTER_USER, LOGIN_USER, GET_ME, GET_USERS } = require('./graphql/user.gq');

beforeAll(async () => { await connect(); });
afterEach(async () => { await clearDatabase(); });
afterAll(async () => { await closeDatabase(); });

describe('User mutations & queries', () => {

  it('registers a user successfully', async () => {
    const server = createTestServer();

    const res = await server.executeOperation({
      query: REGISTER_USER,
      variables: {
        input: { name: 'Alice', email: 'alice@example.com', password: 'pass123' }
      }
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.register.user.email).toBe('alice@example.com');

    const dbUser = await User.findOne({ email: 'alice@example.com' });
    expect(dbUser).not.toBeNull();
    expect(dbUser.role).toBe('USER');
  });

  it('fails to register duplicate email', async () => {
    const hashed = await bcrypt.hash('pass123', 10);
    await User.create({ name: 'X', email: 'dup@example.com', password: hashed });

    const server = createTestServer();

    const res = await server.executeOperation({
      query: REGISTER_USER,
      variables: {
        input: { name: 'Dup', email: 'dup@example.com', password: 'pass123' }
      }
    });

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toMatchInlineSnapshot(
      `"Email already in use"`
    );
  });

  it('does not allow SQL-like injection in email', async () => {
    const server = createTestServer();

    const res = await server.executeOperation({
      query: REGISTER_USER,
      variables: {
        input: {
          name: "Hack",
          email: "test@evil.com' OR '1'='1",
          password: "p123456"
        }
      }
    });

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toMatchInlineSnapshot(
      `"Invalid email format"`
    );
  });

  it('does not allow weak password', async () => {
    const server = createTestServer();

    const res = await server.executeOperation({
      query: REGISTER_USER,
      variables: {
        input: {
          name: "Weak",
          email: "weak@example.com",
          password: "p"
        }
      }
    });

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toMatchInlineSnapshot(
      `"Password must be at least 6 characters"`
    );
  });

});
