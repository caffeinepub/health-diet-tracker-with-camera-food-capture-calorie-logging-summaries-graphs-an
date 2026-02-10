import { useState } from 'react';
import type { FoodEntry } from '../../backend';
import { Badge } from '@/components/ui/badge';
import EntryDetailsDialog from './EntryDetailsDialog';

interface TodayEntriesListProps {
  entries: FoodEntry[];
}

export default function TodayEntriesList({ entries }: TodayEntriesListProps) {
  const [selectedEntry, setSelectedEntry] = useState<FoodEntry | null>(null);

  return (
    <>
      <div className="space-y-3">
        {entries.map((entry) => {
          const adjustedCalories = entry.calories * entry.portionSize;
          const confidenceLabel =
            entry.confidenceLevel >= 0.8
              ? 'High'
              : entry.confidenceLevel >= 0.5
              ? 'Medium'
              : 'Low';

          return (
            <button
              key={entry.id.toString()}
              onClick={() => setSelectedEntry(entry)}
              className="w-full text-left p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{entry.foodLabel}</h4>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(adjustedCalories)} kcal
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-xs">
                    {entry.portionSize}x
                  </Badge>
                  <Badge
                    variant={
                      entry.confidenceLevel >= 0.8
                        ? 'default'
                        : entry.confidenceLevel >= 0.5
                        ? 'secondary'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {confidenceLabel}
                  </Badge>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedEntry && (
        <EntryDetailsDialog
          entry={selectedEntry}
          open={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </>
  );
}
