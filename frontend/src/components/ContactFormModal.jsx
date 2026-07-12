import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ContactForm from './ContactForm';
import { emptyContactForm } from '../services/contactForm.service';

export default function ContactFormModal({ open, onClose, onCreated }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/70" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-black/40">
              <div className="mb-4 flex shrink-0 items-center justify-between">
                <Dialog.Title className="text-lg font-semibold text-white">New Contact</Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto">
                <ContactForm
                  bare
                  initialValues={emptyContactForm}
                  submitLabel="Create Contact"
                  onSubmit={async (form) => {
                    await onCreated(form);
                    onClose();
                  }}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
