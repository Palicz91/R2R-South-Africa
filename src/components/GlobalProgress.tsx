import { useEffect, useState } from 'react';

export default function GlobalProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop || document.body.scrollTop);
      const height = h.scrollHeight - h.clientHeight;
      setWidth((scrolled / height) * 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[4px] z-50 bg-gradient-to-r from-pink-500 to-indigo-500"
      style={{ width: `${width}%` }}
    />
  );
}
