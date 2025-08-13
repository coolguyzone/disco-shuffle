import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onBack?: () => void;
}

export function ErrorMessage({ message, onRetry, onBack }: ErrorMessageProps) {
  // Parse error message to provide helpful guidance
  const isRateLimitError = message.includes('Rate limit exceeded') || message.includes('429');
  const isPrivateCollection = message.includes('private') || message.includes('access denied');
  const isUserNotFound = message.includes('User not found');
  const isServerError = message.includes('server error') || message.includes('500');

  const getHelpfulMessage = () => {
    if (isRateLimitError) {
      return {
        title: 'API Rate Limit Reached',
        description: 'Discogs is temporarily limiting requests. This usually happens with very large collections.',
        advice: 'Please wait a few minutes and try again, or try during off-peak hours.',
        icon: '⏰'
      };
    }
    if (isPrivateCollection) {
      return {
        title: 'Collection is Private',
        description: 'This Discogs collection is set to private visibility.',
        advice: 'Ask the user to make their collection public in their Discogs settings.',
        icon: '🔒'
      };
    }
    if (isUserNotFound) {
      return {
        title: 'User Not Found',
        description: 'This Discogs username could not be found.',
        advice: 'Please check the spelling and ensure the user exists on Discogs.',
        icon: '👤'
      };
    }
    if (isServerError) {
      return {
        title: 'Discogs Server Error',
        description: 'Discogs is experiencing technical difficulties.',
        advice: 'Please try again in a few minutes.',
        icon: '🛠️'
      };
    }
    return {
      title: 'Something went wrong',
      description: message,
      advice: 'Please try again or check your internet connection.',
      icon: '❌'
    };
  };

  const errorInfo = getHelpfulMessage();

  return (
    <div className="vintage-card rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">{errorInfo.icon}</div>
        <AlertTriangle className="w-16 h-16 text-[#DC143C] mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#DC143C] mb-4">
          {errorInfo.title}
        </h1>
        <p className="text-lg text-[#F5F5DC] mb-4">
          {errorInfo.description}
        </p>
        <p className="text-[#DEB887] mb-6">
          💡 {errorInfo.advice}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetry}
          className="vintage-button text-[#1a0f0f] px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
        
        {onBack && (
          <button
            onClick={onBack}
            className="vintage-card text-[#F5F5DC] px-6 py-3 rounded-lg font-medium hover:bg-[#8B4513] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Search</span>
          </button>
        )}
      </div>

      {/* Additional help for rate limiting */}
      {isRateLimitError && (
        <div className="mt-6 p-4 bg-[#1a0f0f] rounded-lg border border-[#CD853F]">
          <h3 className="text-[#DAA520] font-semibold mb-2">Why does this happen?</h3>
          <ul className="text-sm text-[#DEB887] text-left space-y-1">
            <li>• Discogs limits API requests to prevent abuse</li>
            <li>• Large collections (1000+ albums) require many API calls</li>
            <li>• We automatically retry with delays, but limits can still be hit</li>
            <li>• Try again in 5-10 minutes when limits reset</li>
          </ul>
        </div>
      )}
    </div>
  );
}