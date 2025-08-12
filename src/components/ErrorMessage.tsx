import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="text-center max-w-md mx-auto">
      <div className="mb-6">
        <div className="w-16 h-16 bg-vintage-red bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-vintage-red" />
        </div>
        <h2 className="text-2xl font-bold text-vintage-cream mb-2">Oops! Something went wrong</h2>
        <p className="text-vintage-warm">{message}</p>
      </div>
      
      <button
        onClick={onRetry}
        className="vintage-button text-vintage-dark px-6 py-3 rounded-lg font-medium transition-all duration-200"
      >
        Try Again
      </button>
    </div>
  );
}