import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, RotateCcw, Filter } from 'lucide-react';
import { FilteredRelease, QueueSize, FORMATS, Format, GENRES, Genre } from '../types/discogs';
import { AlbumCard } from './AlbumCard';

interface ResultsPageProps {
  results: FilteredRelease[];
  queueSize: QueueSize;
  username: string;
  currentFormats: Format[];
  currentGenres: Genre[];
  onBack: () => void;
  onReshuffle: () => void;
  onFilterUpdate: (formats: Format[], genres: Genre[], queueSize: QueueSize) => void;
}

export function ResultsPage({ results, queueSize, username, currentFormats, currentGenres, onBack, onReshuffle, onFilterUpdate }: ResultsPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<Format[]>(currentFormats);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(currentGenres);
  const [selectedQueueSize, setSelectedQueueSize] = useState<QueueSize>(queueSize);
  const isSingleMode = selectedQueueSize === 1;

  // Initialize state with current props
  useEffect(() => {
    setSelectedQueueSize(queueSize);
    setSelectedFormats(currentFormats);
    setSelectedGenres(currentGenres);
  }, [queueSize, currentFormats, currentGenres]);

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log('ResultsPage - selectedQueueSize changed to:', selectedQueueSize);
  }, [selectedQueueSize]);

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

  const handleApplyFilters = () => {
    onFilterUpdate(selectedFormats, selectedGenres, selectedQueueSize);
    setShowFilters(false);
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
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-[#DAA520] hover:text-[#CD853F] transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#F5F5DC] mb-2">
                {isSingleMode ? 'Your Random Pick' : `${results.length} Random Albums`}
              </h1>
              <p className="text-[#DEB887]">
                From <span className="font-semibold text-[#F5F5DC]">{username}</span>'s Discogs collection
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center vintage-card text-[#F5F5DC] px-4 py-3 rounded-lg font-medium hover:bg-[#8B4513] transition-all duration-200 space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Update Filters</span>
              </button>
              
              <button
                onClick={onReshuffle}
                className="flex items-center vintage-button text-[#1a0f0f] px-6 py-3 rounded-lg font-medium transition-all duration-200 space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reshuffle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="vintage-card rounded-lg shadow-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#F5F5DC] mb-4">Update Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-[#F5F5DC] mb-3">
                  Format Filter
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {FORMATS.map(format => (
                    <label key={format} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(format)}
                        onChange={() => toggleFormat(format)}
                        className="vintage-checkbox"
                        style={{ marginRight: '10px' }}
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
                  >
                    Clear all formats
                  </button>
                )}
              </div>

              {/* Genre Selection */}
              <div>
                <label className="block text-sm font-medium text-[#F5F5DC] mb-3">
                  Genre Filter
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                  {GENRES.map(genre => (
                    <label key={genre} className="flex items-center min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => toggleGenre(genre)}
                        className="vintage-checkbox flex-shrink-0"
                        style={{ marginRight: '10px' }}
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
                  >
                    Clear all genres
                  </button>
                )}
              </div>
            </div>

            {/* Queue Size Selection */}
            <div>
              <label className="block text-sm font-medium text-[#F5F5DC] mb-3">
                Number of Albums
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {queueOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <div className="relative mr-2">
                        <input
                          type="radio"
                          name="queueSize"
                          value={option.value}
                          checked={selectedQueueSize === option.value}
                          onChange={() => {
                            console.log('ResultsPage - Before setSelectedQueueSize:', selectedQueueSize, 'New value:', option.value, 'Type:', typeof option.value);
                            setSelectedQueueSize(option.value);
                          }}
                          className="radio-base disco-radio-base mr-2"
                          style={{
                            backgroundColor: selectedQueueSize === option.value ? '#DAA520' : '#1a0f0f',
                            borderColor: '#CD853F',
                            boxShadow: selectedQueueSize === option.value ? '0 0 0 2px #1a0f0f, 0 0 0 5px #DAA520' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#DAA520';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#CD853F';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(218, 165, 32, 0.3)';
                          }}
                          onBlur={(e) => {
                            if (selectedQueueSize !== option.value) {
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        />
                      {selectedQueueSize === option.value && (
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

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#CD853F]">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-[#F5F5DC] vintage-card hover:bg-[#8B4513] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="vintage-button px-6 py-2 text-[#1a0f0f] font-medium transition-all duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {isSingleMode && results.length > 0 ? (
          <div className="flex justify-center">
            <div className="max-w-md">
              <AlbumCard release={results[0]} className="transform hover:scale-105" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {results.map((release) => (
              <AlbumCard
                key={`${release.instance_id}-${release.basic_information.id}`}
                release={release}
                className="transform hover:scale-105"
              />
            ))}
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center py-16">
            <Shuffle className="w-16 h-16 text-[#CD853F] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#DEB887] mb-2">No albums found</h3>
            <p className="text-[#DEB887]">Try adjusting your format filters or check the username.</p>
          </div>
        )}
      </div>
    </div>
  );
}