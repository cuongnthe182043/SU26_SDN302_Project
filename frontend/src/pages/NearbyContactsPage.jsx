import { useState } from 'react';
import { contactsApi } from '../api/contacts';
import ContactTable from '../components/ContactTable';
import Input from '../components/Input';
import Button from '../components/Button';
import LeafletMap from '../components/LeafletMap';
import { escapeHtml } from '../utils/escapeHtml';

export default function NearbyContactsPage() {
  const [coords, setCoords] = useState({ lat: '', lng: '', radius: 5 });
  const [contacts, setContacts] = useState([]);
  const [searched, setSearched] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  const search = async (params) => {
    const { data } = await contactsApi.nearby(params);
    setContacts(data.contacts);
    setSearched(true);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          ...coords,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(next);
        setLocating(false);
        search(next);
      },
      () => {
        setLocating(false);
        setError('Unable to retrieve your location');
      }
    );
  };

  const markers = contacts
    .filter((contact) => contact.location?.coordinates)
    .map((contact) => {
      const [lng, lat] = contact.location.coordinates;
      return {
        position: [lat, lng],
        label: `<strong>${escapeHtml(contact.fullName)}</strong>${
          contact.address ? `<br/>${escapeHtml(contact.address)}` : ''
        }`,
      };
    });

  const centerLat = Number(coords.lat);
  const centerLng = Number(coords.lng);
  const hasCenter = !Number.isNaN(centerLat) && !Number.isNaN(centerLng) && coords.lat !== '' && coords.lng !== '';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-4">
        <Input label="Latitude" value={coords.lat} onChange={(e) => setCoords({ ...coords, lat: e.target.value })} />
        <Input label="Longitude" value={coords.lng} onChange={(e) => setCoords({ ...coords, lng: e.target.value })} />
        <Input label="Radius (km)" value={coords.radius} onChange={(e) => setCoords({ ...coords, radius: e.target.value })} />
        <div className="flex items-end gap-2">
          <Button className="w-full" onClick={() => search(coords)}>
            Search
          </Button>
        </div>
        <div className="md:col-span-4">
          <Button variant="secondary" onClick={useMyLocation} disabled={locating}>
            {locating ? 'Locating...' : 'Use my current location'}
          </Button>
          {error ? <span className="ml-3 text-sm text-rose-300">{error}</span> : null}
        </div>
      </div>

      {searched && markers.length > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            {markers.length} contact{markers.length === 1 ? '' : 's'} on the map
          </h2>
          <LeafletMap
            center={hasCenter ? [centerLat, centerLng] : undefined}
            markers={markers}
            fitToMarkers
            scrollWheelZoom
            className="h-96 w-full"
          />
        </div>
      ) : null}

      {searched && contacts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-400">
          No contacts found within {coords.radius}km of this location.
        </div>
      ) : null}

      <ContactTable contacts={contacts} showActions={false} />
    </div>
  );
}
