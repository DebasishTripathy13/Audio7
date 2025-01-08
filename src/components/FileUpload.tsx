import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an audio file
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file');
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-medium">Or Upload Audio File</h3>
      </div>
      <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isProcessing ? 'Processing...' : 'Drop audio file here or click to upload'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports WAV, MP3, AAC, FLAC, and OGG
          </p>
        </div>
      </label>
    </div>
  );
}