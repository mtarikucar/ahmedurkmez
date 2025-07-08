'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SlideImage {
  id: number;
  url: string;
  title?: string;
  description?: string;
}

interface ImageSliderProps {
  images: SlideImage[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export default function ImageSlider({
  images,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className = ''
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-xl flex items-center justify-center border-2 border-teal-light/30 ${className}`}>
        <p className="text-brown-light font-bookmania">Görsel bulunamadı</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-2xl border-2 border-teal-light/30 ${className}`}>
      {/* Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={image.id} className="w-full flex-shrink-0 relative">
            <img
              src={image.url}
              alt={image.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay with text */}
            {(image.title || image.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown-dark/80 via-burgundy-dark/60 to-transparent p-6 backdrop-blur-sm">
                {image.title && (
                  <h3 className="text-white text-lg font-bookmania-bold mb-2 drop-shadow-lg">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-white/90 text-sm font-bookmania drop-shadow-md">
                    {image.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-burgundy-medium hover:bg-burgundy-dark text-white transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm border-2 border-white/20"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 bg-burgundy-medium hover:bg-burgundy-dark text-white transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm border-2 border-white/20"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 border border-white/30 ${
                index === currentIndex
                  ? 'scale-125 bg-teal-light shadow-lg'
                  : 'bg-white/50 hover:scale-110 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
