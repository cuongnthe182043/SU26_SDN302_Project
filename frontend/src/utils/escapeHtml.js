const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => map[char]);
