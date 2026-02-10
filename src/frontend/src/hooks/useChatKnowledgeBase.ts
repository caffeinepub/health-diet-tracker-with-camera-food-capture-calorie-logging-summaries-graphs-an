import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { QuestionSuggestion } from '../backend';

export function useChatKnowledgeBase() {
  const { actor, isFetching: actorFetching } = useActor();

  const { data: suggestions = [] } = useQuery<QuestionSuggestion[]>({
    queryKey: ['suggestedQuestions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSuggestedQuestions();
    },
    enabled: !!actor && !actorFetching,
  });

  const findAnswer = (question: string): QuestionSuggestion => {
    const normalizedQuestion = question.toLowerCase().trim();

    const exactMatch = suggestions.find(
      (s) => s.question.toLowerCase() === normalizedQuestion
    );
    if (exactMatch) return exactMatch;

    const partialMatch = suggestions.find((s) =>
      s.question.toLowerCase().includes(normalizedQuestion) ||
      normalizedQuestion.includes(s.question.toLowerCase())
    );
    if (partialMatch) return partialMatch;

    return {
      question,
      answer:
        "I don't have a specific answer for that question yet. Try asking about calorie estimation, portion sizes, or macro tracking. You can also check the suggested questions for topics I can help with.",
      citations: [],
      relatedQuestions: suggestions.slice(0, 3).map((s) => s.question),
    };
  };

  return {
    suggestions,
    findAnswer,
  };
}
