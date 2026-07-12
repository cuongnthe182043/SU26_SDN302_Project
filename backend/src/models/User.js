const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: { type: String, index: true, sparse: true, unique: true },
    googleConnected: { type: Boolean, default: false },
    googleRefreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
