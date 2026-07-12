const Contact = require('../models/Contact');
const Note = require('../models/Note');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { geocodeAddress, suggestAddresses } = require('../services/geocoding.service');

const parseBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const buildSort = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const allowed = new Set(['fullName', 'email', 'phone', 'createdAt', 'updatedAt', 'favorite', 'birthday']);
  const field = allowed.has(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;
  if (field === 'favorite') return { favorite: order };
  return { favorite: -1, [field]: order };
};

const buildSearchQuery = (search) =>
  search
    ? {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

const applyGeo = async (address) => {
  if (!address) return undefined;
  const geo = await geocodeAddress(address);
  return geo ? { type: 'Point', coordinates: [geo.longitude, geo.latitude] } : undefined;
};

const listContacts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const search = (req.query.search || '').trim();
  const sort = buildSort(req.query.sortBy, req.query.sortOrder);

  const filter = { owner: req.user._id, ...buildSearchQuery(search) };
  if (req.query.blacklisted === 'true') filter.isBlacklisted = true;
  else if (req.query.blacklisted === 'false') filter.isBlacklisted = false;
  if (req.query.group) filter.groups = req.query.group;

  const [total, contacts] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter)
      .populate('groups', 'name color')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  res.json({
    contacts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { $set: { lastViewedAt: new Date() } },
    { new: true }
  ).populate('groups', 'name color');
  if (!contact) throw new AppError('Contact not found', 404);
  res.json({ contact });
});

const recentContacts = asyncHandler(async (req, res) => {
  const type = req.query.type === 'added' ? 'added' : 'viewed';
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50);

  const filter = { owner: req.user._id };
  if (type === 'viewed') filter.lastViewedAt = { $exists: true };

  const contacts = await Contact.find(filter)
    .populate('groups', 'name color')
    .sort({ [type === 'added' ? 'createdAt' : 'lastViewedAt']: -1 })
    .limit(limit);

  res.json({ contacts });
});

const createContact = asyncHandler(async (req, res) => {
  const payload = {
    owner: req.user._id,
    fullName: req.body.fullName,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    birthday: req.body.birthday || null,
    note: req.body.note,
    avatarUrl: req.body.avatarUrl,
    favorite: parseBool(req.body.favorite),
    isBlacklisted: parseBool(req.body.isBlacklisted),
    groups: Array.isArray(req.body.groups) ? req.body.groups : undefined,
    source: req.body.source === 'google' ? 'google' : 'local',
    googleId: req.body.googleId,
  };

  const location = await applyGeo(payload.address);
  if (location) payload.location = location;

  const contact = await Contact.create(payload);
  res.status(201).json({ contact });
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
  if (!contact) throw new AppError('Contact not found', 404);

  const updates = {};
  ['fullName', 'phone', 'email', 'address', 'note', 'avatarUrl', 'source', 'googleId'].forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (req.body.favorite !== undefined) updates.favorite = parseBool(req.body.favorite, contact.favorite);
  if (req.body.isBlacklisted !== undefined) {
    updates.isBlacklisted = parseBool(req.body.isBlacklisted, contact.isBlacklisted);
  }
  if (Array.isArray(req.body.groups)) updates.groups = req.body.groups;
  if (req.body.birthday !== undefined) updates.birthday = req.body.birthday || null;

  if (req.body.address !== undefined) {
    updates.location = req.body.address ? await applyGeo(req.body.address) : undefined;
  }

  Object.assign(contact, updates);
  if (req.body.address !== undefined && !req.body.address) {
    contact.location = undefined;
  }
  await contact.save();
  await contact.populate('groups', 'name color');
  res.json({ contact });
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!contact) throw new AppError('Contact not found', 404);
  await Note.deleteMany({ contact: contact._id });
  res.json({ message: 'Contact deleted' });
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
  if (!contact) throw new AppError('Contact not found', 404);
  contact.favorite = !contact.favorite;
  await contact.save();
  res.json({ contact });
});

const toggleBlacklist = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
  if (!contact) throw new AppError('Contact not found', 404);
  contact.isBlacklisted = !contact.isBlacklisted;
  await contact.save();
  res.json({ contact });
});

const addressSuggestions = asyncHandler(async (req, res) => {
  const text = (req.query.text || '').trim();
  if (!text) return res.json({ suggestions: [] });
  const suggestions = await suggestAddresses(text);
  res.json({ suggestions });
});

const nearbyContacts = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Number(req.query.radius || 5);

  if (Number.isNaN(lat) || Number.isNaN(lng) || Number.isNaN(radius)) {
    throw new AppError('Invalid nearby search parameters', 400);
  }

  const maxDistance = radius / 6378.1;
  const contacts = await Contact.find({
    owner: req.user._id,
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], maxDistance],
      },
    },
  }).sort({ createdAt: -1 });

  res.json({ contacts });
});

module.exports = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  toggleFavorite,
  toggleBlacklist,
  recentContacts,
  nearbyContacts,
  addressSuggestions,
};
