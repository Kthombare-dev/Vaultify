'use client';

import { Button } from './ui/button';
import { X, Loader2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PdfViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export function PdfViewer({ fileUrl, fileName, onClose }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image' | 'unknown'>('unknown');

  useEffect(() => {
    // Determine file type based on extension or URL
    const extension = fileName.toLowerCase().split('.').pop() || 
                     fileUrl.toLowerCase().split('.').pop() || '';
    
    if (['pdf'].includes(extension)) {
      setFileType('pdf');
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      setFileType('image');
    } else {
      setFileType('unknown');
    }
  }, [fileName, fileUrl]);

  const handleDownload = async () => {
    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(new Blob([blob], { type: contentType || 'application/octet-stream' }));
      
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download the file. Please try again.');
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <Button variant="outline" onClick={handleDownload}>
            Download Instead
          </Button>
        </div>
      );
    }

    switch (fileType) {
      case 'pdf':
        return (
          <object
            data={fileUrl}
            type="application/pdf"
            className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Unable to display the PDF. You can download it instead.');
              setIsLoading(false);
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <p className="text-gray-500 mb-4">Unable to display the PDF directly.</p>
              <Button variant="outline" onClick={handleDownload}>
                Download Instead
              </Button>
            </div>
          </object>
        );

      case 'image':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fileUrl}
              alt={fileName}
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError('Unable to display the image. You can download it instead.');
                setIsLoading(false);
              }}
            />
          </div>
        );

      default:
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <p className="text-gray-500 mb-4">This file type cannot be previewed.</p>
            <Button variant="outline" onClick={handleDownload}>
              Download File
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-[90vw] h-[90vh] max-w-4xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h3 className="text-lg font-semibold truncate pr-4">{fileName}</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex-grow relative bg-gray-100 dark:bg-gray-900">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 