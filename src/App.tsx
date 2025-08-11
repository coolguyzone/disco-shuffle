import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ResultsPage } from './components/ResultsPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { discogsApi } from './services/discogsApi';
import { filterReleases, getRandomAlbums } from './utils/shuffle';
import { DiscogsRelease, FilteredRelease, Format, QueueSize } from './types/discogs';

type ViewState = 'home' | 'loading' | 'results' | 'error';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [allReleases, setAllReleases] = useState<DiscogsRelease[]>([]);
  const [filteredResults, setFilteredResults] = useState<FilteredRelease[]>([]);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentFormats, setCurrentFormats] = useState<Format[]>([]);
  const [currentQueueSize, setCurrentQueueSize] = useState<QueueSize>(1);
  const [error, setError] = useState('');
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });

  const handleFetchLibrary = async (username: string, formats: Format[], queueSize: QueueSize) => {
    setView('loading');
    setError('');
    setCurrentUsername(username);
    setCurrentFormats(formats);
    setCurrentQueueSize(queueSize);
    setFetchProgress({ current: 0, total: 0 });

    try {
      const releases = await discogsApi.getUserCollection(
        username, 
        (current, total) => setFetchProgress({ current, total })
      );
      
      setAllReleases(releases);
      
      // Apply filters and randomization
      const filtered = filterReleases(releases, formats);
      const randomized = getRandomAlbums(filtered, queueSize);
      
      setFilteredResults(randomized);
      setView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setView('error');
    }
  };

  const handleReshuffle = () => {
    const filtered = filterReleases(allReleases, currentFormats);
    const randomized = getRandomAlbums(filtered, currentQueueSize);
    setFilteredResults(randomized);
  };

  const handleFilterUpdate = (newFormats: Format[], newQueueSize: QueueSize) => {
    setCurrentFormats(newFormats);
    setCurrentQueueSize(newQueueSize);
    
    // Apply new filters to existing data and reshuffle
    const filtered = filterReleases(allReleases, newFormats);
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
      handleFetchLibrary(currentUsername, currentFormats, currentQueueSize);
    } else {
      setView('home');
    }
  };

  return (
    <div className="min-h-screen">
      {view === 'home' && (
        <HomePage
          onFetchLibrary={handleFetchLibrary}
          loading={false}
        />
      )}
      
      {view === 'loading' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
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
          onBack={handleBack}
          onReshuffle={handleReshuffle}
          onFilterUpdate={handleFilterUpdate}
        />
      )}
      
      {view === 'error' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
          />
        </div>
      )}
    </div>
  );
}

export default App;