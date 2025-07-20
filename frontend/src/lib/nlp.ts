// A very simple NLP command parser to simulate the "Custom NLP Wrapper"

type Intent = 'SHOW_LOADS' | 'SHOW_NAVIGATION' | 'SHOW_DOCUMENTS' | 'GO_HOME' | 'GREETING' | 'UNKNOWN';

interface ParsedCommand {
  intent: Intent;
  entities: Record<string, string>;
}

export const parseCommand = (text: string): ParsedCommand => {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('load') || lowerText.includes('freight')) {
    return { intent: 'SHOW_LOADS', entities: {} };
  }
  if (lowerText.includes('navigate') || lowerText.includes('navigation') || lowerText.includes('trip')) {
    return { intent: 'SHOW_NAVIGATION', entities: {} };
  }
  if (lowerText.includes('document') || lowerText.includes('receipt') || lowerText.includes('scan')) {
    return { intent: 'SHOW_DOCUMENTS', entities: {} };
  }
  if (lowerText.includes('home') || lowerText.includes('dashboard')) {
    return { intent: 'GO_HOME', entities: {} };
  }
  if (lowerText.includes('hello') || lowerText.includes('hi')) {
    return { intent: 'GREETING', entities: {} };
  }

  return { intent: 'UNKNOWN', entities: {} };
};

