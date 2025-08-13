import React, { useState } from 'react';
import { Disc3, Shuffle, Filter } from 'lucide-react';
import { FORMATS, Format, QueueSize, GENRES, Genre } from '../types/discogs';

interface HomePageProps {
  onFetchLibrary: (username: string, formats: Format[], genres: Genre[], queueSize: QueueSize) => void;
  loading: boolean;
}

export function HomePage({ onFetchLibrary, loading }: HomePageProps) {
  const [username, setUsername] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<Format[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [queueSize, setQueueSize] = useState<QueueSize>(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debug effect to monitor state changes
  React.useEffect(() => {
    console.log('HomePage - queueSize changed to:', queueSize);
  }, [queueSize]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onFetchLibrary(username.trim(), selectedFormats, selectedGenres, queueSize);
    }
  };

  const toggleFormat = (format: Format) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const queueOptions = [
    { value: 1 as QueueSize, label: 'Single Album' },
    { value: 10 as QueueSize, label: '10 Albums' },
    { value: 25 as QueueSize, label: '25 Albums' },
    { value: 50 as QueueSize, label: '50 Albums' },
    { value: 'all' as QueueSize, label: 'Entire Library' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0808] via-[#1a0f0f] to-[#8B4513]">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Disc3 className="w-16 h-16 text-[#1a0f0f] opacity-80" />
              <div className="absolute inset-0 w-16 h-16">
                <Disc3 className="w-16 h-16 text-[#DAA520] animate-spin vintage-glow" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold vintage-text-gradient mb-4">
            Disco Shuffle
          </h1>
          <p className="text-xl text-[#F5F5DC] max-w-2xl mx-auto">
            Discover hidden gems in your Discogs collection with our smart random album picker
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="vintage-card rounded-2xl shadow-2xl p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#F5F5DC] mb-2">
                  Discogs Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Discogs username"
                  className="vintage-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#DAA520] focus:border-transparent transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#F5F5DC]">
                    Filters
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-sm text-[#DAA520] hover:text-[#CD853F] transition-colors"
                    disabled={loading}
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    {selectedFormats.length > 0 || selectedGenres.length > 0 
                      ? `${selectedFormats.length + selectedGenres.length} selected` 
                      : 'All filters'}
                  </button>
                </div>
                
                {showFilters && (
                  <div className="vintage-filter-panel rounded-lg p-4 space-y-4">
                    {/* Format Filters */}
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F5DC] mb-3">Format</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {FORMATS.map(format => (
                          <label key={format} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedFormats.includes(format)}
                              onChange={() => toggleFormat(format)}
                              className="vintage-checkbox"
                              style={{ marginRight: '10px' }}
                              disabled={loading}
                            />
                            <span className="text-sm text-[#F5F5DC]">{format}</span>
                          </label>
                        ))}
                      </div>
                      {selectedFormats.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedFormats([])}
                          className="text-sm text-[#DEB887] hover:text-[#DAA520] transition-colors mt-3"
                          disabled={loading}
                        >
                          Clear formats
                        </button>
                      )}
                    </div>

                    {/* Genre Filters */}
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F5DC] mb-3">Genre</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                        {GENRES.map(genre => (
                          <label key={genre} className="flex items-center min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedGenres.includes(genre)}
                              onChange={() => toggleGenre(genre)}
                              className="vintage-checkbox flex-shrink-0"
                              style={{ marginRight: '10px' }}
                              disabled={loading}
                            />
                            <span className="text-sm text-[#F5F5DC] truncate">{genre}</span>
                          </label>
                        ))}
                      </div>
                      {selectedGenres.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedGenres([])}
                          className="text-sm text-[#DEB887] hover:text-[#DAA520] transition-colors mt-3"
                          disabled={loading}
                        >
                          Clear genres
                        </button>
                      )}
                    </div>

                    {/* Queue Size Selection */}
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F5DC] mb-2">Number of Results</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {queueOptions.map(option => (
                          <label key={option.value} className="flex items-center">
                            <div className="relative mr-2">
                              <input
                                type="radio"
                                name="queueSize"
                                value={option.value}
                                checked={queueSize === option.value}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  console.log('HomePage - Before setQueueSize:', queueSize, 'New value:', newValue, 'Type:', typeof newValue);
                                  console.log('HomePage - Current queueSize:', queueSize, 'Option value:', option.value, 'Comparison:', queueSize === option.value);
                                  
                                  // Convert string to proper type
                                  let convertedValue: QueueSize;
                                  if (newValue === 'all') {
                                    convertedValue = 'all';
                                  } else {
                                    convertedValue = parseInt(newValue) as QueueSize;
                                  }
                                  
                                  console.log('HomePage - Converted value:', convertedValue, 'Type:', typeof convertedValue);
                                  setQueueSize(convertedValue);
                                }}
                                className="radio-base disco-radio-base mr-2"
                                style={{
                                  backgroundColor: queueSize === option.value ? '#DAA520' : '#1a0f0f',
                                  borderColor: '#CD853F',
                                  boxShadow: queueSize === option.value ? '0 0 0 2px #1a0f0f, 0 0 0 5px #DAA520' : 'none'
                                }}
                                disabled={loading}
                                onMouseEnter={(e) => {
                                  if (!loading) {
                                    e.currentTarget.style.borderColor = '#DAA520';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!loading) {
                                    e.currentTarget.style.borderColor = '#CD853F';
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(218, 165, 32, 0.3)';
                                }}
                                onBlur={(e) => {
                                  if (queueSize !== option.value) {
                                    e.currentTarget.style.boxShadow = 'none';
                                  }
                                }}
                              />
                              {queueSize === option.value && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: '#1a0f0f',
                                    borderRadius: '50%',
                                    zIndex: 1
                                  }}
                                />
                              )}
                            </div>
                            <span className="text-sm text-[#F5F5DC]">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Clear All Button */}
                    {(selectedFormats.length > 0 || selectedGenres.length > 0) && (
                      <div className="pt-2 border-t border-[#CD853F]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFormats([]);
                            setSelectedGenres([]);
                          }}
                          className="text-sm text-[#DEB887] hover:text-[#DAA520] transition-colors"
                          disabled={loading}
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="vintage-button w-full text-[#1a0f0f] py-4 px-6 rounded-lg font-semibold text-lg hover:from-[#DAA520] hover:to-[#CD853F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Shuffle className="w-5 h-5" />
                <span>{loading ? 'Fetching Library...' : 'Fetch & Shuffle'}</span>
              </button>
            </form>
          </div>

          <div className="text-center mt-8 text-sm text-[#DEB887]">
            <p>
              Make sure your Discogs collection is set to public visibility for this to work.
            </p>
            <p className="mt-2 text-xs text-[#CD853F]">
              💡 Large collections may take several minutes to fetch due to API rate limits. We'll show you progress and estimated time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}