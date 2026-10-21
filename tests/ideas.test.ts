import { describe, it, expect } from 'vitest';
import { INITIAL_IDEAS } from '../src/services/mockData';
import { CuratedAIService } from '../server/services/ai/CuratedAIService';
import { CuratedSearchProvider } from '../server/services/search/CuratedSearchProvider';

describe('Ideas & Discovery Engine', () => {
  it('should have initial verified ideas across diverse categories', () => {
    expect(INITIAL_IDEAS.length).toBeGreaterThanOrEqual(6);
    const categories = new Set(INITIAL_IDEAS.map(i => i.category));
    expect(categories.size).toBeGreaterThanOrEqual(4);
  });

  it('should ensure every idea contains verified source information and valid URLs', () => {
    INITIAL_IDEAS.forEach(idea => {
      expect(idea.title).toBeTruthy();
      expect(idea.summary).toBeTruthy();
      expect(idea.key_takeaway).toBeTruthy();
      expect(idea.why_it_matters).toBeTruthy();
      expect(idea.source_title).toBeTruthy();
      expect(idea.source_publisher).toBeTruthy();
      expect(idea.source_url).toMatch(/^https?:\/\//);
      expect(idea.reading_time_minutes).toBeGreaterThan(0);
    });
  });

  it('should search curated corpus and return grounded results', async () => {
    const searchProvider = new CuratedSearchProvider();
    const results = await searchProvider.search('bias');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].url).toContain('hbr.org');
  });

  it('should generate structured idea cards with takeaways and source citations', async () => {
    const searchProvider = new CuratedSearchProvider();
    const aiService = new CuratedAIService();

    const sources = await searchProvider.search('deep work');
    expect(sources.length).toBeGreaterThan(0);

    const cards = await aiService.generateIdeaCards(sources, 'deep work');
    expect(cards.length).toBe(sources.length);
    expect(cards[0].key_takeaway).toBeTruthy();
    expect(cards[0].source_url).toBe(sources[0].url);
    expect(cards[0].why_it_matters).toBeTruthy();
  });
});
