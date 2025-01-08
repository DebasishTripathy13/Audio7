import React, { useState, useCallback, useRef } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { RecordingControls } from './components/RecordingControls';
import { FileUpload } from './components/FileUpload';
import { SummaryDisplay } from './components/SummaryDisplay';
import { AudioRecorder } from './lib/recorder';
import { generateSummaryFromAudio } from './lib/gemini';
import type { Summary } from './types';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const summaryText = await generateSummaryFromAudio(audioBlob);
      setSummary({
        text: summaryText,
        timestamp: new Date().toLocaleString(),
        references: []
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = useCallback(() => {
    try {
      recorderRef.current = new AudioRecorder(processAudio);
      recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Audio recording is not supported in this browser.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (!recorderRef.current) return;
    setIsRecording(false);
    recorderRef.current.stop();
  }, []);

  const handleFileSelect = async (file: File) => {
    processAudio(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">SmartSummarize</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Record or Upload Audio</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Record Live Audio</h3>
                <p className="text-gray-600 mb-4">
                  Click the button below to start recording your conversation. 
                  SmartSummarize will analyze the audio directly for better accuracy.
                </p>
                
                <RecordingControls
                  isRecording={isRecording}
                  isProcessing={isProcessing}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                />
              </div>

              <FileUpload 
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {(summary || isProcessing) && (
            <div className="space-y-4">
              <SummaryDisplay summary={summary} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;