const Group = require('../models/Group');
const Contact = require('../models/Contact');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const listGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({ owner: req.user._id }).sort({ name: 1 });
  const counts = await Contact.aggregate([
    { $match: { owner: req.user._id } },
    { $unwind: '$groups' },
    { $group: { _id: '$groups', count: { $sum: 1 } } },
  ]);
  const countByGroup = new Map(counts.map((entry) => [String(entry._id), entry.count]));

  res.json({
    groups: groups.map((group) => ({
      ...group.toObject(),
      contactCount: countByGroup.get(String(group._id)) || 0,
    })),
  });
});

const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id, owner: req.user._id });
  if (!group) throw new AppError('Group not found', 404);
  const contacts = await Contact.find({ owner: req.user._id, groups: group._id }).sort({ fullName: 1 });
  res.json({ group, contacts });
});

const createGroup = asyncHandler(async (req, res) => {
  const group = await Group.create({
    owner: req.user._id,
    name: req.body.name,
    color: req.body.color,
  });
  res.status(201).json({ group });
});

const updateGroup = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id, owner: req.user._id });
  if (!group) throw new AppError('Group not found', 404);

  if (req.body.name !== undefined) group.name = req.body.name;
  if (req.body.color !== undefined) group.color = req.body.color;
  await group.save();

  res.json({ group });
});

const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!group) throw new AppError('Group not found', 404);
  await Contact.updateMany({ owner: req.user._id, groups: group._id }, { $pull: { groups: group._id } });
  res.json({ message: 'Group deleted' });
});

const addContactsToGroup = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id, owner: req.user._id });
  if (!group) throw new AppError('Group not found', 404);

  const contactIds = Array.isArray(req.body.contactIds) ? req.body.contactIds : [];
  if (contactIds.length === 0) throw new AppError('contactIds is required', 400);

  await Contact.updateMany(
    { _id: { $in: contactIds }, owner: req.user._id },
    { $addToSet: { groups: group._id } }
  );

  const contacts = await Contact.find({ owner: req.user._id, groups: group._id }).sort({ fullName: 1 });
  res.json({ group, contacts });
});

const removeContactFromGroup = asyncHandler(async (req, res) => {
  const group = await Group.findOne({ _id: req.params.id, owner: req.user._id });
  if (!group) throw new AppError('Group not found', 404);

  await Contact.updateOne(
    { _id: req.params.contactId, owner: req.user._id },
    { $pull: { groups: group._id } }
  );

  const contacts = await Contact.find({ owner: req.user._id, groups: group._id }).sort({ fullName: 1 });
  res.json({ group, contacts });
});

module.exports = {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addContactsToGroup,
  removeContactFromGroup,
};
