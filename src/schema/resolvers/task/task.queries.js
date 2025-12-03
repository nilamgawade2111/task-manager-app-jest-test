const Task = require('../../../models/Task');
const { ensureAuth } = require('../../../utils/auth');
const {
  validateObjectId,
  validateStatus
} = require('../../../utils/validators');

module.exports = {
  tasks: async (_, args, ctx) => {
    const q = {};

    if (ctx.user && ctx.user.role === 'ADMIN') {
      if (args.status) validateStatus(args.status);
      if (args.assignedTo) validateObjectId(args.assignedTo, "assignedTo");

      if (args.status) q.status = args.status;
      if (args.assignedTo) q.assignedTo = args.assignedTo;

      return Task.find(q, null, { sanitizeFilter: true }).populate('owner assignedTo');
    }

    ensureAuth(ctx);
    const userId = ctx.user.id;

    validateObjectId(userId, "userId");

    q.$or = [{ owner: userId }, { assignedTo: userId }];

    if (args.status) {
      validateStatus(args.status);
      q.status = args.status;
    }

    return Task.find(q, null, { sanitizeFilter: true }).populate('owner assignedTo');
  },

  task: async (_, { id }, ctx) => {
    validateObjectId(id);

    const task = await Task.findById(id).populate('owner assignedTo');
    if (!task) throw new Error('Task not found');

    if (ctx.user && ctx.user.role === 'ADMIN') return task;

    ensureAuth(ctx);
    const uid = ctx.user.id;

    if (task.owner._id.toString() === uid) return task;
    if (task.assignedTo && task.assignedTo._id.toString() === uid) return task;

    throw new Error('Not authorized');
  }
};
