// Simple browser-based voice adapter
export class VoiceAdapter {
  constructor(onTranscription, onResponse) {
    this.onTranscription = onTranscription; // callback when user speaks
    this.onResponse = onResponse;           // callback when agent responds

    this.synth = window.speechSynthesis;
    this.recognition = null;

    // CONFLICT FIX: Removed internal SpeechRecognition to avoid fighting with React hook
    // if ("webkitSpeechRecognition" in window) {
    //   this.recognition = new webkitSpeechRecognition();
    //   this.recognition.continuous = false;
    //   this.recognition.interimResults = false;
    //   this.recognition.lang = "en-US";

    //   this.recognition.onresult = (event) => {
    //     const transcript = event.results[0][0].transcript;
    //     this.onTranscription(transcript);
    //   };

    //   this.recognition.onerror = (event) => {
    //     console.error("Voice recognition error:", event.error);
    //   };
    // } else {
    //   alert("Your browser does not support speech recognition.");
    // }
  }

  startListening() {
    // if (this.recognition) this.recognition.start();
  }

  stopListening() {
    // if (this.recognition) this.recognition.stop();
  }

  speak(text) {
    if (!this.synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    this.synth.speak(utterance);
    if (this.onResponse) this.onResponse(text);
  }
}
