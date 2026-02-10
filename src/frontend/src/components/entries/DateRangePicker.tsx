import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
  rangeStart: number;
  rangeEnd: number;
  onRangeChange: (start: number, end: number) => void;
}

export default function DateRangePicker({ rangeStart, rangeEnd, onRangeChange }: DateRangePickerProps) {
  const rangeDays = rangeEnd - rangeStart + 1;

  const handlePrevious = () => {
    onRangeChange(rangeStart - rangeDays, rangeEnd - rangeDays);
  };

  const handleNext = () => {
    onRangeChange(rangeStart + rangeDays, rangeEnd + rangeDays);
  };

  const formatDate = (dayNumber: number) => {
    const date = new Date(dayNumber * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm font-medium min-w-[140px] text-center">
        {formatDate(rangeStart)} - {formatDate(rangeEnd)}
      </span>
      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
