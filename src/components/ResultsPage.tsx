import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, RotateCcw, Filter } from 'lucide-react';
import { FilteredRelease, QueueSize, FORMATS, Format } from '../types/discogs';
import { AlbumCard } from './AlbumCard';

interface ResultsPageProps {
  results: FilteredRelease[];
  queueSize: QueueSize;
  username: string;
  currentFormats: Format[];
  onBack: () => void;
  onReshuffle: () => void;
  onFilterUpdate: (formats: Format[], queueSize: QueueSize) => void;
}

export function ResultsPage({ results, queueSize, username, currentFormats, onBack, onReshuffle, onFilterUpdate }: ResultsPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<Format[]>(currentFormats);
  const [selectedQueueSize, setSelectedQueueSize] = useState<QueueSize>(queueSize);
  const isSingleMode = selectedQueueSize === 1;

  // Initialize state with current props
  useEffect(() => {
    setSelectedQueueSize(queueSize);
    setSelectedFormats(currentFormats);
  }, [queueSize, currentFormats]);

  const toggleFormat = (format: Format) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const handleApplyFilters = () => {
    onFilterUpdate(selectedFormats, selectedQueueSize);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isSingleMode ? 'Your Random Pick' : `${results.length} Random Albums`}
              </h1>
              <p className="text-gray-600">
                From <span className="font-semibold">{username}</span>'s Discogs collection
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Update Filters</span>
              </button>
              
              <button
                onClick={onReshuffle}
                className="flex items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reshuffle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Format Filter
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATS.map(format => (
                    <label key={format} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(format)}
                        onChange={() => toggleFormat(format)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">{format}</span>
                    </label>
                  ))}
                </div>
                {selectedFormats.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFormats([])}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors mt-2"
                  >
                    Clear all formats
                  </button>
                )}
              </div>

              {/* Queue Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Albums
                </label>
                <div className="space-y-2">
                  {queueOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="queueSize"
                        value={option.value}
                        checked={selectedQueueSize === option.value}
                        onChange={() => setSelectedQueueSize(option.value)}
                        className="border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
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
            <Shuffle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No albums found</h3>
            <p className="text-gray-500">Try adjusting your format filters or check the username.</p>
          </div>
        )}
      </div>
    </div>
  );
}