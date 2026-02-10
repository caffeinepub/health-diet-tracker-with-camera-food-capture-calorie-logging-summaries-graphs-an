import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage } from '../../pages/HelperChatPage';

interface ChatTranscriptProps {
  messages: ChatMessage[];
}

export default function ChatTranscript({ messages }: ChatTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs font-semibold mb-1">Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {message.citations.map((citation, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {citation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
