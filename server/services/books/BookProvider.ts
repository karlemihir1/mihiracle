export interface BookMetadata {
  id: string;
  title: string;
  authors: string[];
  description: string;
  coverUrl: string;
  publisher?: string;
  publicationYear?: number;
  isbn?: string;
  categories: string[];
  pageCount?: number;
  rating?: number;
  externalProvider: string;
  externalProviderId: string;
}

export interface BookProvider {
  name: string;
  searchBooks(query: string, options?: { category?: string; limit?: number }): Promise<BookMetadata[]>;
  getBookDetails(id: string): Promise<BookMetadata | null>;
}
