import { DiscogsCollection, DiscogsRelease } from '../types/discogs';

const BASE_URL = 'https://api.discogs.com';
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

class DiscogsApiService {
  private async fetchWithDelay(url: string): Promise<Response> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Disco-Shuffle/1.0'
      }
    });
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    
    return response;
  }

  async getUserCollection(username: string, onProgress?: (current: number, total: number) => void): Promise<DiscogsRelease[]> {
    try {
      const allReleases: DiscogsRelease[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const url = `${BASE_URL}/users/${username}/collection/folders/0/releases?page=${page}&per_page=100`;
        const response = await this.fetchWithDelay(url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found on Discogs');
          }
          throw new Error(`Error retrieving data from Discogs: ${response.status}`);
        }

        const data: DiscogsCollection = await response.json();
        
        if (page === 1) {
          totalPages = data.pagination.pages;
          if (data.pagination.items === 0) {
            throw new Error('No albums found for this user');
          }
        }

        allReleases.push(...data.releases);
        
        if (onProgress) {
          onProgress(page, totalPages);
        }

        page++;
      } while (page <= totalPages);

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