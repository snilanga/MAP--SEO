import React from 'react';

interface ScoreGaugeProps {
  score: number;
  grade?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  grade,
  size = 'md',
  showLabel = true,
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (val >= 70) return { stroke: '#3b82f6', text: 'text-blue-600', bg: 'bg-blue-50' };
    if (val >= 55) return { stroke: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-50' };
    return { stroke: '#ef4444', text: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const colors = getScoreColor(score);

  const radius = size === 'lg' ? 44 : size === 'md' ? 32 : 22;
  const strokeWidth = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const dim = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={dim} height={dim} className="transform -rotate-90">
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span
            className={`font-black tracking-tight ${colors.text} ${
              size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'
            }`}
          >
            {score}
          </span>
          {grade && size === 'lg' && (
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {grade}
            </span>
          )}
        </div>
      </div>
      {showLabel && (
        <span className="mt-1 text-xs font-medium text-slate-500">
          Score / 100
        </span>
      )}
    </div>
  );
};
