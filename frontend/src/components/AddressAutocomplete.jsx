import { useEffect, useRef, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { contactsApi } from '../api/contacts';

export default function AddressAutocomplete({ label = 'Address', value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleQueryChange = (text) => {
    onChange(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text || text.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await contactsApi.suggestAddress(text);
        setSuggestions(data.suggestions || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <Combobox value={value} onChange={(selected) => onChange(selected)}>
      <div className="relative">
        <label className="block space-y-2 text-sm text-slate-300">
          <span>{label}</span>
          <div className="relative">
            <Combobox.Input
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-10 text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400"
              displayValue={(v) => v || ''}
              placeholder="Start typing an address..."
              onChange={(e) => handleQueryChange(e.target.value)}
            />
            <MapPinIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </div>
        </label>
        <Transition
          as="div"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setSuggestions([])}
        >
          {suggestions.length > 0 || loading ? (
            <Combobox.Options
              static
              className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-slate-900 p-1 text-sm shadow-xl shadow-black/40"
            >
              {loading ? (
                <div className="px-4 py-3 text-slate-400">Searching...</div>
              ) : (
                suggestions.map((item) => (
                  <Combobox.Option
                    key={`${item.latitude}-${item.longitude}`}
                    value={item.formatted}
                    className={({ active }) =>
                      `flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ${
                        active ? 'bg-emerald-400/20 text-emerald-200' : 'text-slate-200'
                      }`
                    }
                  >
                    <MapPinIcon className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate">{item.formatted}</span>
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          ) : null}
        </Transition>
      </div>
    </Combobox>
  );
}
