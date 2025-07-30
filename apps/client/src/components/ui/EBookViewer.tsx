'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, BookOpen } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  // Use local worker file to avoid CORS issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

interface EBookViewerProps {
  pdfUrl: string;
  title: string;
  onClose?: () => void;
}

interface PageData {
  canvas: HTMLCanvasElement;
  pageNumber: number;
}

export default function EBookViewer({ pdfUrl, title, onClose }: EBookViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [renderedPages, setRenderedPages] = useState<Map<number, PageData>>(new Map());
  const [zoom, setZoom] = useState(1);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPageRef = useRef<HTMLDivElement>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);

  // Load PDF document
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        
        // Pre-render first few pages
        await renderInitialPages(pdfDoc);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setIsLoading(false);
      }
    };

    if (pdfUrl) {
      loadPDF();
    }
  }, [pdfUrl]);

  // Render initial pages for smooth experience
  const renderInitialPages = async (pdfDoc: pdfjsLib.PDFDocumentProxy) => {
    const pagesToRender = Math.min(6, pdfDoc.numPages); // Render first 6 pages
    const newRenderedPages = new Map<number, PageData>();

    for (let i = 1; i <= pagesToRender; i++) {
      try {
        const canvas = await renderPage(pdfDoc, i);
        if (canvas) {
          newRenderedPages.set(i, { canvas, pageNumber: i });
        }
      } catch (error) {
        console.error(`Error rendering page ${i}:`, error);
      }
    }

    setRenderedPages(newRenderedPages);
  };

  // Render a single page
  const renderPage = useCallback(async (pdfDoc: pdfjsLib.PDFDocumentProxy, pageNum: number): Promise<HTMLCanvasElement | null> => {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 * zoom });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return null;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      return canvas;
    } catch (error) {
      console.error(`Error rendering page ${pageNum}:`, error);
      return null;
    }
  }, [zoom]);

  // Pre-render nearby pages for smooth navigation
  const preRenderPages = useCallback(async () => {
    if (!pdf) return;

    const pagesToPreRender = [];
    const range = 2; // Pre-render 2 pages before and after

    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range + 1); i++) {
      if (!renderedPages.has(i)) {
        pagesToPreRender.push(i);
      }
    }

    const newPages = new Map(renderedPages);
    
    for (const pageNum of pagesToPreRender) {
      try {
        const canvas = await renderPage(pdf, pageNum);
        if (canvas) {
          newPages.set(pageNum, { canvas, pageNumber: pageNum });
        }
      } catch (error) {
        console.error(`Error pre-rendering page ${pageNum}:`, error);
      }
    }

    setRenderedPages(newPages);
  }, [pdf, currentPage, totalPages, renderedPages, renderPage]);

  // Pre-render pages when current page changes
  useEffect(() => {
    if (pdf && !isLoading) {
      preRenderPages();
    }
  }, [currentPage, pdf, isLoading, preRenderPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      
      setTimeout(() => {
        setCurrentPage(prev => prev + 2);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 600);
    }
  }, [currentPage, totalPages, isFlipping]);

  const prevPage = useCallback(() => {
    if (currentPage > 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      
      setTimeout(() => {
        setCurrentPage(prev => Math.max(1, prev - 2));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 600);
    }
  }, [currentPage, isFlipping]);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setZoom(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getPageCanvas = (pageNum: number): HTMLCanvasElement | null => {
    const pageData = renderedPages.get(pageNum);
    return pageData ? pageData.canvas : null;
  };

  const leftPageNum = currentPage;
  const rightPageNum = currentPage + 1;
  const leftCanvas = getPageCanvas(leftPageNum);
  const rightCanvas = getPageCanvas(rightPageNum);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">PDF yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-gray-900 flex items-center justify-center' 
          : 'max-w-6xl my-8'
      }`}
    >
      {/* Book Container */}
      <div className={`relative ${isFullscreen ? 'scale-95' : ''} transition-transform duration-300`}>
        <div className="relative" style={{ perspective: '2000px' }}>
          {/* Book Shadow */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full h-8 bg-black opacity-10 rounded-full blur-md scale-90"></div>
          
          <div 
            className={`relative book-container transition-transform duration-600 ease-in-out ${
              isFlipping ? `flipping-${flipDirection}` : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `scale(${zoom})`,
            }}
          >
            {/* Left Page */}
            <div 
              ref={leftPageRef}
              className={`page left-page ${isFlipping && flipDirection === 'prev' ? 'flipping' : ''}`}
            >
              <div className="page-content bg-white shadow-2xl rounded-l-xl border-r border-gray-300 overflow-hidden">
                {leftCanvas ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <div 
                      className="canvas-container"
                      dangerouslySetInnerHTML={{
                        __html: `<canvas width="${leftCanvas.width}" height="${leftCanvas.height}" style="max-width: 100%; max-height: 100%; object-fit: contain;"></canvas>`
                      }}
                      ref={(el) => {
                        if (el && leftCanvas) {
                          const canvas = el.querySelector('canvas');
                          if (canvas) {
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                              ctx.drawImage(leftCanvas, 0, 0);
                            }
                          }
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Sayfa {leftPageNum}</p>
                    </div>
                  </div>
                )}
                
                {/* Page Number */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  {leftPageNum}
                </div>
              </div>
            </div>

            {/* Right Page */}
            <div 
              ref={rightPageRef}
              className={`page right-page ${isFlipping && flipDirection === 'next' ? 'flipping' : ''}`}
            >
              <div className="page-content bg-white shadow-2xl rounded-r-xl border-l border-gray-300 overflow-hidden">
                {rightPageNum <= totalPages ? (
                  rightCanvas ? (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <div 
                        className="canvas-container"
                        dangerouslySetInnerHTML={{
                          __html: `<canvas width="${rightCanvas.width}" height="${rightCanvas.height}" style="max-width: 100%; max-height: 100%; object-fit: contain;"></canvas>`
                        }}
                        ref={(el) => {
                          if (el && rightCanvas) {
                            const canvas = el.querySelector('canvas');
                            if (canvas) {
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.drawImage(rightCanvas, 0, 0);
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                        <p>Yükleniyor...</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Son sayfa</p>
                    </div>
                  </div>
                )}
                
                {/* Page Number */}
                {rightPageNum <= totalPages && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    {rightPageNum}
                  </div>
                )}
              </div>
            </div>

            {/* Book Spine */}
            <div className="book-spine absolute top-0 left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-gray-400 via-gray-600 to-gray-400 shadow-lg z-10"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl">
        <button
          onClick={prevPage}
          disabled={currentPage <= 1 || isFlipping}
          className="p-2 text-white hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Önceki sayfa"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={zoomOut}
          disabled={zoom <= 0.5}
          className="p-2 text-white hover:text-blue-300 disabled:opacity-30 transition-colors"
          title="Uzaklaştır"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        
        <button
          onClick={resetZoom}
          className="p-2 text-white hover:text-blue-300 transition-colors"
          title="Zoom sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <button
          onClick={zoomIn}
          disabled={zoom >= 3}
          className="p-2 text-white hover:text-blue-300 disabled:opacity-30 transition-colors"
          title="Yakınlaştır"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        
        <div className="text-white text-sm font-medium px-3 py-1 bg-white bg-opacity-20 rounded-full">
          {currentPage}-{Math.min(rightPageNum, totalPages)} / {totalPages}
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1 || isFlipping}
          className="p-2 text-white hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Sonraki sayfa"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-400 mx-1"></div>
        
        <button
          onClick={toggleFullscreen}
          className="p-2 text-white hover:text-blue-300 transition-colors"
          title={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        
        <a
          href={pdfUrl}
          download={title}
          className="p-2 text-white hover:text-blue-300 transition-colors"
          title="İndir"
        >
          <Download className="w-4 h-4" />
        </a>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-red-300 transition-colors ml-2"
            title="Kapat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 shadow-lg"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        ></div>
      </div>

      <style jsx>{`
        .book-container {
          width: 800px;
          height: 600px;
          position: relative;
          margin: 0 auto;
        }

        .page {
          position: absolute;
          width: 400px;
          height: 600px;
          backface-visibility: hidden;
          transition: transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .left-page {
          left: 0;
          transform-origin: right center;
          transform: rotateY(0deg);
        }

        .right-page {
          right: 0;
          transform-origin: left center;
          transform: rotateY(0deg);
        }

        .page-content {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .book-spine {
          background: linear-gradient(to right, 
            transparent, 
            rgba(0,0,0,0.1) 20%, 
            rgba(0,0,0,0.2) 50%, 
            rgba(0,0,0,0.1) 80%, 
            transparent
          );
        }

        /* Realistic page flip animations */
        .flipping-next .right-page.flipping {
          animation: pageFlipNextRealistic 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .flipping-prev .left-page.flipping {
          animation: pageFlipPrevRealistic 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes pageFlipNextRealistic {
          0% { 
            transform: rotateY(0deg) translateX(0px);
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            z-index: 3;
          }
          25% {
            transform: rotateY(-45deg) translateX(-50px);
            box-shadow: -10px 0 30px rgba(0,0,0,0.3);
            z-index: 3;
          }
          50% { 
            transform: rotateY(-90deg) translateX(-100px);
            box-shadow: -20px 0 40px rgba(0,0,0,0.4);
            z-index: 3;
          }
          75% {
            transform: rotateY(-135deg) translateX(-150px);
            box-shadow: -30px 0 50px rgba(0,0,0,0.3);
            z-index: 2;
          }
          100% { 
            transform: rotateY(-180deg) translateX(-200px);
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            z-index: 1;
            opacity: 0;
          }
        }

        @keyframes pageFlipPrevRealistic {
          0% { 
            transform: rotateY(0deg) translateX(0px);
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            z-index: 3;
          }
          25% {
            transform: rotateY(45deg) translateX(50px);
            box-shadow: 10px 0 30px rgba(0,0,0,0.3);
            z-index: 3;
          }
          50% { 
            transform: rotateY(90deg) translateX(100px);
            box-shadow: 20px 0 40px rgba(0,0,0,0.4);
            z-index: 3;
          }
          75% {
            transform: rotateY(135deg) translateX(150px);
            box-shadow: 30px 0 50px rgba(0,0,0,0.3);
            z-index: 2;
          }
          100% { 
            transform: rotateY(180deg) translateX(200px);
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            z-index: 1;
            opacity: 0;
          }
        }

        /* Add page curl effect */
        .page::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          background: linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 60%, transparent 70%);
          border-radius: 0 0 0 20px;
          opacity: 0;
          transition: opacity 300ms ease;
        }

        .right-page::before {
          right: 0;
        }

        .left-page::before {
          left: 0;
          transform: scaleX(-1);
        }

        .page:hover::before {
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .book-container {
            width: 600px;
            height: 450px;
          }
          
          .page {
            width: 300px;
            height: 450px;
          }
        }

        @media (max-width: 768px) {
          .book-container {
            width: 400px;
            height: 300px;
          }
          
          .page {
            width: 200px;
            height: 300px;
          }
        }

        .canvas-container canvas {
          box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}