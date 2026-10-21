import { BookProvider, BookMetadata } from './BookProvider.js';

export class OpenLibraryBookProvider implements BookProvider {
  name = 'open_library';

  async searchBooks(query: string, options?: { category?: string; limit?: number }): Promise<BookMetadata[]> {
    const limit = options?.limit || 12;
    const q = query.trim();
    if (!q) return [];

    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${limit}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      
      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      if (!data.docs || !Array.isArray(data.docs)) {
        return [];
      }

      return data.docs.map((doc: any) => this.formatOpenLibraryDoc(doc));
    } catch (err) {
      console.warn('Open Library API search timed out or failed:', err);
      return [];
    }
  }

  async getBookDetails(id: string): Promise<BookMetadata | null> {
    try {
      const cleanId = id.replace(/^works\//, '');
      const url = `https://openlibrary.org/works/${encodeURIComponent(cleanId)}.json`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      
      if (!res.ok) return null;
      
      const data = await res.json();
      let description = 'A notable literary work available on Open Library.';
      if (typeof data.description === 'string') {
        description = data.description;
      } else if (data.description && typeof data.description.value === 'string') {
        description = data.description.value;
      }

      const coverId = Array.isArray(data.covers) && data.covers[0] > 0 ? data.covers[0] : null;
      const coverUrl = coverId 
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
        : `https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400`;

      return {
        id: cleanId,
        title: data.title || 'Untitled',
        authors: ['Author on Open Library'],
        description,
        coverUrl,
        categories: Array.isArray(data.subjects) ? data.subjects.slice(0, 3) : ['General Knowledge'],
        externalProvider: 'open_library',
        externalProviderId: cleanId,
      };
    } catch {
      return null;
    }
  }

  private formatOpenLibraryDoc(doc: any): BookMetadata {
    const key = doc.key ? doc.key.replace('/works/', '') : `ol-${Math.random().toString(36).substr(2, 7)}`;
    const coverId = doc.cover_i;
    const coverUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : `https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400`;

    let description = 'A notable work catalogued on Open Library.';
    if (doc.first_sentence) {
      if (Array.isArray(doc.first_sentence) && doc.first_sentence[0]) {
        description = doc.first_sentence[0];
      } else if (typeof doc.first_sentence === 'string') {
        description = doc.first_sentence;
      }
    }

    return {
      id: key,
      title: doc.title || 'Untitled Book',
      authors: Array.isArray(doc.author_name) && doc.author_name.length > 0 ? doc.author_name : ['Unknown Author'],
      description,
      coverUrl,
      publisher: Array.isArray(doc.publisher) ? doc.publisher[0] : doc.publisher,
      publicationYear: doc.first_publish_year || undefined,
      isbn: Array.isArray(doc.isbn) ? doc.isbn[0] : undefined,
      categories: Array.isArray(doc.subject) && doc.subject.length > 0 ? doc.subject.slice(0, 3) : ['General Knowledge'],
      pageCount: doc.number_of_pages_median || undefined,
      rating: doc.ratings_average ? Math.round(doc.ratings_average * 10) / 10 : 4.6,
      externalProvider: 'open_library',
      externalProviderId: key,
    };
  }
}
