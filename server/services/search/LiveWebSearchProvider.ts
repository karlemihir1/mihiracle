import { SearchProvider, SearchResult, SearchOptions } from './SearchProvider.js';
import { TavilySearchProvider } from './TavilySearchProvider.js';
import { VERIFIED_SOURCES_CORPUS } from './CuratedSearchProvider.js';

export class LiveWebSearchProvider implements SearchProvider {
  name = 'live-web';
  private tavilyProvider: TavilySearchProvider | null = null;

  constructor(tavilyApiKey?: string) {
    if (tavilyApiKey) {
      this.tavilyProvider = new TavilySearchProvider(tavilyApiKey);
    }
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const q = (query || '').trim();
    if (!q) return [];

    const limit = options?.limit || 6;

    // 1. If Tavily API Key is configured, use live Tavily internet search
    if (this.tavilyProvider) {
      try {
        const tavilyResults = await this.tavilyProvider.search(q, options);
        if (tavilyResults.length > 0) {
          return tavilyResults.slice(0, limit);
        }
      } catch (err) {
        console.warn('Tavily search error, falling back to open web search:', err);
      }
    }

    // 2. Open Live Wikipedia Search API (Free, open, zero auth, covers all human knowledge)
    const liveResults: SearchResult[] = [];
    try {
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
      const res = await fetch(endpoint, {
        headers: { 'User-Agent': 'MihiracleBot/1.0 (https://mihiracle.app)' },
        signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const data = await res.json();
        const items = data?.query?.search || [];
        for (const item of items) {
          const title = item.title || 'Untitled';
          const cleanSnippet = (item.snippet || '').replace(/<[^>]+>/g, '').trim();
          const cleanUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;

          liveResults.push({
            title: title,
            url: cleanUrl,
            snippet: cleanSnippet || `Comprehensive encyclopedia overview and foundational analysis of ${title}.`,
            domain: 'wikipedia.org',
            publisher: 'Wikipedia Encyclopedia',
            publishedDate: item.timestamp ? item.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10),
            score: 0.9,
          });
        }
      }
    } catch (err) {
      console.warn('Live open search error:', err);
    }

    // 3. Match against curated high-yield mental models corpus
    const qLower = q.toLowerCase();
    const curatedMatches = VERIFIED_SOURCES_CORPUS.filter(item => {
      const matchQuery = item.title.toLowerCase().includes(qLower) ||
                         item.snippet.toLowerCase().includes(qLower) ||
                         item.keywords.some(k => qLower.includes(k) || k.includes(qLower));
      const matchCat = !options?.category || options.category === 'all' || 
                       item.category.toLowerCase() === options.category.toLowerCase();
      return matchQuery && matchCat;
    });

    // 4. Merge results prioritizing high-quality matches
    const combined = [...liveResults, ...curatedMatches];
    const seen = new Set<string>();
    const unique: SearchResult[] = [];

    for (const r of combined) {
      const norm = r.title.toLowerCase().trim();
      if (!seen.has(norm)) {
        seen.add(norm);
        unique.push(r);
      }
    }

    return unique.length > 0 ? unique.slice(0, limit) : curatedMatches.slice(0, limit);
  }
}
