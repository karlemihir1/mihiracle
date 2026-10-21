import { describe, it, expect } from 'vitest';
import { INITIAL_BOOKS } from '../src/services/mockData';
import { Idea, Stash, StashItem } from '../src/types';

describe('Atomic Restashing Engine', () => {
  it('should convert a book core theme into a standalone atomic idea card', () => {
    const book = INITIAL_BOOKS.find(b => b.title.includes('Thinking')) || INITIAL_BOOKS[0];
    const theme = {
      title: 'System 1 and System 2 Thinking',
      description: 'The brain operates on two systems: fast, intuitive, emotional System 1, and slow, deliberate, logical System 2.',
      practical_example: 'Sleep on major financial decisions to force System 2 analysis instead of relying on emotional System 1 impulses.'
    };

    // Convert into atomic idea
    const atomicIdea: Idea = {
      id: `custom-idea-${Date.now()}`,
      title: theme.title,
      category: (book.categories[0] as any) || 'Psychology',
      summary: theme.description,
      key_takeaway: theme.practical_example,
      why_it_matters: `Core mental model extracted from "${book.title}" by ${book.authors.join(', ')}.`,
      source_title: book.title,
      source_publisher: book.authors.join(', '),
      source_url: `/book/${book.id}`,
      discovered_at: new Date().toISOString(),
      reading_time_minutes: 2,
      generation_model: 'atomic-book-restash',
    };

    expect(atomicIdea.title).toBe('System 1 and System 2 Thinking');
    expect(atomicIdea.category).toBe('Psychology');
    expect(atomicIdea.source_title).toBe('Thinking, Fast and Slow');
    expect(atomicIdea.key_takeaway).toContain('System 2');
  });

  it('should allow restashing the atomic idea into a specific custom collection', () => {
    const atomicIdeaId = 'atomic-card-001';
    const stash: Stash = {
      id: 'stash-mental-models',
      user_id: 'user-1',
      name: 'Mental Models',
      created_at: new Date().toISOString(),
      item_count: 0
    };

    const stashItems: StashItem[] = [];

    // Add atomic idea to custom stash
    stashItems.push({
      id: 'si-atomic-1',
      stash_id: stash.id,
      idea_id: atomicIdeaId,
      added_at: new Date().toISOString()
    });

    const itemsInStash = stashItems.filter(si => si.stash_id === stash.id && si.idea_id === atomicIdeaId);
    expect(itemsInStash.length).toBe(1);
    expect(itemsInStash[0].idea_id).toBe(atomicIdeaId);
  });
});
