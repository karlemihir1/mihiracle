import { BookProvider, BookMetadata } from './BookProvider.js';
import { OpenLibraryBookProvider } from './OpenLibraryBookProvider.js';
import { GoogleBooksProvider } from './GoogleBooksProvider.js';
import { CuratedBooksProvider } from './CuratedBooksProvider.js';

class HybridBookProvider implements BookProvider {
  name = 'hybrid';
  private openLibrary = new OpenLibraryBookProvider();
  private google = new GoogleBooksProvider();
  private curated = new CuratedBooksProvider();

  async searchBooks(query: string, options?: { category?: string; limit?: number }): Promise<BookMetadata[]> {
    const curatedResults = await this.curated.searchBooks(query, options);
    const limit = options?.limit || 12;

    if (query.trim()) {
      try {
        // Query Open Library first (robust, free, universal, no rate limit)
        const openLibResults = await this.openLibrary.searchBooks(query, { ...options, limit });
        
        // Merge results avoiding duplicate titles
        const seen = new Set(curatedResults.map(b => b.title.toLowerCase().trim()));
        const combined = [...curatedResults];

        for (const ol of openLibResults) {
          const normTitle = ol.title.toLowerCase().trim();
          if (!seen.has(normTitle)) {
            seen.add(normTitle);
            combined.push(ol);
          }
        }

        // Also attempt Google Books if fewer than 5 results
        if (combined.length < 5) {
          try {
            const googleResults = await this.google.searchBooks(query, options);
            for (const g of googleResults) {
              const normTitle = g.title.toLowerCase().trim();
              if (!seen.has(normTitle)) {
                seen.add(normTitle);
                combined.push(g);
              }
            }
          } catch {
            // ignore Google 429 rate limit errors
          }
        }

        return combined.slice(0, limit);
      } catch (err) {
        console.warn('Online book search error:', err);
      }
    }

    return curatedResults.slice(0, limit);
  }

  async getBookDetails(id: string): Promise<BookMetadata | null> {
    const curated = await this.curated.getBookDetails(id);
    if (curated) return curated;

    const openLib = await this.openLibrary.getBookDetails(id);
    if (openLib) return openLib;

    return this.google.getBookDetails(id);
  }
}

let instance: BookProvider | null = null;

export function getBookProvider(): BookProvider {
  if (!instance) {
    instance = new HybridBookProvider();
  }
  return instance;
}

export * from './BookProvider.js';
