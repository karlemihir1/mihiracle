export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  publisher?: string;
  publishedDate?: string;
  score?: number;
}

export interface SearchOptions {
  category?: string;
  limit?: number;
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'any';
}

export interface SearchProvider {
  name: string;
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
