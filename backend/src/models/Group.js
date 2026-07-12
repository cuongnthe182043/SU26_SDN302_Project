const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, trim: true, default: '#10b981' },
  },
  { timestamps: true }
);

groupSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Group', groupSchema);
