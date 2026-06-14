const axios = require('axios');

const geocodeAddress = async (address) => {
  if (!address || !process.env.GEOAPIFY_API_KEY) {
    return null;
  }

  const response = await axios.get('https://api.geoapify.com/v1/geocode/search', {
    params: {
      text: address,
      apiKey: process.env.GEOAPIFY_API_KEY,
      limit: 1,
    },
  });

  const feature = response.data?.features?.[0];
  const lon = feature?.properties?.lon;
  const lat = feature?.properties?.lat;

  if (typeof lon !== 'number' || typeof lat !== 'number') {
    return null;
  }

  return { longitude: lon, latitude: lat };
};

module.exports = { geocodeAddress };
