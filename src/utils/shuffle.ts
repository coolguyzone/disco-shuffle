import { DiscogsRelease, FilteredRelease, Format, QueueSize, Genre, GENRES } from '../types/discogs';

export function normalizeFormat(format: string): string {
  const normalized = format.toLowerCase();
  
  // Handle 7" formats - categorize as EP (check this FIRST)
  if (normalized.includes('7"') || 
      normalized.includes('7 inch') || 
      normalized.includes('7\'') ||
      normalized.includes('7 inch') ||
      normalized.includes('7in') ||
      normalized.includes('7 in')) {
    return 'EP';
  }
  
  // Handle EP formats
  if (normalized.includes('ep') && !normalized.includes('cassette')) {
    return 'EP';
  }
  
  // Handle CD formats
  if (normalized.includes('cd') || 
      normalized.includes('compact disc')) {
    return 'CD';
  }
  
  // Handle Cassette formats
  if (normalized.includes('cassette') || 
      normalized.includes('tape') || 
      normalized.includes('mc')) {
    return 'Cassette';
  }
  
  // Handle LP/Album formats (12" vinyl, albums, etc.)
  if (normalized.includes('lp') ||
      normalized.includes('album') || 
      normalized.includes('12"') ||
      normalized.includes('12 inch') ||
      normalized.includes('12\'') ||
      normalized.includes('12in') ||
      normalized.includes('12 in') ||
      normalized.includes('vinyl')) {
    return 'LP';
  }
  
  // Default to LP for unknown formats
  return 'LP';
}

export function normalizeGenre(genre: string): string {
  const normalized = genre.toLowerCase().trim();
  
  // Map common genre variations to our standardized Discogs categories
  // Since we're using Discogs' exact genre names, the mapping is simpler
  const genreMap: Record<string, Genre> = {
    // Rock variations
    'rock & roll': 'Rock',
    'hard rock': 'Rock',
    'progressive rock': 'Rock',
    'psychedelic rock': 'Rock',
    'garage rock': 'Rock',
    'surf rock': 'Rock',
    'alt rock': 'Rock',
    'college rock': 'Rock',
    'post rock': 'Rock',
    'metal': 'Rock',
    'punk': 'Rock',
    'grunge': 'Rock',
    'hardcore': 'Rock',
    'alternative': 'Rock',
    'indie': 'Rock',
    
    // Electronic variations
    'edm': 'Electronic',
    'electronica': 'Electronic',
    'dance': 'Electronic',
    'electro': 'Electronic',
    'synthpop': 'Electronic',
    'new wave': 'Electronic',
    'ambient': 'Electronic',
    'disco': 'Electronic',
    'house': 'Electronic',
    'techno': 'Electronic',
    'drum & bass': 'Electronic',
    'drum and bass': 'Electronic',
    'dnb': 'Electronic',
    'dubstep': 'Electronic',
    'experimental': 'Electronic',
    
    // Hip Hop variations
    'rap': 'Hip-Hop',
    'trap': 'Hip-Hop',
    'hip hop': 'Hip-Hop',
    'hiphop': 'Hip-Hop',
    
    // Jazz variations
    'bebop': 'Jazz',
    'free jazz': 'Jazz',
    'smooth jazz': 'Jazz',
    'fusion': 'Jazz',
    
    // Classical variations
    'orchestral': 'Classical',
    'chamber music': 'Classical',
    'opera': 'Classical',
    'symphony': 'Classical',
    
    // Folk, World, & Country variations
    'folk': 'Folk, World, & Country',
    'world': 'Folk, World, & Country',
    'country': 'Folk, World, & Country',
    'celtic': 'Folk, World, & Country',
    'african': 'Folk, World, & Country',
    'asian': 'Folk, World, & Country',
    'middle eastern': 'Folk, World, & Country',
    'flamenco': 'Folk, World, & Country',
    
    // Funk / Soul variations
    'funk': 'Funk / Soul',
    'soul': 'Funk / Soul',
    'neo soul': 'Funk / Soul',
    'blue eyed soul': 'Funk / Soul',
    'northern soul': 'Funk / Soul',
    'p funk': 'Funk / Soul',
    'funk rock': 'Funk / Soul',
    
    // Latin variations
    'salsa': 'Latin',
    'merengue': 'Latin',
    'bachata': 'Latin',
    'cumbia': 'Latin',
    'tango': 'Latin',
    
    // Stage & Screen variations
    'soundtrack': 'Stage & Screen',
    'score': 'Stage & Screen',
    'film score': 'Stage & Screen',
    'video game': 'Stage & Screen',
    'television': 'Stage & Screen',
    'musical': 'Stage & Screen',
    
    // Blues variations
    'blues rock': 'Blues',
    
    // Pop variations
    'indie pop': 'Pop',
    'bedroom pop': 'Pop',
    
    // Reggae variations
    'ska': 'Reggae',
    
    // Other common mappings
    'r&b': 'Funk / Soul',
    'rhythm and blues': 'Funk / Soul',
    'gospel': 'Funk / Soul',
    'new age': 'Electronic',
  };
  
  // Check exact matches first
  if (genreMap[normalized]) {
    return genreMap[normalized];
  }
  
  // Check if the genre contains any of our standard genres
  for (const standardGenre of GENRES) {
    if (normalized.includes(standardGenre.toLowerCase().replace(/[&\s]/g, ''))) {
      return standardGenre;
    }
  }
  
  // Check partial matches in our genre map
  for (const [key, value] of Object.entries(genreMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // If no match found, return the first genre from Discogs data or 'Electronic' as fallback
  return 'Electronic';
}

export function filterReleases(
  releases: DiscogsRelease[], 
  selectedFormats: Format[], 
  selectedGenres: Genre[] = []
): FilteredRelease[] {
  const releasesWithFormats = releases.map(release => {
    // Get format information from the first format entry
    const formatInfo = release.basic_information.formats[0];
    let formatString = formatInfo?.name || 'Unknown';
    
    // Also check descriptions array for additional format info
    if (formatInfo?.descriptions && formatInfo.descriptions.length > 0) {
      formatString += ' ' + formatInfo.descriptions.join(' ');
    }
    
    // Get primary genre (first genre in the array, or 'Other' if none)
    const primaryGenre = release.basic_information.genres?.[0] 
      ? normalizeGenre(release.basic_information.genres[0])
      : 'Other';
    
    return {
      ...release,
      primaryFormat: normalizeFormat(formatString),
      primaryGenre,
    };
  });
  
  // Apply format filters
  let filtered = releasesWithFormats;
  if (selectedFormats.length > 0) {
    filtered = filtered.filter(release => 
      selectedFormats.includes(release.primaryFormat as Format)
    );
  }
  
  // Apply genre filters
  if (selectedGenres.length > 0) {
    filtered = filtered.filter(release => 
      selectedGenres.includes(release.primaryGenre as Genre)
    );
  }
  
  return filtered;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomAlbums(releases: FilteredRelease[], queueSize: QueueSize): FilteredRelease[] {
  const shuffled = shuffleArray(releases);
  
  if (queueSize === 'all') {
    return shuffled;
  }
  
  return shuffled.slice(0, Math.min(queueSize, shuffled.length));
}