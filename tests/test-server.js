// tests/test-server.js
const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");

const typeDefs = require("../src/schema/typeDefs");
const resolvers = require("../src/schema/resolvers");
const { getUserFromToken } = require("../src/utils/auth");

function generateTestToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function createTestServer() {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      let user = null;

      // Read Authorization header from executeOperation context
      const auth = req?.headers?.authorization;

      if (auth) {
        user = await getUserFromToken(auth);
      }

      return { user };
    }
  });
}

module.exports = { createTestServer, generateTestToken };
