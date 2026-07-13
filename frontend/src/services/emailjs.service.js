import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const RESET_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const WELCOME_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID;

const send = (templateId, templateParams) => {
  if (!SERVICE_ID || !templateId || !PUBLIC_KEY) {
    throw new Error('EmailJS is not configured');
  }
  return emailjs.send(SERVICE_ID, templateId, templateParams, { publicKey: PUBLIC_KEY });
};

export const sendPasswordResetEmail = ({ email, name, resetUrl }) =>
  send(RESET_TEMPLATE_ID, { to_email: email, to_name: name, reset_url: resetUrl });

export const sendWelcomeEmail = ({ email, name }) =>
  send(WELCOME_TEMPLATE_ID, { to_email: email, to_name: name });
