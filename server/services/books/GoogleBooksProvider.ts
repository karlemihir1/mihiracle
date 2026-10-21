import { BookProvider, BookMetadata } from './BookProvider.js';

export class GoogleBooksProvider implements BookProvider {
  name = 'google_books';

  async searchBooks(query: string, options?: { category?: string; limit?: number }): Promise<BookMetadata[]> {
    const limit = options?.limit || 10;
    let q = query.trim();
    if (options?.category && options.category !== 'all') {
      q += `+subject:${options.category}`;
    }

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=${limit}&printType=books`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      
      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      if (!data.items || !Array.isArray(data.items)) {
        return [];
      }

      return data.items.map((item: any) => this.formatGoogleBook(item));
    } catch (err) {
      console.warn('Google Books API search failed or timed out:', err);
      return [];
    }
  }

  async getBookDetails(id: string): Promise<BookMetadata | null> {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) return null;
      const data = await res.json();
      return this.formatGoogleBook(data);
    } catch {
      return null;
    }
  }

  private formatGoogleBook(item: any): BookMetadata {
    const info = item.volumeInfo || {};
    let coverUrl = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
    if (coverUrl.startsWith('http://')) {
      coverUrl = coverUrl.replace('http://', 'https://');
    }

    const pubDate = info.publishedDate || '';
    const pubYear = pubDate ? parseInt(pubDate.substring(0, 4), 10) : undefined;

    const isbns = info.industryIdentifiers || [];
    const isbn13 = isbns.find((i: any) => i.type === 'ISBN_13')?.identifier;
    const isbn10 = isbns.find((i: any) => i.type === 'ISBN_10')?.identifier;

    return {
      id: item.id,
      title: info.title || 'Untitled',
      authors: info.authors || ['Unknown Author'],
      description: info.description || 'No description available.',
      coverUrl: coverUrl || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400`,
      publisher: info.publisher,
      publicationYear: isNaN(pubYear!) ? undefined : pubYear,
      isbn: isbn13 || isbn10,
      categories: info.categories || ['General Knowledge'],
      pageCount: info.pageCount,
      rating: info.averageRating,
      externalProvider: 'google_books',
      externalProviderId: item.id,
    };
  }
}
