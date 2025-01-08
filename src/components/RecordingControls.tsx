import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function RecordingControls({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
}: RecordingControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={isProcessing}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : isRecording ? (
          <>
            <MicOff className="w-5 h-5" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Start Recording
          </>
        )}
      </button>
    </div>
  );
}