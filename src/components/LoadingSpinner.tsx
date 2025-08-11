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
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700">{message}</p>
        {progress && (
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
        )}
        {progress && (
          <p className="text-sm text-gray-500">
            Page {progress.current} of {progress.total}
          </p>
        )}
      </div>
    </div>
  );
}