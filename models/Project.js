const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['ACTIVE', 'COMPLETED'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
