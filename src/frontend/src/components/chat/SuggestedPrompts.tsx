import { Button } from '@/components/ui/button';
import type { QuestionSuggestion } from '../../backend';

interface SuggestedPromptsProps {
  suggestions: QuestionSuggestion[];
  onSelect: (question: string) => void;
}

export default function SuggestedPrompts({ suggestions, onSelect }: SuggestedPromptsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Suggested questions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion.question)}
            className="text-left h-auto py-2 px-3"
          >
            {suggestion.question}
          </Button>
        ))}
      </div>
    </div>
  );
}
