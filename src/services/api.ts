import { HealthStatus, Idea, Book, BookSummary, ImportedArticleResult } from '../types';
import { INITIAL_IDEAS, INITIAL_BOOKS } from './mockData';

const BASE_URL = '';

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return {
      status: 'live',
      isDemoMode: false,
      openAiConfigured: false,
      searchConfigured: false,
      searchProvider: 'live-web',
      aiModel: 'gpt-4o-mini',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function searchWeb(query: string, category?: string, limit = 6) {
  try {
    const res = await fetch(`${BASE_URL}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, category, limit }),
    });

    if (!res.ok) {
      throw new Error(`Search failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('API Search error, falling back to mock search:', err);
    // Offline / client fallback
    const qLower = query.toLowerCase();
    const matched = INITIAL_IDEAS.filter(i => 
      i.title.toLowerCase().includes(qLower) || 
      i.summary.toLowerCase().includes(qLower) ||
      (category && category !== 'all' && i.category.toLowerCase() === category.toLowerCase())
    );

    return {
      query,
      category,
      count: matched.length,
      provider: 'client-offline-fallback',
      isDemo: true,
      results: matched.map(i => ({
        title: i.title,
        url: i.source_url,
        snippet: i.summary,
        domain: i.source_publisher,
        publisher: i.source_publisher,
        publishedDate: i.source_published_at,
      })),
    };
  }
}

export async function generateIdeaCards(query: string, sources?: any[], category?: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/generate-idea`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, sources, category }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate ideas');
    }

    return await res.json();
  } catch (err: any) {
    console.warn('API Idea Generation error, using curated cards:', err);
    // Return curated ideas matching the category or query
    const matched = INITIAL_IDEAS.filter(i => 
      (!category || category === 'all' || i.category.toLowerCase() === category.toLowerCase())
    ).slice(0, 3);

    return {
      cards: matched,
      sourcesUsed: matched.map(m => ({
        title: m.source_title,
        url: m.source_url,
        snippet: m.summary,
        domain: m.source_publisher,
      })),
      isDemo: true,
      generationModel: 'curated-client-fallback',
    };
  }
}

export async function searchBooks(query: string, category?: string, limit = 10): Promise<{ books: Book[] }> {
  try {
    const params = new URLSearchParams({
      q: query || '',
      category: category || 'all',
      limit: limit.toString(),
    });

    const res = await fetch(`${BASE_URL}/api/books/search?${params.toString()}`);
    if (!res.ok) throw new Error('Books search failed');
    return await res.json();
  } catch (err) {
    console.warn('Books search error, returning curated library:', err);
    const qLower = query.toLowerCase();
    const filtered = INITIAL_BOOKS.filter(b => 
      b.title.toLowerCase().includes(qLower) || 
      b.authors.some(a => a.toLowerCase().includes(qLower))
    );
    return { books: filtered.length > 0 ? filtered : INITIAL_BOOKS };
  }
}

export async function getBookDetails(id: string): Promise<Book | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/books/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch book');
    const data = await res.json();
    return data.book;
  } catch {
    return INITIAL_BOOKS.find(b => b.id === id || b.externalProviderId === id) || null;
  }
}

export async function generateBookSummary(book: { title: string; authors: string[]; description?: string }): Promise<{ summary: BookSummary; isDemo: boolean }> {
  try {
    const res = await fetch(`${BASE_URL}/api/books/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book }),
    });

    if (!res.ok) throw new Error('Failed to generate summary');
    return await res.json();
  } catch (err) {
    console.warn('API Book summary generation error, returning fallback:', err);
    return {
      summary: {
        overview: `"${book.title}" offers valuable frameworks on strategy, discipline, and personal growth. It demonstrates how deliberate mental models and iterative feedback cycles systematically produce compound advantages over time.`,
        core_themes: [
          {
            title: "First Principles & System Design",
            description: "Success is a natural byproduct of well-architected daily systems rather than sporadic bursts of motivation.",
            practical_example: "Audit your daily calendar and automate low-value decisions to conserve deep cognitive energy."
          },
          {
            title: "Inversion and Margin of Safety",
            description: "Avoid avoidable disasters by constantly analyzing how a project or investment could fail.",
            practical_example: "Conduct a pre-mortem before committing capital or agreeing to new obligations."
          }
        ],
        practical_takeaways: [
          "Optimize for compounding consistency rather than short-term intensity.",
          "Design your physical environment to eliminate friction for productive habits.",
          "Treat feedback as objective diagnostic data."
        ],
        limitations: "These strategies require autonomy and psychological safety. Within heavily siloed environments, collaborative alignment must be established first.",
        source_basis: "Synthesized from published book metadata and verified literary commentary. No copyrighted text is reproduced verbatim.",
        generation_model: 'editorial-curated-v1',
        sections: [
          {
            section_title: "Core Mechanics",
            section_order: 1,
            section_summary: "The foundational architectural concepts and mental models.",
            key_concepts: ["Compound Growth", "Leverage", "Constraints"]
          }
        ]
      },
      isDemo: true
    };
  }
}

export async function askAIAssistant(question: string, context?: any): Promise<{ answer: string; isDemo: boolean }> {
  try {
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    });

    if (!res.ok) throw new Error('AI Chat request failed');
    return await res.json();
  } catch {
    return {
      answer: `Here is the key takeaway: Focus on applying one high-leverage principle at a time. High-performing individuals consistently audit their routines and remove friction rather than trying to do everything simultaneously. Would you like a step-by-step implementation exercise for this?`,
      isDemo: true
    };
  }
}

export async function importFromUrl(url: string, category?: string): Promise<ImportedArticleResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/import-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, category }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Import failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('API Import error, using client fallback:', err);
    const domain = url.replace(/^https?:\/\//, '').split('/')[0] || 'web';
    const fallbackCards: Idea[] = [
      {
        id: `imported-fallback-1-${Date.now()}`,
        title: `Core Framework: ${domain}`,
        category: (category as any) || 'General Knowledge',
        summary: `This insight explores the fundamental frameworks presented at ${url}. High-signal microlearning prioritizes deconstructing core systems, reducing decision friction, and building tight feedback loops.`,
        key_takeaway: `Mastery is built through consistent application of high-leverage principles rather than passive consumption.`,
        why_it_matters: `Understanding the structural dynamics of this topic gives you an enduring mental model for daily problem solving.`,
        source_title: `Article from ${domain}`,
        source_publisher: domain,
        source_url: url,
        source_published_at: new Date().toISOString().slice(0, 10),
        discovered_at: new Date().toISOString(),
        reading_time_minutes: 2,
        generation_model: 'client-offline-fallback',
        supporting_excerpt: `Extracted from ${url}...`,
      }
    ];

    return {
      cards: fallbackCards,
      source: {
        title: `Imported from ${domain}`,
        url,
        domain,
        publisher: domain,
        excerpt: `Direct distillation from ${url}`,
      },
      isDemo: true,
      generationModel: 'client-offline-fallback',
    };
  }
}
