import { useState } from 'react';
import { contactsApi } from '../api/contacts';
import ContactTable from '../components/ContactTable';
import Input from '../components/Input';
import Button from '../components/Button';

export default function NearbyContactsPage() {
  const [coords, setCoords] = useState({ lat: '', lng: '', radius: 5 });
  const [contacts, setContacts] = useState([]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-4">
        <Input label="Latitude" value={coords.lat} onChange={(e) => setCoords({ ...coords, lat: e.target.value })} />
        <Input label="Longitude" value={coords.lng} onChange={(e) => setCoords({ ...coords, lng: e.target.value })} />
        <Input label="Radius (km)" value={coords.radius} onChange={(e) => setCoords({ ...coords, radius: e.target.value })} />
        <div className="flex items-end">
          <Button
            className="w-full"
            onClick={async () => {
              const { data } = await contactsApi.nearby(coords);
              setContacts(data.contacts);
            }}
          >
            Search
          </Button>
        </div>
      </div>
      <ContactTable contacts={contacts} showActions={false} />
    </div>
  );
}
