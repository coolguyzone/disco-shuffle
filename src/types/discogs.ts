export interface DiscogsRelease {
  id: number;
  basic_information: {
    id: number;
    title: string;
    artists: Array<{
      name: string;
      id: number;
    }>;
    formats: Array<{
      name: string;
      descriptions?: string[];
    }>;
    thumb: string;
    cover_image: string;
    year: number;
    genres?: string[];
    styles?: string[];
  };
  instance_id: number;
}

export interface DiscogsCollection {
  releases: DiscogsRelease[];
  pagination: {
    pages: number;
    page: number;
    per_page: number;
    items: number;
  };
}

export interface FilteredRelease extends DiscogsRelease {
  primaryFormat: string;
  primaryGenre?: string;
}

export type QueueSize = 1 | 10 | 25 | 50 | 'all';

export const FORMATS = [
  'LP',
  'EP',
  'Cassette',
  'CD'
] as const;

export type Format = typeof FORMATS[number];

// Music genres for filtering - based on official Discogs database guidelines
// These are the exact genre categories used by Discogs
export const GENRES = [
  'Blues',
  'Brass & Military',
  'Children\'s',
  'Classical',
  'Electronic',
  'Folk, World, & Country',
  'Funk / Soul',
  'Hip-Hop',
  'Jazz',
  'Latin',
  'Non-Music',
  'Pop',
  'Reggae',
  'Rock',
  'Stage & Screen'
] as const;

export type Genre = typeof GENRES[number];