import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  progress?: {
    current: number;
    total: number;
  };
}

export function LoadingSpinner({ message = 'Loading...', progress }: LoadingSpinnerProps) {
  return (
    <div className="text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-vintage-brass border-t-vintage-gold rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-vintage-orange rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      <h2 className="text-2xl font-bold text-vintage-cream mb-4">{message}</h2>
      
      {progress && (
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-vintage-warm mb-2">
            <span>Progress</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-vintage-dark rounded-full h-2 border border-vintage-brass">
            <div 
              className="bg-gradient-to-r from-vintage-brass to-vintage-gold h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}