import React, { useState } from 'react';
import { FilteredRelease } from '../types/discogs';
import { Music, Calendar, ExternalLink } from 'lucide-react';

interface AlbumCardProps {
  release: FilteredRelease;
  className?: string;
}

export function AlbumCard({ release, className = '' }: AlbumCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { basic_information } = release;
  const artist = basic_information.artists[0]?.name || 'Unknown Artist';
  const title = basic_information.title;
  const year = basic_information.year;
  const imageUrl = basic_information.cover_image || basic_information.thumb;
  const discogsUrl = `https://www.discogs.com/release/${basic_information.id}`;
  
  return (
    <a 
      href={discogsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden block ${className}`}
    >
      <div className="aspect-square relative overflow-hidden">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={`${artist} - ${title}`}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : null}
        
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <Music className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
          {release.primaryFormat}
        </div>
        
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-600 font-medium line-clamp-1">
          {artist}
        </p>
        {year && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {year}
          </div>
        )}
      </div>
    </a>
  );
}