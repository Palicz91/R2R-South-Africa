import { Language } from '../lib/translations';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  className?: string;
}

export default function LanguageSelector({ value, onChange, className = '' }: LanguageSelectorProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="radio"
          value="en"
          checked={value === 'en'}
          onChange={(e) => onChange(e.target.value as Language)}
          className="sr-only peer"
        />
        <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${value === 'en'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
          English
        </div>
      </label>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="radio"
          value="hu"
          checked={value === 'hu'}
          onChange={(e) => onChange(e.target.value as Language)}
          className="sr-only peer"
        />
        <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${value === 'hu'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
          Magyar
        </div>
      </label>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="radio"
          value="de"
          checked={value === 'de'}
          onChange={(e) => onChange(e.target.value as Language)}
          className="sr-only peer"
        />
        <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${value === 'de'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
          Deutsch
        </div>
      </label>
    </div>
  );
}
