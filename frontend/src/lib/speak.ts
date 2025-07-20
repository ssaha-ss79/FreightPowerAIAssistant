// Text-to-Speech wrapper

export const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    // Stop any currently speaking utterances
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Text-to-Speech is not supported in this browser.");
  }
};

