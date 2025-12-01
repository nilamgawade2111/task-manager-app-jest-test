require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/schema/typeDefs');
const resolvers = require('./src/schema/resolvers/index');
const connectDB = require('./src/config/db');
const { getUserFromToken } = require('./src/utils/auth');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  await connectDB(MONGO_URI);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = await getUserFromToken(token);
      return { user };
    },
  });

  const { url } = await server.listen({ port: PORT });
  console.log(`🚀 Server ready at ${url}`);
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
