import { describe, it, expect } from 'vitest';
import { CuratedBooksProvider } from '../server/services/books/CuratedBooksProvider';
import { CuratedAIService } from '../server/services/ai/CuratedAIService';

describe('Book Library & Summaries Engine', () => {
  it('should search books and find relevant titles', async () => {
    const provider = new CuratedBooksProvider();
    const results = await provider.searchBooks('habits');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Atomic Habits');
    expect(results[0].authors).toContain('James Clear');
  });

  it('should get book details by id', async () => {
    const provider = new CuratedBooksProvider();
    const book = await provider.getBookDetails('curated-atomic-habits');
    expect(book).not.toBeNull();
    expect(book?.isbn).toBe('9780735211292');
  });

  it('should generate structured transformative book summaries with copyright disclosures', async () => {
    const aiService = new CuratedAIService();
    const summary = await aiService.generateBookSummary({
      title: 'Atomic Habits',
      authors: ['James Clear'],
      description: 'Book on building habits.'
    });

    expect(summary.overview).toBeTruthy();
    expect(summary.core_themes.length).toBeGreaterThanOrEqual(4);
    expect(summary.practical_takeaways.length).toBeGreaterThanOrEqual(3);
    expect(summary.limitations).toBeTruthy();
    expect(summary.source_basis).toContain('No copyrighted text');
    expect(summary.sections.length).toBeGreaterThanOrEqual(3);
  });
});
