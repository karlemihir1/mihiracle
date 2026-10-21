import { SearchProvider, SearchResult, SearchOptions } from './SearchProvider.js';

export class TavilySearchProvider implements SearchProvider {
  name = 'tavily';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    if (!this.apiKey) {
      throw new Error('Tavily API key is missing');
    }

    const limit = options?.limit || 6;
    const body: Record<string, any> = {
      api_key: this.apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: false,
      include_raw_content: false,
      max_results: limit,
    };

    if (options?.timeframe && options.timeframe !== 'any') {
      body.time_range = options.timeframe;
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Tavily search API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const results: SearchResult[] = (data.results || []).map((r: any) => {
      let domain = '';
      try {
        domain = new URL(r.url).hostname.replace(/^www\./, '');
      } catch {
        domain = 'web source';
      }

      return {
        title: r.title || 'Untitled Source',
        url: r.url,
        snippet: r.content || '',
        domain: domain,
        publisher: domain,
        publishedDate: r.published_date || undefined,
        score: r.score,
      };
    });

    return results;
  }
}
