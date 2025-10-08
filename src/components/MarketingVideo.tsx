import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

type MarketingVideoProps = {
  youtubeId: string;
  startAt?: number;
  title?: string;
  variant?: 'inline' | 'modal';
  open?: boolean;              // only for modal variant
  onClose?: () => void;        // only for modal variant
  onOpenRequest?: () => void;  // only for inline variant (open modal outside)
  aspect?: number;             // width/height ratio (default 16/9)
  posterQuality?: 'sd' | 'hd'; // thumbnail quality
  ctaText?: string;            // inline play CTA text
};

const ytSrc = (id: string, startAt = 0) => {
  const p = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    controls: '1',
    playsinline: '1',
    ...(startAt ? { start: String(startAt) } : {}),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
};

const ytPoster = (id: string, q: 'sd'|'hd' = 'hd') =>
  q === 'hd'
    ? `https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export default function MarketingVideo({
  youtubeId,
  startAt = 0,
  title = 'Product demo',
  variant = 'inline',
  open = false,
  onClose,
  onOpenRequest,
  aspect = 16 / 9,
  posterQuality = 'hd',
  ctaText = 'Watch the 60s demo',
}: MarketingVideoProps) {
  if (variant === 'modal') {
    return (
      <VideoModal
        youtubeId={youtubeId}
        startAt={startAt}
        title={title}
        open={open}
        onClose={onClose}
      />
    );
  }
  return (
    <InlineVideo
      youtubeId={youtubeId}
      startAt={startAt}
      title={title}
      aspect={aspect}
      posterQuality={posterQuality}
      ctaText={ctaText}
      onOpenRequest={onOpenRequest}
    />
  );
}

/* ---------- Inline Video (hero alatt beágyazva) ---------- */
function InlineVideo({
  youtubeId,
  startAt,
  title,
  aspect,
  posterQuality,
  ctaText,
  onOpenRequest,
}: {
  youtubeId: string;
  startAt: number;
  title: string;
  aspect: number;
  posterQuality: 'sd'|'hd';
  ctaText: string;
  onOpenRequest?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [loadIframe, setLoadIframe] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Lazy-load iframe when scrolled near OR user clicks
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setLoaded(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paddingTop = `${(1 / aspect) * 100}%`;
  const poster = ytPoster(youtubeId, posterQuality);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div
        ref={wrapperRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-100"
        style={{ paddingTop }}
      >
        {!loadIframe ? (
          <>
            {/* Poster */}
            <img
              src={poster}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
            {/* Play overlay */}
            <button
              onClick={() => setLoadIframe(true)}
              className="absolute inset-0 grid place-items-center focus:outline-none group"
              aria-label="Play video"
            >
              <div className="rounded-full p-4 sm:p-5 bg-white/90 backdrop-blur shadow-xl group-hover:scale-105 transition">
                <svg width="46" height="46" viewBox="0 0 24 24" className="mx-auto">
                  <path fill="#4FC3F7" d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>

            {/* Inline CTA row */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="hidden sm:inline-flex px-2 py-1 rounded-lg text-xs font-semibold bg-white/85 text-gray-800">
                {title}
              </span>
              {onOpenRequest && (
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenRequest(); }}
                  className="ml-auto inline-flex items-center px-3 sm:px-4 py-2 rounded-xl bg-[#4FC3F7] hover:bg-[#1A8FBF] text-white text-sm font-semibold shadow"
                >
                  {ctaText}
                </button>
              )}
            </div>
          </>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={ytSrc(youtubeId, startAt)}
            title={title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Modal Video (brand-consisztens) ---------- */
function VideoModal({
  youtubeId,
  startAt = 0,
  title = 'Quick Start (2 minutes)',
  open,
  onClose,
}: {
  youtubeId: string;
  startAt?: number;
  title?: string;
  open: boolean;
  onClose?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;
  const src = ytSrc(youtubeId, startAt);

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[999] flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onClose?.()}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative w-[calc(100%-2rem)] max-w-3xl rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-white/20"
          style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)' }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Alexandria, sans-serif' }}>
            {title}
          </h3>
          <button
            onClick={() => onClose?.()}
            aria-label="Close"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/60 transition"
          >
            ✕
          </button>
        </div>

        {/* Video */}
        <div className="bg-white">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={src}
              title={title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 py-5 bg-white">
          <button
            onClick={() => onClose?.()}
            className="inline-flex items-center px-7 py-3 rounded-xl text-white font-semibold shadow-lg hover:brightness-110"
            style={{ backgroundColor: '#4FC3F7', fontFamily: 'Alexandria, sans-serif' }}
          >
            Let’s start
          </button>
          <button
            onClick={() => onClose?.()}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            I’ll watch later
          </button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
}
