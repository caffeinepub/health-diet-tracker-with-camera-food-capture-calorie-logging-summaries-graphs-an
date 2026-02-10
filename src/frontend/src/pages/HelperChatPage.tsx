import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useChatKnowledgeBase } from '../hooks/useChatKnowledgeBase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import SuggestedPrompts from '../components/chat/SuggestedPrompts';
import ChatTranscript from '../components/chat/ChatTranscript';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
  relatedQuestions?: string[];
}

export default function HelperChatPage() {
  const navigate = useNavigate();
  const { suggestions, findAnswer } = useChatKnowledgeBase();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = (question: string) => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const answer = findAnswer(question);
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer.answer,
      timestamp: new Date(),
      citations: answer.citations,
      relatedQuestions: answer.relatedQuestions,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 300);

    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition Helper</h1>
          <p className="text-muted-foreground">Get answers to your nutrition questions</p>
        </div>
      </div>

      <Card className="min-h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Chat Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-8">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">How can I help you today?</h3>
                <p className="text-sm text-muted-foreground">
                  Ask me anything about nutrition, calories, or portion sizes
                </p>
              </div>
              <SuggestedPrompts
                suggestions={suggestions}
                onSelect={handleSendMessage}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <ChatTranscript messages={messages} />
              {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                <div className="mt-4">
                  <SuggestedPrompts
                    suggestions={suggestions}
                    onSelect={handleSendMessage}
                  />
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
