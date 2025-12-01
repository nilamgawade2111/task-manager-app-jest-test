const Task = require('../../../models/Task');
const { ensureAuth } = require('../../../utils/auth');

module.exports = {
  createTask: async (_, { input }, ctx) => {
    ensureAuth(ctx);

    const task = await Task.create({
      title: input.title,
      description: input.description,
      owner: ctx.user.id,
      assignedTo: input.assignedTo || null,
    });

    return Task.findById(task._id).populate('owner assignedTo');
  },

  updateTask: async (_, { id, input }, ctx) => {
    ensureAuth(ctx);

    const task = await Task.findById(id);
    if (!task) throw new Error('Task not found');

    if (ctx.user.role !== 'ADMIN' && task.owner.toString() !== ctx.user.id) {
      throw new Error('Not authorized');
    }

    Object.assign(task, input);
    await task.save();
    return Task.findById(task._id).populate('owner assignedTo');
  },

  changeTaskStatus: async (_, { id, status }, ctx) => {
    ensureAuth(ctx);

    const task = await Task.findById(id);
    if (!task) throw new Error('Task not found');

    const uid = ctx.user.id;
    const isOwner = task.owner.toString() === uid;
    const isAssigned = task.assignedTo?.toString() === uid;

    if (!isOwner && !isAssigned && ctx.user.role !== 'ADMIN') {
      throw new Error('Not authorized');
    }

    task.status = status;
    await task.save();
    return Task.findById(task._id).populate('owner assignedTo');
  },

  deleteTask: async (_, { id }, ctx) => {
    ensureAuth(ctx);

    const task = await Task.findById(id);
    if (!task) throw new Error('Task not found');

    if (ctx.user.role !== 'ADMIN' && task.owner.toString() !== ctx.user.id) {
      throw new Error('Not authorized');
    }

    await Task.deleteOne({ _id: id });
    return true;
  },

  assignTask: async (_, { id, userId }, ctx) => {
    ensureAuth(ctx);

    const task = await Task.findById(id);
    if (!task) throw new Error('Task not found');

    if (ctx.user.role !== 'ADMIN' && task.owner.toString() !== ctx.user.id) {
      throw new Error('Not authorized');
    }

    task.assignedTo = userId;
    await task.save();

    return Task.findById(task._id).populate('owner assignedTo');
  },
};
