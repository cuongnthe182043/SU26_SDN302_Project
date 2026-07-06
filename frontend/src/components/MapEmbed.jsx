import LeafletMap from './LeafletMap';

export default function MapEmbed({ contact }) {
  const [lng, lat] = contact?.location?.coordinates || [];
  if (lat === undefined || lng === undefined) return null;

  return (
    <LeafletMap
      center={[lat, lng]}
      zoom={14}
      markers={[{ position: [lat, lng], label: contact?.fullName || 'Contact location' }]}
    />
  );
}
