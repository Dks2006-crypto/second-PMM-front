'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
}

export default function SafeImage({
  src,
  alt,
  className = '',
  fallbackIcon,
  fallbackText = 'Изображение недоступно'
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 rounded-lg md:rounded-xl ${className}`}>
        <div className="text-center text-neutral-500 p-4 md:p-6">
          {fallbackIcon || (
            <svg className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          )}
          <p className="text-xs md:text-sm text-neutral-600">{fallbackText}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`max-w-full h-auto object-cover rounded-lg md:rounded-xl ${className}`}
      onError={() => setHasError(true)}
      onLoad={() => setIsLoading(false)}
      style={{ display: isLoading ? 'none' : 'block' }}
    />
  );
}