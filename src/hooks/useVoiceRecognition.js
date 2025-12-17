import { useState, useEffect, useRef, useCallback } from "react";

export function useVoiceRecognition(language, onResult) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);

    // Initialize recognition instance once
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // KEEP LISTENING
        recognition.interimResults = false;
        recognition.lang = language;

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort(); // Cleanup
            }
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }
        };
    }, []); // Run once on mount

    // Update language dynamically if needed without recreating instance (optional optimization)
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }
    }, []);

    const resetSilenceTimer = useCallback(() => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
        }

        // 15-second silence timeout
        silenceTimerRef.current = setTimeout(() => {
            console.log("Silence timeout reached (15s). Stopping recognition.");
            stopListening();
        }, 15000);
    }, [stopListening]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;

        try {
            recognitionRef.current.start();
            setIsListening(true);
            resetSilenceTimer();
            console.log("Voice recognition started");
        } catch (error) {
            console.warn("Recognition already started or error:", error);
        }
    }, [resetSilenceTimer]);

    // Attach event handlers
    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        recognition.onresult = (event) => {
            // Reset silence timer on any speech
            resetSilenceTimer();

            const transcript = event.results[event.results.length - 1][0].transcript;
            if (transcript.trim()) {
                onResult(transcript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                stopListening();
            }
            // Ignore 'no-speech' as it just means silence, we handle that with our own timer if needed
            // But usually we just let it continue unless our silence timer kills it
        };

        recognition.onend = () => {
            // Browser stopped it. Update state.
            // If we didn't explicitly stop it (isListening is true), we might want to restart?
            // But for now, let's trust the control flow from the parent or the toggle.
            // If continuous=true, it shouldn't stop unless we stop it or network error.
            // However, if we are 'speaking', we usually stop it manually.
            console.log("Recognition ended");
        };

    }, [onResult, resetSilenceTimer, stopListening]);

    return { isListening, startListening, stopListening, recognition: recognitionRef.current };
}
