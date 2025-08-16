import { useTranslation, type Language } from '../lib/translations';

interface DisclaimerTextProps {
  text?: string | null;
  className?: string;
  language?: Language;
}

export default function DisclaimerText({ text, className = '', language = 'en' }: DisclaimerTextProps) {
  if (!text?.trim()) return null;

  const t = useTranslation(language);

  return (
    <div className={`bg-yellow-50/60 border-l-4 border-yellow-400 p-4 rounded-lg ${className}`}>
      <h3 className="font-semibold mb-2 flex items-center gap-1">
        🏷️ {t.disclaimer}
      </h3>

      <p className="text-sm text-gray-800 whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}