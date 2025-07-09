'use client';

import { useState, useRef, useEffect } from 'react';
import {
  DocumentIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
  description?: string;
  className?: string;
  showPreview?: boolean;
}

export default function PDFViewer({ 
  pdfUrl, 
  title = "PDF Belgesi", 
  description,
  className = "",
  showPreview = true 
}: PDFViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (!showPreview) {
    return (
      <div className={`card-seljuk p-6 ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-20 bg-gradient-to-br from-burgundy-medium to-burgundy-dark rounded-lg flex items-center justify-center shadow-lg">
              <DocumentIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bookmania-bold text-brown-dark truncate">
              {title}
            </h3>
            {description && (
              <p className="text-sm font-bookmania text-brown-light mt-1">
                {description}
              </p>
            )}
            <div className="flex items-center space-x-3 mt-3">
              <button
                onClick={handleDownload}
                className="btn-secondary text-sm"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                İndir
              </button>
              <button
                onClick={handleFullscreen}
                className="btn-primary text-sm"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                Görüntüle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Preview Card */}
      <div className={`card-seljuk overflow-hidden ${className}`}>
        <div className="relative">
          {/* PDF Preview */}
          <div className="aspect-[3/4] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-t-lg overflow-hidden">
            <iframe
              ref={iframeRef}
              src={`${pdfUrl}#page=1&zoom=${zoom}`}
              className="w-full h-full border-0"
              title={title}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-medium"></div>
              </div>
            )}
          </div>

          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleFullscreen}
              className="p-2 bg-brown-dark/80 text-white rounded-lg hover:bg-brown-dark transition-colors duration-300 backdrop-blur-sm"
              title="Tam Ekran"
            >
              <ArrowsPointingOutIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-brown-dark/80 text-white rounded-lg hover:bg-brown-dark transition-colors duration-300 backdrop-blur-sm"
              title="İndir"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="text-lg font-bookmania-bold text-brown-dark mb-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm font-bookmania text-brown-light mb-3">
              {description}
            </p>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-1 text-brown-light hover:text-teal-medium transition-colors duration-300"
                title="Uzaklaştır"
              >
                <MagnifyingGlassMinusIcon className="h-4 w-4" />
              </button>
              <span className="text-xs font-bookmania text-brown-light">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 text-brown-light hover:text-teal-medium transition-colors duration-300"
                title="Yakınlaştır"
              >
                <MagnifyingGlassPlusIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 text-brown-light hover:text-teal-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <span className="text-xs font-bookmania text-brown-light">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-1 text-brown-light hover:text-teal-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-brown-dark bg-opacity-95 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brown-dark to-burgundy-dark">
            <h2 className="text-lg font-bookmania-bold text-white">
              {title}
            </h2>
            <div className="flex items-center space-x-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-white hover:text-teal-light transition-colors duration-300"
                >
                  <MagnifyingGlassMinusIcon className="h-5 w-5" />
                </button>
                <span className="text-sm font-bookmania text-white min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-white hover:text-teal-light transition-colors duration-300"
                >
                  <MagnifyingGlassPlusIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="p-2 text-white hover:text-teal-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-sm font-bookmania text-white min-w-[4rem] text-center">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 text-white hover:text-teal-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="p-2 text-white hover:text-teal-light transition-colors duration-300"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>

              {/* Close */}
              <button
                onClick={handleCloseFullscreen}
                className="p-2 text-white hover:text-burgundy-light transition-colors duration-300"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* PDF Content */}
          <div className="flex-1 p-4">
            <iframe
              src={`${pdfUrl}#page=${currentPage}&zoom=${zoom}`}
              className="w-full h-full border-0 rounded-lg shadow-2xl"
              title={title}
            />
          </div>
        </div>
      )}
    </>
  );
}
