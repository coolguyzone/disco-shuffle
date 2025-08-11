import React, { useState } from 'react';
import { Disc3, Shuffle, Filter } from 'lucide-react';
import { FORMATS, Format, QueueSize } from '../types/discogs';

interface HomePageProps {
  onFetchLibrary: (username: string, formats: Format[], queueSize: QueueSize) => void;
  loading: boolean;
}

export function HomePage({ onFetchLibrary, loading }: HomePageProps) {
  const [username, setUsername] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<Format[]>([]);
  const [queueSize, setQueueSize] = useState<QueueSize>(1);
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onFetchLibrary(username.trim(), selectedFormats, queueSize);
    }
  };

  const toggleFormat = (format: Format) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Disc3 className="w-16 h-16 text-purple-500 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 w-16 h-16">
                <Disc3 className="w-16 h-16 text-blue-500 opacity-50 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Disco Shuffle
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover hidden gems in your Discogs collection with our smart random album picker
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Discogs Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your Discogs username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Queue Size
                  </label>
                  <select
                    value={queueSize}
                    onChange={(e) => setQueueSize(e.target.value as QueueSize)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  >
                    {queueOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Format Filter
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center text-sm text-purple-600 hover:text-purple-700 transition-colors"
                      disabled={loading}
                    >
                      <Filter className="w-4 h-4 mr-1" />
                      {selectedFormats.length > 0 ? `${selectedFormats.length} selected` : 'All formats'}
                    </button>
                  </div>
                  
                  {showFilters && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        {FORMATS.map(format => (
                          <label key={format} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedFormats.includes(format)}
                              onChange={() => toggleFormat(format)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                              disabled={loading}
                            />
                            <span className="text-sm text-gray-700">{format}</span>
                          </label>
                        ))}
                      </div>
                      {selectedFormats.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedFormats([])}
                          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                          disabled={loading}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Shuffle className="w-5 h-5" />
                <span>{loading ? 'Fetching Library...' : 'Fetch & Shuffle'}</span>
              </button>
            </form>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            <p>
              Make sure your Discogs collection is set to public visibility for this to work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}