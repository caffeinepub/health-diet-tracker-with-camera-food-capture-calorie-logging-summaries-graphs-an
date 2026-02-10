import { Star } from 'lucide-react';

interface WeeklyRatingScaleProps {
  score: number; // 1-10
}

export default function WeeklyRatingScale({ score }: WeeklyRatingScaleProps) {
  const clampedScore = Math.max(1, Math.min(10, score));
  
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1">
        {[...Array(10)].map((_, i) => {
          const position = i + 1;
          const isFilled = position <= clampedScore;
          
          return (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isFilled
                  ? clampedScore >= 8
                    ? 'bg-success text-success-foreground'
                    : clampedScore >= 6
                    ? 'bg-primary text-primary-foreground'
                    : clampedScore >= 4
                    ? 'bg-warning text-warning-foreground'
                    : 'bg-destructive text-destructive-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {position}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2">
        <Star
          className={`w-6 h-6 ${
            clampedScore >= 8
              ? 'fill-success text-success'
              : clampedScore >= 6
              ? 'fill-primary text-primary'
              : clampedScore >= 4
              ? 'fill-warning text-warning'
              : 'fill-destructive text-destructive'
          }`}
        />
        <span className="text-2xl font-bold">
          {clampedScore}/10
        </span>
      </div>
    </div>
  );
}
