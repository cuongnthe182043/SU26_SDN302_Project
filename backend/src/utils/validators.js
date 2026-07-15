// Reject angle brackets in any human name field so the value can never carry an
// HTML/script tag (defense in depth on top of output escaping). Everything else —
// Vietnamese/Unicode letters, spaces, apostrophes, hyphens, dots — stays allowed
// so real names are not broken.
const NAME_PATTERN = /^[^<>]+$/;

const nameCharsMessage = (label = 'Name') => `${label} must not contain the characters < or >`;

module.exports = { NAME_PATTERN, nameCharsMessage };
