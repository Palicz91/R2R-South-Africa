// src/components/TestimonialsCarouselRepeat.tsx
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🔧 EZT cseréld:
import useTranslation from '../hooks/useTranslationLandingB'; 
// (ne a sima useTranslation-t használd itt)

interface Testimonial {
  review: string;
  name: string;
  avatar: string;
  rating: number; // 1-5
}

export default function TestimonialsCarouselRepeat() {
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();

  // 🔒 Fallback: ha valamiért nincs testimonialsRepeat, essünk vissza a testimonials-ra
  const tr =
    (t as any)?.testimonialsRepeat ??
    (t as any)?.testimonials ?? {
      review1: '',
      review2: '',
      review3: '',
      name1: '',
      name2: '',
      name3: ''
    };

  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        review: tr.review1,
        name: tr.name1,
        avatar:
          'https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/koloni.png',
        rating: 5
      },
      {
        review: tr.review2,
        name: tr.name2,
        avatar:
          'https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/balibabes.png',
        rating: 5
      },
      {
        review: tr.review3,
        name: tr.name3,
        avatar:
          'https://bnumwujvaribzfexpmmc.supabase.co/functions/v1/photos/yousuite.png',
        rating: 5
      }
    ],
    [tr]
  );

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  // Ha minden üres fallback lett volna (ritka), ne rendereljük a karusszelt
  if (!testimonials.some(t => t.review)) return null;

  return (
    <div className="relative max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.45 }}
          className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center"
        >
          <div className="flex mb-4">
            {Array.from({ length: testimonials[index].rating }).map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.944a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.286 3.944c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.176 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.944a1 1 0 00-.364-1.118L2.074 9.371c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.95-.69l1.289-3.944z" />
              </svg>
            ))}
          </div>
          <p className="text-lg text-gray-700 mb-6 max-w-xl">"{testimonials[index].review}"</p>
          <div className="flex items-center gap-3">
            <img
              src={testimonials[index].avatar}
              alt={testimonials[index].name}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
            />
            <span className="font-semibold text-gray-900">{testimonials[index].name}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
