export function speak(text, language, onEnd) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
            if (onEnd) onEnd();
            resolve();
        };

        utterance.onerror = () => {
            if (onEnd) onEnd();
            resolve();
        };

        // Only cancel if actively speaking to avoid aggressive context resets
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        window.speechSynthesis.speak(utterance);
    });
}
