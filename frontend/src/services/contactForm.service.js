export const emptyContactForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  birthday: '',
  note: '',
  avatarUrl: '',
  favorite: false,
  isBlacklisted: false,
  groups: [],
};

export const mapContactToForm = (contact) => ({
  fullName: contact.fullName || '',
  email: contact.email || '',
  phone: contact.phone || '',
  address: contact.address || '',
  birthday: contact.birthday ? String(contact.birthday).slice(0, 10) : '',
  note: contact.note || '',
  avatarUrl: contact.avatarUrl || '',
  favorite: !!contact.favorite,
  isBlacklisted: !!contact.isBlacklisted,
  groups: (contact.groups || []).map((group) => (typeof group === 'string' ? group : group._id)),
});
