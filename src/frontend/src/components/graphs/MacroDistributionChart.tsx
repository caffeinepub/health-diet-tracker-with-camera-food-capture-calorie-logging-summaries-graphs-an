import { useMemo } from 'react';
import type { FoodEntry } from '../../backend';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface MacroDistributionChartProps {
  entries: FoodEntry[];
}

export default function MacroDistributionChart({ entries }: MacroDistributionChartProps) {
  const chartData = useMemo(() => {
    const totals = entries.reduce(
      (acc, entry) => ({
        protein: acc.protein + entry.macros.protein * entry.portionSize,
        carbs: acc.carbs + entry.macros.carbs * entry.portionSize,
        fat: acc.fat + entry.macros.fat * entry.portionSize,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    return [
      { name: 'Protein', value: Math.round(totals.protein), color: 'oklch(var(--chart-1))' },
      { name: 'Carbs', value: Math.round(totals.carbs), color: 'oklch(var(--chart-2))' },
      { name: 'Fat', value: Math.round(totals.fat), color: 'oklch(var(--chart-3))' },
    ];
  }, [entries]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No macro data available
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        protein: { label: 'Protein', color: 'oklch(var(--chart-1))' },
        carbs: { label: 'Carbs', color: 'oklch(var(--chart-2))' },
        fat: { label: 'Fat', color: 'oklch(var(--chart-3))' },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}g`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
