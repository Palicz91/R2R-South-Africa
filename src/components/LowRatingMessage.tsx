import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTranslation, type Language } from '../lib/translations';

interface LowRatingMessageProps {
  rating: number;
  onContinue: () => void;
  language?: Language;
}

export default function LowRatingMessage({ rating, onContinue, language = 'en' }: LowRatingMessageProps) {
  const t = useTranslation(language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 p-6 rounded-xl text-center"
    >
      <div className="flex justify-center mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        ))}
        {[...Array(5 - rating)].map((_, i) => (
          <Star key={i + rating} className="w-6 h-6 text-gray-300" />
        ))}
      </div>
      
      <h2 className="text-xl font-semibold text-blue-900 mb-3">
        {t.lowRatingThankYou}
      </h2>
      
      <p className="text-blue-700 mb-6">
        {t.lowRatingAppreciation}
      </p>

      <button
        onClick={onContinue}
        className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium
                 hover:bg-blue-700 transition-colors"
      >
        {t.lowRatingCta}
      </button>
    </motion.div>
  );
}