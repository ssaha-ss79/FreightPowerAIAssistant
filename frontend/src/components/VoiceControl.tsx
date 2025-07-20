import { Mic, MicOff, Bot } from 'lucide-react';

interface VoiceControlProps {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  assistantResponse: string;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  startListening,
  stopListening,
  transcript,
  assistantResponse,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-grow text-white">
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-5 h-5 text-brand-accent" />
            <p className="font-semibold">Assistant:</p>
          </div>
          <p className="text-lg italic">{assistantResponse}</p>
          {isListening && (
            <p className="text-sm text-gray-400 mt-1">Your command: "{transcript}"</p>
          )}
        </div>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`
            p-4 rounded-full transition-all duration-300 ease-in-out
            ${isListening ? 'bg-red-500 animate-pulse' : 'bg-brand-accent'}
            text-white shadow-lg hover:scale-110
          `}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceControl;

