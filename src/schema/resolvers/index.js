const userQueries = require('./user/user.queries');
const userMutations = require('./user/user.mutations');

const taskQueries = require('./task/task.queries');
const taskMutations = require('./task/task.mutations');

module.exports = {
  Query: {
    ...userQueries,
    ...taskQueries,
  },

  Mutation: {
    ...userMutations,
    ...taskMutations,
  }
};
