import { useState, useRef, useEffect, useMemo } from 'react';
import rawCountries from 'world-countries';
import emojiFlags from 'emoji-flags';

export interface Country {
  code: string;        // ISO-alpha-2
  name: string;
  dial: string;        // +36
  emoji: string;
}

/* építsünk listát futáskor – egyszer */
export const COUNTRIES: Country[] = rawCountries.map((c: any) => ({
  code : c.cca2,
  name : c.name.common,
  dial : `${c.idd.root}${c.idd.suffixes?.[0] ?? ''}`,
  emoji: (emojiFlags as any)[c.cca2]?.emoji ?? '🏳️',
})).sort((a,b) => a.name.localeCompare(b.name));

export const DEFAULT_COUNTRY = COUNTRIES.find(c => c.code === 'HU')!;

interface Props {
  value: Country;
  onChange: (c: Country) => void;
}

export default function CountryPicker({ value, onChange }: Props) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const ref               = useRef<HTMLDivElement>(null);

  /* outside-click close */
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  /* szűrt lista */
  const filtered = useMemo(() =>
    COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.dial.replace('+','').startsWith(query.replace('+',''))
    ), [query]);

  return (
    <div ref={ref} className="relative">
      {/* trigger */}
      <button
        type="button"
        onClick={() => { setOpen(!open); setQuery(''); }}
        className="flex items-center gap-1 px-2 py-1 h-10 rounded-md hover:bg-gray-100"
      >
        <span className="text-xl">{value.emoji}</span>
        <span className="text-sm">{value.dial}</span>
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-56 bg-white shadow-lg rounded-md border max-h-60 overflow-y-auto p-2">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search country or code"
            className="mb-2 w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1"
          />
          {filtered.map(c => (
            <button
              key={c.code}
              onClick={() => { onChange(c); setOpen(false); }}
              className="flex w-full items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-left text-sm"
            >
              <span className="text-lg">{c.emoji}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-gray-500">{c.dial}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-2">No match</p>
          )}
        </div>
      )}
    </div>
  );
}
