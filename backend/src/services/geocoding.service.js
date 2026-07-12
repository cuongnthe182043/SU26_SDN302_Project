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

const suggestAddresses = async (text) => {
  if (!text || !process.env.GEOAPIFY_API_KEY) {
    return [];
  }

  const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
    params: {
      text,
      apiKey: process.env.GEOAPIFY_API_KEY,
      limit: 5,
    },
  });

  return (response.data?.features || [])
    .map((feature) => ({
      formatted: feature.properties?.formatted,
      longitude: feature.properties?.lon,
      latitude: feature.properties?.lat,
    }))
    .filter((item) => item.formatted && typeof item.longitude === 'number' && typeof item.latitude === 'number');
};

module.exports = { geocodeAddress, suggestAddresses };
