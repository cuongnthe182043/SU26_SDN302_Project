const Contact = require('../models/Contact');
const Note = require('../models/Note');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const findOwnedContact = async (req) => {
  const contact = await Contact.findOne({ _id: req.params.contactId, owner: req.user._id });
  if (!contact) throw new AppError('Contact not found', 404);
  return contact;
};

const listNotes = asyncHandler(async (req, res) => {
  await findOwnedContact(req);
  const notes = await Note.find({ contact: req.params.contactId, owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ notes });
});

const createNote = asyncHandler(async (req, res) => {
  await findOwnedContact(req);
  const note = await Note.create({
    owner: req.user._id,
    contact: req.params.contactId,
    body: req.body.body,
  });
  res.status(201).json({ note });
});

const updateNote = asyncHandler(async (req, res) => {
  await findOwnedContact(req);
  const note = await Note.findOne({
    _id: req.params.noteId,
    owner: req.user._id,
    contact: req.params.contactId,
  });
  if (!note) throw new AppError('Note not found', 404);
  if (req.body.body !== undefined) note.body = req.body.body;
  await note.save();
  res.json({ note });
});

const deleteNote = asyncHandler(async (req, res) => {
  await findOwnedContact(req);
  const note = await Note.findOneAndDelete({
    _id: req.params.noteId,
    owner: req.user._id,
    contact: req.params.contactId,
  });
  if (!note) throw new AppError('Note not found', 404);
  res.json({ message: 'Note deleted' });
});

module.exports = {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
};
