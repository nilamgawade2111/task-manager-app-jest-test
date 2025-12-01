const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },     // who created/owns the task
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },                // who it's assigned to (can be same as owner)
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
