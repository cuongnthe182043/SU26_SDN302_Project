const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true, index: true },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
