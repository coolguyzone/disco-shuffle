import { DiscogsRelease, FilteredRelease, Format, QueueSize } from '../types/discogs';

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

export function filterReleases(releases: DiscogsRelease[], selectedFormats: Format[]): FilteredRelease[] {
  const releasesWithFormats = releases.map(release => {
    // Get format information from the first format entry
    const formatInfo = release.basic_information.formats[0];
    let formatString = formatInfo?.name || 'Unknown';
    
    // Also check descriptions array for additional format info
    if (formatInfo?.descriptions && formatInfo.descriptions.length > 0) {
      formatString += ' ' + formatInfo.descriptions.join(' ');
    }
    
    return {
      ...release,
      primaryFormat: normalizeFormat(formatString)
    };
  });
  
  if (selectedFormats.length === 0) {
    return releasesWithFormats;
  }

  return releasesWithFormats.filter(release => 
    selectedFormats.includes(release.primaryFormat as Format)
  );
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