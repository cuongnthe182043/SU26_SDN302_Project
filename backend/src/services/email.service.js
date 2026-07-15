const axios = require('axios');

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

// Credentials live in backend/.env. The VITE_ fallbacks keep the existing
// variable names working; prefer the un-prefixed names going forward.
const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const RESET_TEMPLATE_ID = process.env.EMAILJS_RESET_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID;
const WELCOME_TEMPLATE_ID =
  process.env.EMAILJS_WELCOME_TEMPLATE_ID || process.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID;

const send = async (templateId, templateParams) => {
  if (!SERVICE_ID || !templateId || !PUBLIC_KEY) {
    throw new Error('EmailJS is not configured');
  }

  const payload = {
    service_id: SERVICE_ID,
    template_id: templateId,
    user_id: PUBLIC_KEY,
    template_params: templateParams,
  };

  // Server-side (non-browser) calls require the private key when the EmailJS
  // account has "API calls in strict mode" enabled.
  if (PRIVATE_KEY) {
    payload.accessToken = PRIVATE_KEY;
  }

  await axios.post(EMAILJS_ENDPOINT, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
};

const sendPasswordResetEmail = ({ email, name, resetUrl }) =>
  send(RESET_TEMPLATE_ID, { email, name, link: resetUrl });

const sendWelcomeEmail = ({ email, name }) => send(WELCOME_TEMPLATE_ID, { email, name });

module.exports = { sendPasswordResetEmail, sendWelcomeEmail };
