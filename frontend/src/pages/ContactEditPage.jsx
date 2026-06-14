import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import { contactsApi } from '../api/contacts';
import { mapContactToForm } from '../services/contactForm.service';

export default function ContactEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    contactsApi.get(id).then(({ data }) => setContact(data.contact));
  }, [id]);

  if (!contact) return <div className="text-slate-300">Loading...</div>;

  return (
    <ContactForm
      initialValues={mapContactToForm(contact)}
      submitLabel="Save Contact"
      onSubmit={async (form) => {
        await contactsApi.update(id, form);
        navigate(`/contacts/${id}`);
      }}
    />
  );
}
