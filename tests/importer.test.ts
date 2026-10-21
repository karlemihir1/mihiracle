import { describe, it, expect } from 'vitest';
import { ArticleExtractor } from '../server/services/extractor/ArticleExtractor';
import { CuratedAIService } from '../server/services/ai/CuratedAIService';

describe('URL Article & Video Importer Engine', () => {
  it('should correctly identify YouTube URLs', () => {
    expect(ArticleExtractor.isYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
    expect(ArticleExtractor.isYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
    expect(ArticleExtractor.isYouTubeUrl('https://youtube.com/shorts/abcdef123')).toBe(true);
    expect(ArticleExtractor.isYouTubeUrl('https://paulgraham.com/lesson.html')).toBe(false);
    expect(ArticleExtractor.isYouTubeUrl('https://en.wikipedia.org/wiki/Attention_Is_All_You_Need')).toBe(false);
  });

  it('should cleanly extract domain names', () => {
    expect(ArticleExtractor.getDomain('https://www.paulgraham.com/lesson.html')).toBe('paulgraham.com');
    expect(ArticleExtractor.getDomain('https://sub.medium.com/post/123')).toBe('sub.medium.com');
    expect(ArticleExtractor.getDomain('https://youtube.com/watch?v=123')).toBe('youtube.com');
  });

  it('should reject invalid non-http/https URLs', async () => {
    await expect(ArticleExtractor.extract('ftp://invalid-url.com')).rejects.toThrow();
    await expect(ArticleExtractor.extract('just-a-search-string')).rejects.toThrow();
  });

  it('should distill article content into 3 atomic idea cards via AI service', async () => {
    const ai = new CuratedAIService();
    const article = {
      title: 'How to Think in First Principles',
      text: 'First principles thinking is the act of boiling a process down to the most fundamental truths that you know, then reasoning up from there.\n\nFriction in daily workflows compounds into massive systemic drag. Auditing routines regularly eliminates unneeded bureaucracy.\n\nFeedback loops are vital. Without immediate diagnostic data, organizations build blind spots.',
      url: 'https://fs.blog/first-principles/',
      domain: 'fs.blog',
      publisher: 'Farnam Street',
      category: 'Philosophy',
    };

    const cards = await ai.generateIdeaCardsFromArticle(article);

    expect(cards.length).toBe(3);
    expect(cards[0].title).toContain('Core Thesis');
    expect(cards[0].category).toBe('Philosophy');
    expect(cards[0].source_url).toBe('https://fs.blog/first-principles/');
    expect(cards[0].key_takeaway).toBeDefined();
    expect(cards[0].why_it_matters).toBeDefined();
    expect(cards[0].reading_time_minutes).toBeGreaterThanOrEqual(1);
  });
});
