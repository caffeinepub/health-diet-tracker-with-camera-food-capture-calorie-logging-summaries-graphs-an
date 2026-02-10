import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { HealthMetrics, UserProfile } from '@/backend';

interface MaintenanceCaloriesCardProps {
  healthMetrics: HealthMetrics | null;
  todayCalories: number;
  userProfile: UserProfile | null;
}

export default function MaintenanceCaloriesCard({
  healthMetrics,
  todayCalories,
  userProfile,
}: MaintenanceCaloriesCardProps) {
  // Check if required profile fields are missing
  const missingFields: string[] = [];
  if (!userProfile) {
    return null;
  }

  if (!userProfile.heightCm) missingFields.push('height');
  if (!userProfile.age) missingFields.push('age');
  if (!userProfile.sex) missingFields.push('sex');
  if (!userProfile.activityLevel) missingFields.push('activity level');
  if (!userProfile.bodyGoal) missingFields.push('body goal');

  if (missingFields.length > 0 || !healthMetrics) {
    return (
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Maintenance Calories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Complete your profile to see your personalized maintenance calories and BMI.
            </p>
            {missingFields.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Missing: {missingFields.join(', ')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const tdee = Math.round(healthMetrics.tdee);
  const difference = todayCalories - tdee;
  const absDifference = Math.abs(difference);
  
  let status: 'above' | 'below' | 'at' = 'at';
  let statusIcon = Minus;
  let statusColor = 'text-muted-foreground';
  let statusText = 'At Maintenance';

  if (difference > 50) {
    status = 'above';
    statusIcon = TrendingUp;
    statusColor = 'text-orange-600 dark:text-orange-400';
    statusText = 'Above Maintenance';
  } else if (difference < -50) {
    status = 'below';
    statusIcon = TrendingDown;
    statusColor = 'text-blue-600 dark:text-blue-400';
    statusText = 'Below Maintenance';
  }

  const StatusIcon = statusIcon;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Your Maintenance Calories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">TDEE (Maintenance)</div>
            <div className="text-2xl font-bold">{tdee} kcal</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Today's Intake</div>
            <div className="text-2xl font-bold">{Math.round(todayCalories)} kcal</div>
          </div>
        </div>

        <div className="pt-4 border-t border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${statusColor}`} />
              <span className={`font-semibold ${statusColor}`}>{statusText}</span>
            </div>
            <div className="text-sm">
              {status === 'at' ? (
                <span className="text-muted-foreground">Perfect balance!</span>
              ) : (
                <span className={statusColor}>
                  {status === 'above' ? '+' : ''}{Math.round(difference)} kcal
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-primary/20">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">BMI</div>
              <div className="text-lg font-semibold">
                {healthMetrics.bmi.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">{healthMetrics.bmiCategory}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">BMR</div>
              <div className="text-lg font-semibold">{Math.round(healthMetrics.bmr)} kcal</div>
              <div className="text-xs text-muted-foreground">Base metabolic rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
