const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true, index: true },
    phone: { type: String, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    address: { type: String, trim: true },
    birthday: { type: Date },
    note: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    favorite: { type: Boolean, default: false },
    isBlacklisted: { type: Boolean, default: false, index: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group', index: true }],
    lastViewedAt: { type: Date },
    source: { type: String, enum: ['local', 'google'], default: 'local', index: true },
    googleId: { type: String, trim: true },
    location: { type: pointSchema, default: undefined },
  },
  { timestamps: true }
);

contactSchema.index({ location: '2dsphere' });
contactSchema.index(
  { owner: 1, googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $exists: true } } }
);
contactSchema.index({ owner: 1, fullName: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Contact', contactSchema);
