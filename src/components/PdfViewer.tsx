'use client';

import { Button } from './ui/button';
import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PdfViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export function PdfViewer({ fileUrl, fileName, onClose }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-[90vw] h-[90vh] max-w-4xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h3 className="text-lg font-semibold truncate pr-4">{fileName}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-grow relative bg-gray-100 dark:bg-gray-900">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <iframe
            src={viewerUrl}
            className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            title="PDF Viewer"
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
      </div>
    </div>
  );
} 