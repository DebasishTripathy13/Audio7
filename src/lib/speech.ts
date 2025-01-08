export class SpeechRecorder {
  private recognition: SpeechRecognition;
  private transcription: string = '';
  private onTranscriptionUpdate: (text: string) => void;

  constructor(onTranscriptionUpdate: (text: string) => void) {
    this.onTranscriptionUpdate = onTranscriptionUpdate;

    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Speech recognition is not supported in this browser.');
    }

    this.recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      this.transcription = finalTranscript;
      this.onTranscriptionUpdate(this.transcription);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  start() {
    this.transcription = '';
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
    return this.transcription;
  }
}