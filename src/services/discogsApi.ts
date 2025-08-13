import { DiscogsCollection, DiscogsRelease } from '../types/discogs';

const BASE_URL = 'https://api.discogs.com';
const BASE_DELAY = 1500; // 1.5 seconds between requests (more conservative)
const MAX_RETRIES = 5;
const MAX_DELAY = 30000; // 30 seconds max delay

interface FetchProgress {
  current: number;
  total: number;
  message: string;
  estimatedTime?: string;
}

class DiscogsApiService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateExponentialBackoff(attempt: number): number {
    const backoffDelay = Math.min(
      BASE_DELAY * Math.pow(2, attempt),
      MAX_DELAY
    );
    return backoffDelay + Math.random() * 1000; // Add jitter
  }

  private async fetchWithRetry(url: string, attempt: number = 0): Promise<Response> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Disco-Shuffle/1.0'
        }
      });

      // Handle rate limiting (429) with exponential backoff
      if (response.status === 429) {
        if (attempt >= MAX_RETRIES) {
          throw new Error(`Rate limit exceeded after ${MAX_RETRIES} retries. Please try again later.`);
        }

        const backoffDelay = this.calculateExponentialBackoff(attempt);
        console.log(`Rate limited (429). Retrying in ${Math.round(backoffDelay / 1000)}s (attempt ${attempt + 1}/${MAX_RETRIES})`);
        
        await this.delay(backoffDelay);
        return this.fetchWithRetry(url, attempt + 1);
      }

      // Handle other errors
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found on Discogs');
        }
        if (response.status === 403) {
          throw new Error('Collection is private or access denied');
        }
        if (response.status >= 500) {
          throw new Error(`Discogs server error (${response.status}). Please try again later.`);
        }
        throw new Error(`Error retrieving data from Discogs: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred while fetching data');
    }
  }

  async getUserCollection(username: string, onProgress?: (progress: FetchProgress) => void): Promise<DiscogsRelease[]> {
    try {
      const allReleases: DiscogsRelease[] = [];
      let page = 1;
      let totalPages = 1;
      const startTime = Date.now();

      // First, get the total count to estimate time
      const initialUrl = `${BASE_URL}/users/${username}/collection/folders/0/releases?page=1&per_page=100`;
      const initialResponse = await this.fetchWithRetry(initialUrl);
      const initialData: DiscogsCollection = await initialResponse.json();
      
      if (initialData.pagination.items === 0) {
        throw new Error('No albums found for this user');
      }

      totalPages = initialData.pagination.pages;
      allReleases.push(...initialData.releases);

      // Estimate time for large collections
      if (totalPages > 10) {
        const estimatedSeconds = Math.ceil(totalPages * BASE_DELAY / 1000);
        const estimatedMinutes = Math.ceil(estimatedSeconds / 60);
        
        if (onProgress) {
          onProgress({
            current: 1,
            total: totalPages,
            message: `Large collection detected (${initialData.pagination.items} albums). Estimated time: ${estimatedMinutes} minute${estimatedMinutes > 1 ? 's' : ''}`,
            estimatedTime: `${estimatedMinutes}m`
          });
        }
      } else {
        if (onProgress) {
          onProgress({
            current: 1,
            total: totalPages,
            message: `Fetching page 1 of ${totalPages}...`
          });
        }
      }

      // Fetch remaining pages with rate limiting
      for (page = 2; page <= totalPages; page++) {
        const url = `${BASE_URL}/users/${username}/collection/folders/0/releases?page=${page}&per_page=100`;
        const response = await this.fetchWithRetry(url);
        const data: DiscogsCollection = await response.json();
        
        allReleases.push(...data.releases);
        
        // Calculate progress and estimated time remaining
        const elapsed = Date.now() - startTime;
        const avgTimePerPage = elapsed / (page - 1);
        const remainingPages = totalPages - page;
        const estimatedRemaining = Math.ceil(remainingPages * avgTimePerPage / 1000);
        
        if (onProgress) {
          const progressMessage = totalPages > 10 
            ? `Fetching page ${page} of ${totalPages}... (${Math.round((page / totalPages) * 100)}% complete)`
            : `Fetching page ${page} of ${totalPages}...`;
          
          onProgress({
            current: page,
            total: totalPages,
            message: progressMessage,
            estimatedTime: remainingPages > 0 ? `${estimatedRemaining}s remaining` : undefined
          });
        }

        // Add delay between requests (except for the last one)
        if (page < totalPages) {
          await this.delay(BASE_DELAY);
        }
      }

      return allReleases;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while fetching collection');
    }
  }
}

export const discogsApi = new DiscogsApiService();