import { useMemo } from 'react';
import type { FoodEntry } from '../../backend';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface CaloriesOverTimeChartProps {
  entries: FoodEntry[];
  rangeStart: number;
  rangeEnd: number;
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

export default function CaloriesOverTimeChart({
  entries,
  rangeStart,
  rangeEnd,
  selectedDay,
  onDaySelect,
}: CaloriesOverTimeChartProps) {
  const chartData = useMemo(() => {
    const dayMap = new Map<number, number>();

    for (let day = rangeStart; day <= rangeEnd; day++) {
      dayMap.set(day, 0);
    }

    entries.forEach((entry) => {
      const entryDay = Number(entry.day);
      const current = dayMap.get(entryDay) || 0;
      dayMap.set(entryDay, current + entry.calories * entry.portionSize);
    });

    return Array.from(dayMap.entries())
      .map(([day, calories]) => ({
        day,
        calories: Math.round(calories),
        date: new Date(day * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      }))
      .sort((a, b) => a.day - b.day);
  }, [entries, rangeStart, rangeEnd]);

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No data available for this period
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        calories: {
          label: 'Calories',
          color: 'oklch(var(--chart-1))',
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} onClick={(data) => data?.activeLabel && onDaySelect(chartData[data.activeTooltipIndex || 0].day)}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            className="text-xs"
            tick={{ fill: 'oklch(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'oklch(var(--muted-foreground))' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="calories"
            stroke="oklch(var(--chart-1))"
            strokeWidth={2}
            dot={{ fill: 'oklch(var(--chart-1))', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
