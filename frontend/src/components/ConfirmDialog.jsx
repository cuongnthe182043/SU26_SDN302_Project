import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from './Button';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onCancel} className="relative z-50">
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
            <Dialog.Panel className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-black/40">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-rose-400" />
                <div>
                  <Dialog.Title className="text-base font-semibold text-white">{title}</Dialog.Title>
                  {message ? <p className="mt-2 text-sm text-slate-400">{message}</p> : null}
                  {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                  {cancelLabel}
                </Button>
                <Button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="bg-rose-500 text-white hover:bg-rose-400"
                >
                  {loading ? 'Deleting...' : confirmLabel}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
