import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  initialRating = 5,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);

  useEffect(() => {
    setSelectedRating(initialRating);
  }, [initialRating]); // 🔁 Szinkronizáljuk ha kívülről frissül

  const starSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const starSize = starSizes[size];

  const handleClick = (value: number) => {
    if (readonly) return;
    setSelectedRating(value);
    onChange?.(value);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readonly && setHoverRating(value)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${
            readonly ? 'cursor-default' : 'cursor-pointer'
          } transition-transform hover:scale-110 focus:outline-none`}
          disabled={readonly}
        >
          <Star
            className={`${starSize} ${
              (hoverRating || selectedRating) >= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
