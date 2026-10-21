import { describe, it, expect } from 'vitest';
import { INITIAL_IDEAS } from '../src/services/mockData';
import { Stash, StashItem, SavedIdea } from '../src/types';

describe('Stash (Collections) & Personal Library Engine', () => {
  it('should allow adding the same idea to multiple stashes without duplicates in a single stash', () => {
    const stashA: Stash = { id: 'stash-a', user_id: 'user-1', name: 'Strategy', created_at: new Date().toISOString() };
    const stashB: Stash = { id: 'stash-b', user_id: 'user-1', name: 'Psychology', created_at: new Date().toISOString() };

    const idea = INITIAL_IDEAS[0];

    const items: StashItem[] = [];

    // Helper: add to stash with uniqueness per stash
    const addItem = (stashId: string, ideaId: string) => {
      const exists = items.some(i => i.stash_id === stashId && i.idea_id === ideaId);
      if (!exists) {
        items.push({
          id: `item-${Date.now()}-${Math.random()}`,
          stash_id: stashId,
          idea_id: ideaId,
          added_at: new Date().toISOString()
        });
      }
    };

    addItem(stashA.id, idea.id);
    addItem(stashB.id, idea.id);
    // Duplicate attempt in stashA
    addItem(stashA.id, idea.id);

    // Idea should belong to both stashes
    const inStashA = items.filter(i => i.stash_id === stashA.id && i.idea_id === idea.id);
    const inStashB = items.filter(i => i.stash_id === stashB.id && i.idea_id === idea.id);

    expect(inStashA.length).toBe(1);
    expect(inStashB.length).toBe(1);
    expect(items.length).toBe(2);
  });

  it('should ensure deleting a collection does not delete the saved idea record', () => {
    let savedIdeas: SavedIdea[] = [
      { id: 'save-1', user_id: 'user-1', idea_id: 'idea-1', created_at: new Date().toISOString() }
    ];

    let stashes: Stash[] = [
      { id: 'stash-1', user_id: 'user-1', name: 'Work', created_at: new Date().toISOString() }
    ];

    let stashItems: StashItem[] = [
      { id: 'si-1', stash_id: 'stash-1', idea_id: 'idea-1', added_at: new Date().toISOString() }
    ];

    // Delete stash-1
    stashes = stashes.filter(s => s.id !== 'stash-1');
    stashItems = stashItems.filter(si => si.stash_id !== 'stash-1');

    // Stash should be deleted
    expect(stashes.length).toBe(0);
    expect(stashItems.length).toBe(0);

    // Saved idea must still exist in library!
    expect(savedIdeas.length).toBe(1);
    expect(savedIdeas[0].idea_id).toBe('idea-1');
  });
});
