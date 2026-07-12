import LeafletMap from './LeafletMap';
import { escapeHtml } from '../utils/escapeHtml';

export default function MapEmbed({ contact }) {
  const [lng, lat] = contact?.location?.coordinates || [];

  if (lat === undefined || lng === undefined) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-sm text-slate-400">
        No location available for this contact
      </div>
    );
  }

  const label = contact?.address
    ? `<strong>${escapeHtml(contact.fullName || 'Contact')}</strong><br/>${escapeHtml(contact.address)}`
    : escapeHtml(contact?.fullName || 'Contact location');

  return (
    <LeafletMap
      center={[lat, lng]}
      zoom={15}
      className="h-80 w-full"
      markers={[{ position: [lat, lng], label }]}
    />
  );
}
