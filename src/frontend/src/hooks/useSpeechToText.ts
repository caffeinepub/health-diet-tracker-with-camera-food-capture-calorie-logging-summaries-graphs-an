import { useState, useRef, useCallback, useEffect } from 'react';

export interface SpeechToTextError {
  type: 'not-supported' | 'permission-denied' | 'no-speech' | 'network' | 'unknown';
  message: string;
}

export interface UseSpeechToTextReturn {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: SpeechToTextError | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechToText(): UseSpeechToTextReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<SpeechToTextError | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript((prev) => {
        const base = prev.trim();
        const newFinal = finalTranscript.trim();
        const combined = base + (base && newFinal ? ' ' : '') + newFinal;
        return combined + (interimTranscript ? ' ' + interimTranscript : '');
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      let errorType: SpeechToTextError['type'] = 'unknown';
      let errorMessage = 'An unknown error occurred';

      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          errorType = 'permission-denied';
          errorMessage = 'Microphone permission denied. Please allow microphone access in your browser settings.';
          break;
        case 'no-speech':
          errorType = 'no-speech';
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'network':
          errorType = 'network';
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setError({ type: errorType, message: errorMessage });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError({
        type: 'not-supported',
        message: 'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
      });
      return;
    }

    setError(null);
    
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError({
        type: 'unknown',
        message: 'Failed to start speech recognition. Please try again.',
      });
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Failed to stop recognition:', err);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
