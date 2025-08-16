import { AlertTriangle } from 'lucide-react';

interface UsageProgressBarProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
}

export default function UsageProgressBar({ 
  label, 
  current, 
  max, 
  unit 
}: UsageProgressBarProps) {
  const percentage = (current / max) * 100;
  const isWarning = percentage >= 80 && percentage < 95;
  const isDanger = percentage >= 95;
  const isLimitReached = current >= max;

  // Determine color based on usage percentage
  const barColor = isDanger 
    ? 'bg-red-500' 
    : isWarning 
      ? 'bg-yellow-500' 
      : 'bg-green-500';

  // Determine text color for percentage
  const textColor = isDanger 
    ? 'text-red-700' 
    : isWarning 
      ? 'text-yellow-700' 
      : 'text-green-700';

  return (
    <div className="space-y-2">
      {/* Label and count */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-medium ${textColor}`}>
          {current} / {max}{unit ? ` ${unit}` : ''}
        </span>
      </div>

      {/* Progress bar container */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Warning message */}
      {isLimitReached && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="w-4 h-4" />
          <span>Limit reached — upgrade to unlock more</span>
        </div>
      )}
    </div>
  );
}