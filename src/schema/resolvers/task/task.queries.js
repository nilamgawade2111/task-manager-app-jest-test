const Task = require('../../../models/Task');
const { ensureAuth } = require('../../../utils/auth');

module.exports = {
  tasks: async (_, args, ctx) => {
    if (ctx.user && ctx.user.role === 'ADMIN') {
      const q = {};
      if (args.status) q.status = args.status;
      if (args.assignedTo) q.assignedTo = args.assignedTo;
      return Task.find(q).populate('owner assignedTo');
    }

    ensureAuth(ctx);
    const userId = ctx.user.id;

    const q = {
      $or: [{ owner: userId }, { assignedTo: userId }]
    };
    if (args.status) q.status = args.status;

    return Task.find(q).populate('owner assignedTo');
  },

  task: async (_, { id }, ctx) => {
    const task = await Task.findById(id).populate('owner assignedTo');
    if (!task) throw new Error('Task not found');

    if (ctx.user && ctx.user.role === 'ADMIN') return task;

    if (!ctx.user) throw new Error('Not authenticated');

    const uid = ctx.user.id;
    if (
      task.owner._id.toString() === uid ||
      (task.assignedTo && task.assignedTo._id.toString() === uid)
    ) {
      return task;
    }

    throw new Error('Not authorized');
  }
};
