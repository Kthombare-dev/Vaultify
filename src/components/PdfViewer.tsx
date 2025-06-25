'use client';

import { Button } from './ui/button';
import { X, Loader2, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@/lib/hooks';

interface PdfViewerProps {
  fileUrl: string;
  fileName: string;
  onClose: () => void;
}

export function PdfViewer({ fileUrl, fileName, onClose }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'image' | 'unknown'>('unknown');
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3)); // Max zoom 300%
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 50%
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

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

    const contentStyle = {
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: 'center center',
      transition: 'transform 0.2s ease-out'
    };

    switch (fileType) {
      case 'pdf':
        return (
          <div 
            ref={contentRef}
            className="w-full h-full overflow-auto relative"
            style={{
              touchAction: isMobile ? 'manipulation' : 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div 
              className="min-h-full min-w-full flex items-center justify-center p-4"
              style={{
                minHeight: `${100 * scale}%`,
                minWidth: `${100 * scale}%`
              }}
            >
              <object
                data={fileUrl}
                type="application/pdf"
                className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                style={contentStyle}
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
            </div>
          </div>
        );

      case 'image':
        return (
          <div 
            ref={contentRef}
            className="w-full h-full overflow-auto relative"
            style={{
              touchAction: isMobile ? 'manipulation' : 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div 
              className="min-h-full min-w-full flex items-center justify-center p-4"
              style={{
                minHeight: `${100 * scale}%`,
                minWidth: `${100 * scale}%`
              }}
            >
              <img
                src={fileUrl}
                alt={fileName}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                style={contentStyle}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setError('Unable to display the image. You can download it instead.');
                  setIsLoading(false);
                }}
              />
            </div>
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
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-[90vw] h-[90vh] max-w-4xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold truncate max-w-[50%]">{fileName}</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleRotate} className="shrink-0">
              <RotateCw className="h-5 w-5" />
            </Button>
            {!isMobile && (
              <>
                <Button variant="outline" size="icon" onClick={handleZoomOut} className="shrink-0">
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomIn} className="shrink-0">
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </>
            )}
            <Button variant="outline" size="icon" onClick={handleDownload} className="shrink-0">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {renderContent()}
        </div>
        {isMobile && (
          <div className="p-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t">
            Pinch to zoom • Rotate to change view
          </div>
        )}
      </div>
    </div>
  );
} 