const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const [result] = await Contact.aggregate([
    { $match: { owner: req.user._id } },
    {
      $facet: {
        total: [{ $count: 'count' }],
        favorite: [{ $match: { favorite: true } }, { $count: 'count' }],
        google: [{ $match: { source: 'google' } }, { $count: 'count' }],
        local: [{ $match: { source: 'local' } }, { $count: 'count' }],
      },
    },
  ]);

  const readCount = (items) => items?.[0]?.count || 0;

  res.json({
    totalContacts: readCount(result.total),
    favoriteContacts: readCount(result.favorite),
    googleContacts: readCount(result.google),
    localContacts: readCount(result.local),
  });
});

module.exports = { getStats };
