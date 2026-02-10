import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Calendar, Utensils } from 'lucide-react';
import WeeklyRatingScale from './WeeklyRatingScale';
import type { WeeklySummary } from '../../utils/weeklyFeedback';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

export default function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  if (summary.totalEntries === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Summary (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Utensils className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">{summary.feedback}</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {summary.suggestions.map((suggestion, i) => (
                <li key={i}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Weekly Summary (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating */}
        <div className="flex flex-col items-center">
          <WeeklyRatingScale score={summary.score} />
        </div>

        <Separator />

        {/* Feedback */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Feedback</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary.feedback}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Days Logged
            </div>
            <div className="text-lg font-semibold">{summary.daysWithEntries}/7</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Avg Calories</div>
            <div className="text-lg font-semibold">{Math.round(summary.avgCalories)} kcal</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Avg Protein</div>
            <div className="text-lg font-semibold">{Math.round(summary.avgProtein)}g</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Entries</div>
            <div className="text-lg font-semibold">{summary.totalEntries}</div>
          </div>
        </div>

        <Separator />

        {/* Macros Breakdown */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Weekly Totals</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Protein</div>
              <div className="font-semibold">{Math.round(summary.totalProtein)}g</div>
            </div>
            <div>
              <div className="text-muted-foreground">Carbs</div>
              <div className="font-semibold">{Math.round(summary.totalCarbs)}g</div>
            </div>
            <div>
              <div className="text-muted-foreground">Fat</div>
              <div className="font-semibold">{Math.round(summary.totalFat)}g</div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {summary.suggestions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Suggestions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {summary.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
