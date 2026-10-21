import { SearchResult } from '../search/SearchProvider.js';

export interface GeneratedIdea {
  title: string;
  category: string;
  summary: string;
  key_takeaway: string;
  why_it_matters: string;
  source_title: string;
  source_publisher: string;
  source_url: string;
  source_published_at?: string;
  reading_time_minutes: number;
  generation_model: string;
  supporting_excerpt?: string;
}

export interface GeneratedBookSummary {
  overview: string;
  core_themes: Array<{
    title: string;
    description: string;
    practical_example: string;
  }>;
  practical_takeaways: string[];
  limitations: string;
  source_basis: string;
  generation_model: string;
  sections: Array<{
    section_title: string;
    section_order: number;
    section_summary: string;
    key_concepts: string[];
  }>;
}

export interface AIContext {
  type?: 'idea' | 'book' | 'stash' | 'general';
  itemTitle?: string;
  itemCategory?: string;
  itemContent?: string;
  sourceUrl?: string;
  additionalContext?: string;
}

export interface AIProvider {
  name: string;
  generateIdeaCards(sources: SearchResult[], query: string): Promise<GeneratedIdea[]>;
  generateBookSummary(book: { title: string; authors: string[]; description?: string }): Promise<GeneratedBookSummary>;
  generateIdeaCardsFromArticle(article: {
    title: string;
    text: string;
    url: string;
    domain: string;
    publisher: string;
    category?: string;
  }): Promise<GeneratedIdea[]>;
  answerQuestion(question: string, context?: AIContext): Promise<string>;
}
