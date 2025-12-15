export function useVoiceRecognition(language, onResult) {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        // You might want to handle 'no-speech' or other errors specifically here
    };

    return recognition;
}
