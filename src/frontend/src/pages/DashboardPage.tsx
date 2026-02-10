import { useState, useMemo } from 'react';
import { useGetFoodEntries } from '../hooks/useFoodEntries';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useGetCallerHealthMetrics } from '../hooks/useCallerHealthMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Camera, Target, TrendingDown, Activity } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import TodayEntriesList from '../components/entries/TodayEntriesList';
import EmptyEntriesState from '../components/entries/EmptyEntriesState';
import DateRangePicker from '../components/entries/DateRangePicker';
import CaloriesOverTimeChart from '../components/graphs/CaloriesOverTimeChart';
import MacroDistributionChart from '../components/graphs/MacroDistributionChart';
import NutritionBalanceRating from '../components/graphs/NutritionBalanceRating';
import WeeklySummaryCard from '../components/graphs/WeeklySummaryCard';
import MaintenanceCaloriesCard from '../components/dashboard/MaintenanceCaloriesCard';
import BaselineHealthCard from '../components/dashboard/BaselineHealthCard';
import { calculateWeeklySummary } from '../utils/weeklyFeedback';
import { GoalType } from '@/backend';

function getTodayDayNumber(): number {
  const now = new Date();
  return Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
}

function getGoalTypeLabel(goalType: GoalType): string {
  switch (goalType) {
    case GoalType.loseWeight:
      return 'Lose Weight';
    case GoalType.gainWeight:
      return 'Gain Weight';
    case GoalType.gainMuscle:
      return 'Gain Muscle';
    case GoalType.maintain:
      return 'Maintain Weight';
    default:
      return 'Unknown';
  }
}

function getGoalIcon(goalType: GoalType) {
  switch (goalType) {
    case GoalType.loseWeight:
      return TrendingDown;
    case GoalType.gainWeight:
      return TrendingUp;
    case GoalType.gainMuscle:
      return Activity;
    case GoalType.maintain:
      return Target;
    default:
      return Target;
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const today = getTodayDayNumber();
  const [selectedDay, setSelectedDay] = useState<number>(today);
  const [rangeStart, setRangeStart] = useState<number>(today - 6);
  const [rangeEnd, setRangeEnd] = useState<number>(today);

  const { data: userProfile } = useGetCallerUserProfile();
  const { data: healthMetrics } = useGetCallerHealthMetrics();
  const { data: todayEntries = [], isLoading: todayLoading } = useGetFoodEntries(today, today);
  const { data: rangeEntries = [], isLoading: rangeLoading } = useGetFoodEntries(rangeStart, rangeEnd);
  const { data: selectedDayEntries = [] } = useGetFoodEntries(selectedDay, selectedDay);
  
  // Fetch last 7 days for weekly summary
  const weeklyStart = today - 6;
  const { data: weeklyEntries = [] } = useGetFoodEntries(weeklyStart, today);

  const todayTotals = useMemo(() => {
    return todayEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories * entry.portionSize,
        protein: acc.protein + entry.macros.protein * entry.portionSize,
        carbs: acc.carbs + entry.macros.carbs * entry.portionSize,
        fat: acc.fat + entry.macros.fat * entry.portionSize,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [todayEntries]);

  const rangeTotals = useMemo(() => {
    return rangeEntries.reduce(
      (acc, entry) => acc + entry.calories * entry.portionSize,
      0
    );
  }, [rangeEntries]);

  const weeklySummary = useMemo(() => {
    return calculateWeeklySummary(weeklyEntries, userProfile?.bodyGoal);
  }, [weeklyEntries, userProfile?.bodyGoal]);

  const bodyGoal = userProfile?.bodyGoal;
  const GoalIcon = bodyGoal ? getGoalIcon(bodyGoal.goalType) : Target;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your daily nutrition and progress</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate({ to: '/camera' })} size="lg" variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Scan Food
          </Button>
          <Button onClick={() => navigate({ to: '/add-entry' })} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Maintenance Calories Card */}
      <MaintenanceCaloriesCard
        healthMetrics={healthMetrics ?? null}
        todayCalories={todayTotals.calories}
        userProfile={userProfile ?? null}
      />

      {/* Baseline Health Card */}
      <BaselineHealthCard />

      {bodyGoal && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GoalIcon className="w-5 h-5 text-primary" />
              Your Body Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Goal Type</div>
                <div className="text-lg font-semibold">{getGoalTypeLabel(bodyGoal.goalType)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Weight</div>
                <div className="text-lg font-semibold">{bodyGoal.currentWeight} kg</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Target Weight</div>
                <div className="text-lg font-semibold">{bodyGoal.targetWeight} kg</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Weekly Goal</div>
                <div className="text-lg font-semibold">{bodyGoal.weeklyGoalSpeed} kg/week</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary/20">
              <div className="text-sm text-muted-foreground">
                Progress: {Math.abs(bodyGoal.targetWeight - bodyGoal.currentWeight).toFixed(1)} kg to go
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Summary */}
      <WeeklySummaryCard summary={weeklySummary} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Calories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(todayTotals.calories)}</div>
            <p className="text-xs text-muted-foreground">kcal consumed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(todayTotals.protein)}g</div>
            <p className="text-xs text-muted-foreground">today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(todayTotals.carbs)}g</div>
            <p className="text-xs text-muted-foreground">today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(todayTotals.fat)}g</div>
            <p className="text-xs text-muted-foreground">today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            {todayLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : todayEntries.length === 0 ? (
              <EmptyEntriesState />
            ) : (
              <TodayEntriesList entries={todayEntries} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrition Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <NutritionBalanceRating entries={selectedDayEntries} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calorie Trends</CardTitle>
          <DateRangePicker
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onRangeChange={(start, end) => {
              setRangeStart(start);
              setRangeEnd(end);
            }}
          />
        </CardHeader>
        <CardContent>
          {rangeLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <>
              <CaloriesOverTimeChart
                entries={rangeEntries}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                selectedDay={selectedDay}
                onDaySelect={setSelectedDay}
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Period Total: <span className="font-semibold text-foreground">{Math.round(rangeTotals)} kcal</span>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Macro Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <MacroDistributionChart entries={selectedDayEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
