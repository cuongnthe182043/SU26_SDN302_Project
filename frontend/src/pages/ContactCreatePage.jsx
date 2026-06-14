import { useNavigate } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import { contactsApi } from '../api/contacts';
import { emptyContactForm } from '../services/contactForm.service';

export default function ContactCreatePage() {
  const navigate = useNavigate();
  return (
    <ContactForm
      initialValues={emptyContactForm}
      submitLabel="Create Contact"
      onSubmit={async (form) => {
        await contactsApi.create(form);
        navigate('/contacts');
      }}
    />
  );
}
