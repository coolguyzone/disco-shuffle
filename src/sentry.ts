import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
export function initSentry() {
  // Only initialize in production
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || undefined,
      
      // Performance monitoring
      integrations: [
        new BrowserTracing({
          // Set sampling rate for performance monitoring
          // Adjust this value in production
          tracesSampleRate: 0.2,
        }),
      ],
      
      // Session replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of error sessions
      
      // Environment
      environment: import.meta.env.MODE,
      
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      
      // Debug mode (set to false in production)
      debug: false,
      
      // Performance monitoring
      tracesSampleRate: 0.2,
      
      // Set maximum breadcrumbs
      maxBreadcrumbs: 50,
      
      // Ignore certain errors
      ignoreErrors: [
        // Ignore network errors that might be temporary
        'Network Error',
        'Failed to fetch',
        'Request timeout',
        // Ignore common browser errors
        'ResizeObserver loop limit exceeded',
        'Script error.',
      ],
      
      // Configure beforeSend to filter out certain events
      beforeSend(event, hint) {
        // Don't send events in development
        if (import.meta.env.DEV) {
          return null;
        }
        
        // Filter out certain error types if needed
        if (event.exception) {
          const exception = event.exception.values?.[0];
          if (exception?.type === 'NetworkError') {
            return null;
          }
        }
        
        return event;
      },
    });
  }
}

// Export Sentry for use in components
export { Sentry };

// Helper function to capture user context
export function setUserContext(username: string) {
  if (import.meta.env.PROD) {
    Sentry.setUser({
      username,
      id: username, // Use username as ID for Discogs users
    });
  }
}

// Helper function to capture custom events
export function captureCustomEvent(eventName: string, data?: Record<string, any>) {
  if (import.meta.env.PROD) {
    Sentry.captureEvent({
      message: eventName,
      level: 'info',
      tags: {
        event_type: 'custom',
        ...data,
      },
    });
  }
}

// Helper function to capture Discogs API errors
export function captureDiscogsError(error: Error, context?: Record<string, any>) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      tags: {
        error_source: 'discogs_api',
        ...context,
      },
      extra: {
        error_message: error.message,
        error_stack: error.stack,
        context,
      },
    });
  }
}
