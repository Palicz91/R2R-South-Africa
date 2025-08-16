// src/components/ScrollProgressBar.tsx
import { motion, useScroll } from 'framer-motion';

export default function ScrollProgressBar() {
  // Framer gives us a normalized 0 → 1 value
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 h-[2px] bg-pink-600 z-50"
      style={{
        scaleX: scrollYProgress,      // stretch bar as we scroll
        transformOrigin: '0 0',       // anchor scaling to the left
      }}
    />
  );
}
