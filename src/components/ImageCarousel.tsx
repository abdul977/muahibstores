import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  video?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  showControls?: boolean;
  showDots?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  video,
  autoPlay = true,
  autoPlayInterval = 4000,
  className = '',
  showControls = true,
  showDots = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);

  // Combine images and video into a single media array
  const mediaItems = React.useMemo(() => {
    const items = images.map(url => ({ type: 'image' as const, url }));
    if (video) {
      items.push({ type: 'video' as const, url: video });
    }
    return items;
  }, [images, video]);

  const totalItems = mediaItems.length;

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovered || totalItems <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, totalItems, autoPlayInterval]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  if (totalItems === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No media available</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-white shadow-lg group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Media Display */}
      <div className="relative w-full h-96 overflow-hidden">
        {mediaItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentIndex
                ? 'translate-x-0'
                : index < currentIndex
                  ? '-translate-x-full'
                  : 'translate-x-full'
            }`}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ aspectRatio: '3/4' }} // Portrait orientation
              />
            ) : (
              <video
                src={item.url}
                controls
                className="w-full h-full object-cover"
                style={{ aspectRatio: '3/4' }} // Portrait orientation
              />
            )}
          </div>
        ))}

        {/* Gradient Overlay for Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Navigation Controls */}
      {showControls && totalItems > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Play/Pause Button */}
          {autoPlay && (
            <button
              onClick={togglePlayPause}
              className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          )}
        </>
      )}

      {/* Dot Indicators */}
      {showDots && totalItems > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mediaItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white shadow-lg scale-110'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Media Counter */}
      {totalItems > 1 && (
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
          {currentIndex + 1} / {totalItems}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;