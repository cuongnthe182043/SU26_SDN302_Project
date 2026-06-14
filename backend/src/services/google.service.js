const { google } = require('googleapis');
const { signGoogleStateToken, verifyGoogleStateToken } = require('../utils/jwt');

const scopes = ['https://www.googleapis.com/auth/contacts.readonly'];

const createOAuthClient = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

const buildGoogleAuthUrl = (userId) =>
  createOAuthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    state: signGoogleStateToken(userId),
  });

const exchangeCodeForTokens = async (code) => {
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
};

const fetchGoogleContacts = async (refreshToken) => {
  const client = createOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });

  const people = google.people({ version: 'v1', auth: client });
  const response = await people.people.connections.list({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,phoneNumbers,photos,birthdays,addresses',
    pageSize: 1000,
  });

  return (response.data.connections || []).map((item) => {
    const name = item.names?.find((entry) => entry.displayName)?.displayName || 'Google Contact';
    const email = item.emailAddresses?.find((entry) => entry.value)?.value || '';
    const phone = item.phoneNumbers?.find((entry) => entry.value)?.value || '';
    const address = item.addresses?.find((entry) => entry.formattedValue)?.formattedValue || '';
    const avatarUrl = item.photos?.find((entry) => entry.url)?.url || '';
    const birthday = item.birthdays?.find((entry) => entry.date)?.date || null;

    return {
      fullName: name,
      email,
      phone,
      address,
      avatarUrl,
      birthday: birthday
        ? new Date(birthday.year || 1970, (birthday.month || 1) - 1, birthday.day || 1)
        : null,
      googleId: item.resourceName,
      source: 'google',
    };
  });
};

const resolveGoogleState = (state) => verifyGoogleStateToken(state).userId;

module.exports = {
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  fetchGoogleContacts,
  resolveGoogleState,
};
