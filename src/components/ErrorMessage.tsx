import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}