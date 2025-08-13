import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ResultsPage } from './components/ResultsPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { discogsApi } from './services/discogsApi';
import { filterReleases, getRandomAlbums } from './utils/shuffle';
import { DiscogsRelease, FilteredRelease, Format, QueueSize, Genre } from './types/discogs';
import { Sentry, setUserContext, captureCustomEvent, captureDiscogsError } from './sentry';

type ViewState = 'home' | 'loading' | 'results' | 'error';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [allReleases, setAllReleases] = useState<DiscogsRelease[]>([]);
  const [filteredResults, setFilteredResults] = useState<FilteredRelease[]>([]);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentFormats, setCurrentFormats] = useState<Format[]>([]);
  const [currentGenres, setCurrentGenres] = useState<Genre[]>([]);
  const [currentQueueSize, setCurrentQueueSize] = useState<QueueSize>(1);
  const [error, setError] = useState('');
  const [fetchProgress, setFetchProgress] = useState<{ current: number; total: number; message: string; estimatedTime?: string }>({ current: 0, total: 0, message: '', estimatedTime: '' });

  const handleFetchLibrary = async (username: string, formats: Format[], genres: Genre[], queueSize: QueueSize) => {
    setView('loading');
    setError('');
    setCurrentUsername(username);
    setCurrentFormats(formats);
    setCurrentGenres(genres);
    setCurrentQueueSize(queueSize);
    setFetchProgress({ current: 0, total: 0, message: '', estimatedTime: '' });

    // Track user action in Sentry
    setUserContext(username);
    captureCustomEvent('library_fetch_started', {
      username,
      formats: formats.join(','),
      genres: genres.join(','),
      queueSize,
    });

    try {
      const releases = await discogsApi.getUserCollection(
        username,
        (progress) => setFetchProgress(progress)
      );
      
      setAllReleases(releases);
      
      // Track successful fetch
      captureCustomEvent('library_fetch_success', {
        username,
        totalReleases: releases.length,
        formats: formats.join(','),
        genres: genres.join(','),
        queueSize,
      });
      
      // Apply filters and randomization
      const filtered = filterReleases(releases, formats, genres);
      const randomized = getRandomAlbums(filtered, queueSize);
      
      setFilteredResults(randomized);
      setView('results');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      
      // Track error in Sentry
      captureDiscogsError(error, {
        username,
        formats: formats.join(','),
        genres: genres.join(','),
        queueSize,
        action: 'fetch_library',
      });
      
      setError(error.message);
      setView('error');
    }
  };

  const handleReshuffle = () => {
    // Track reshuffle action
    captureCustomEvent('reshuffle_triggered', {
      username: currentUsername,
      formats: currentFormats.join(','),
      genres: currentGenres.join(','),
      queueSize: currentQueueSize,
    });
    
    const filtered = filterReleases(allReleases, currentFormats, currentGenres);
    const randomized = getRandomAlbums(filtered, currentQueueSize);
    setFilteredResults(randomized);
  };

  const handleFilterUpdate = (newFormats: Format[], newGenres: Genre[], newQueueSize: QueueSize) => {
    // Track filter update action
    captureCustomEvent('filters_updated', {
      username: currentUsername,
      oldFormats: currentFormats.join(','),
      newFormats: newFormats.join(','),
      oldGenres: currentGenres.join(','),
      newGenres: newGenres.join(','),
      oldQueueSize: currentQueueSize,
      newQueueSize,
    });
    
    setCurrentFormats(newFormats);
    setCurrentGenres(newGenres);
    setCurrentQueueSize(newQueueSize);
    
    // Apply new filters to existing data and reshuffle
    const filtered = filterReleases(allReleases, newFormats, newGenres);
    const randomized = getRandomAlbums(filtered, newQueueSize);
    setFilteredResults(randomized);
  };

  const handleBack = () => {
    setView('home');
    // Clear data to save memory, but keep username for convenience
    setAllReleases([]);
    setFilteredResults([]);
    setError('');
  };

  const handleRetry = () => {
    if (currentUsername) {
      handleFetchLibrary(currentUsername, currentFormats, currentGenres, currentQueueSize);
    } else {
      setView('home');
    }
  };

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, resetError }) => (
        <div className="min-h-screen bg-gradient-to-br from-vintage-darker via-vintage-dark to-vintage-wood flex items-center justify-center p-4">
          <div className="vintage-card rounded-lg shadow-2xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-vintage-red mb-4">Something went wrong</h1>
            <p className="text-vintage-warm mb-6">
              An unexpected error occurred. Our team has been notified.
            </p>
            <button
              onClick={resetError}
              className="vintage-button text-vintage-dark px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Try Again
            </button>
            {import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-vintage-warm">Error Details (Dev)</summary>
                <pre className="mt-2 text-xs text-vintage-red bg-vintage-dark p-2 rounded overflow-auto border border-vintage-brass">
                  {error instanceof Error ? error.message : String(error)}
                  {componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    >
      <div className="min-h-screen">
        {view === 'home' && (
          <HomePage
            onFetchLibrary={handleFetchLibrary}
            loading={false}
          />
        )}
        
        {view === 'loading' && (
          <div className="min-h-screen bg-gradient-to-br from-vintage-darker via-vintage-dark to-vintage-wood flex items-center justify-center">
            <LoadingSpinner
              message="Fetching your Discogs library..."
              progress={fetchProgress.total > 0 ? fetchProgress : undefined}
            />
          </div>
        )}
        
        {view === 'results' && (
          <ResultsPage
            results={filteredResults}
            queueSize={currentQueueSize}
            username={currentUsername}
            currentFormats={currentFormats}
            currentGenres={currentGenres}
            onBack={handleBack}
            onReshuffle={handleReshuffle}
            onFilterUpdate={handleFilterUpdate}
          />
        )}
        
        {view === 'error' && (
          <div className="min-h-screen bg-gradient-to-br from-[#0f0808] via-[#1a0f0f] to-[#8B4513] flex items-center justify-center">
            <ErrorMessage
              message={error}
              onRetry={handleRetry}
              onBack={handleBack}
            />
          </div>
        )}
      </div>
    </Sentry.ErrorBoundary>
  );
}

export default App;