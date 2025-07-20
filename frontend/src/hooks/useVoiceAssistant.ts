import { useState, useEffect, useRef, useCallback } from 'react';
import { Database } from 'sql.js';
import { parseCommand } from '../lib/nlp';
import { speak } from '../lib/speak';

interface UseVoiceAssistantProps {
  db: Database | null;
  setCurrentView: (view: 'dashboard' | 'navigation' | 'loads' | 'documents') => void;
}

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechSupported = !!SpeechRecognition;

export const useVoiceAssistant = ({ db, setCurrentView }: UseVoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState("System ready.");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const processVoiceCommand = useCallback(async (command: string) => {
    const parsed = parseCommand(command);
    console.log('Parsed command:', parsed);

    let response = "I didn't understand that. Please try again.";

    switch (parsed.intent) {
      case 'GREETING':
        response = "Hello! How can I assist you with your logistics today?";
        break;
      case 'SHOW_LOADS':
        response = "Showing available loads.";
        setCurrentView('loads');
        break;
      case 'SHOW_NAVIGATION':
        response = "Bringing up the navigation view.";
        setCurrentView('navigation');
        break;
      case 'SHOW_DOCUMENTS':
        response = "Opening the document manager.";
        setCurrentView('documents');
        break;
      case 'GO_HOME':
        response = "Returning to the dashboard.";
        setCurrentView('dashboard');
        break;
      case 'UNKNOWN':
      default:
        response = `I'm not sure how to handle "${command}". You can say "show loads" or "show navigation".`;
        break;
    }

    setAssistantResponse(response);
    speak(response);
  }, [setCurrentView]);

  useEffect(() => {
    if (!isSpeechSupported) {
      setAssistantResponse("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setTranscript(currentTranscript);

      // Check for final result
      if (event.results[event.results.length - 1].isFinal) {
        processVoiceCommand(currentTranscript.trim().toLowerCase());
        stopListening();
      }
    };

    recognitionRef.current = recognition;
  }, [processVoiceCommand]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, assistantResponse, setAssistantResponse };
};

