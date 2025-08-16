import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useTranslation, type Language } from '../lib/translations';

interface PrizeSegment {
  label: string;
  probability: number;
  starred: boolean;
  coupon_code?: string; // Add coupon_code field
}

interface WheelOfFortuneProps {
  prizes: PrizeSegment[];
  wheelId: string;
  userEmail?: string;
  onComplete?: (prize: string) => void;
  language?: Language;
  noGoogleReview?: boolean; // New prop
}

export default function WheelOfFortune({ 
  prizes, 
  wheelId, 
  userEmail, 
  onComplete,
  language = 'en',
  noGoogleReview = false
}: WheelOfFortuneProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [scaledPrizes, setScaledPrizes] = useState<{ text: string; scale: number; starred: boolean }[]>([]);
  const wheelControls = useAnimation();
  const lastRotation = useRef(rotation);
  const segmentAngle = 360 / prizes.length;

  // Get translations
  const t = useTranslation(language);

  const MAX_CHARS = 20;
  const BASE_FONT_SIZE = 6;
  const MIN_SCALE = 0.5;

  const colors = [
    '#4FC3F7', '#FBC02D', '#7581F8', '#F5F5F5',
    '#FFFB93', '#B1FFF1', '#F87575', '#B1B1B6',
  ];

  useEffect(() => {
    const processed = prizes.map(prize => {
      let text = (prize?.label || '').trim();
      if (text.length > MAX_CHARS) text = text.substring(0, MAX_CHARS - 3) + '...';
      const scale = Math.max(MIN_SCALE, 1 - (text.length / MAX_CHARS) * 0.3);
      return { text, scale, starred: prize?.starred || false };
    });
    setScaledPrizes(processed);
  }, [prizes]);

  const generateRewardCode = async (prize: string) => {
    try {
      const code = `REW-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const { data: project } = await supabase.from('wheel_projects').select('expires_in_days').eq('id', wheelId).single();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (project?.expires_in_days || 30));
      
      // Find the prize object to get the coupon_code if it exists
      const prizeObject = prizes.find(p => p.label === prize);
      
      const { error } = await supabase.from('reward_codes').insert({
        user_email: userEmail,
        wheel_project_id: wheelId,
        prize,
        code,
        expires_at: expiresAt.toISOString(),
      });
      
      if (error) throw error;
      
      
      return code;
    } catch (err) {
      console.error('Error generating reward code:', err);
      return null;
    }
  };

  const spin = async () => {
    if (spinning) return;

    setWinningIndex(null);
    setSpinning(true);
    

    const totalWeight = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    const random = Math.random() * totalWeight;
    let cumulative = 0;
    let selectedIndex = 0;

    for (let i = 0; i < prizes.length; i++) {
      cumulative += prizes[i].probability;
      if (random < cumulative) {
        selectedIndex = i;
        break;
      }
    }

    const targetAngle = selectedIndex * segmentAngle + segmentAngle / 2;
    const currentRotation = lastRotation.current % 360;
    const relativeAngle = (360 - targetAngle + currentRotation) % 360;
    const spins = 5;
    const finalAngle = spins * 360 + relativeAngle - 180;

    const newRotation = lastRotation.current + finalAngle;
    lastRotation.current = newRotation;
    setRotation(newRotation);

    await wheelControls.start({
      rotate: newRotation,
      transition: { duration: 4, ease: [0.32, 0, 0.67, 1] }
    });

    setWinningIndex(selectedIndex);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const prize = prizes[selectedIndex].label;
    
    // Modified logic to check for noGoogleReview
    if (userEmail && !noGoogleReview) {
      await generateRewardCode(prize);
    }


    onComplete?.(prize);
    setSpinning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[320px] h-[320px]">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[32px] border-l-transparent border-r-transparent border-t-[#4FC3F7] z-20 filter drop-shadow-[0_0_8px_rgba(79,195,247,0.8)]" />
        <motion.div
          className="w-full h-full rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)] overflow-hidden relative filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          animate={wheelControls}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-90">
            {scaledPrizes.map((prize, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = startAngle + segmentAngle;
              const largeArcFlag = segmentAngle <= 180 ? "0" : "1";
              const startX = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
              const startY = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
              const endX = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
              const endY = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
              const isWinning = winningIndex === index;
              return (
                <g key={index}>
                  <path
                    d={`M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                    fill={colors[index % colors.length]}
                    stroke={isWinning ? "#FFD700" : prize.starred ? "#FFD700" : "#1A237E"}
                    strokeWidth={isWinning ? "2" : prize.starred ? "1.5" : "0.5"}
                    className={`filter ${isWinning ? 'drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]' : prize.starred ? 'drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : 'drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]'}`}
                  />
                  <text
  x="50"
  y="50"
  fontSize={BASE_FONT_SIZE * prize.scale * (isWinning ? 1.3 : prize.starred ? 1.2 : 1)}
  fontWeight="bold"
  fontFamily="Montserrat"
  textAnchor="middle"
  transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
  dy="2"
  className={`filter ${isWinning ? 'drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]' : prize.starred ? 'drop-shadow-[0_0_4px_rgba(255,215,0,0.8)]' : 'drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]'}`}
>
  <tspan
    x="80"
    textAnchor="middle"
    fill={isWinning ? "#FFD700" : prize.starred ? "#FFD700" : "#263238"}
  >
    {prize.text}
  </tspan>
</text>

                </g>
              );
            })}
            <circle cx="50" cy="50" r="4" fill="#000" stroke="#fff" strokeWidth="1" className="filter drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
          </svg>
        </motion.div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-10 bg-[#4FC3F7] filter drop-shadow-[0_0_8px_rgba(79,195,247,0.8)]" />
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#4FC3F7] border-4 border-white shadow-md filter drop-shadow-[0_0_8px_rgba(79,195,247,0.8)]" />
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className={`mt-6 px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-200 relative ${spinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4FC3F7] hover:bg-[#4FC3F7] hover:scale-105 active:scale-95'} ${!spinning && 'filter drop-shadow-[0_0_8px_rgba(79,195,247,0.5)]'}`}
      >
        {spinning ? t.spinning : t.spinWheel}
      </button>
    </div>
  );
}