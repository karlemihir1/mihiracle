import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Folder, 
  Sparkles, 
  Trash2, 
  X, 
  Search, 
  BookOpen, 
  Bookmark,
  Share2
} from 'lucide-react';
import { useStore } from '../lib/store';
import { IdeaCard } from '../components/cards/IdeaCard';
import { BookCard } from '../components/books/BookCard';
import { Button } from '../components/ui/Button';

export const StashDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    stashes, 
    stashItems, 
    removeItemFromStash, 
    deleteStash,
    setActiveContextItem,
    setAIAssistantOpen 
  } = useStore();

  const [query, setQuery] = useState('');

  const stash = stashes.find(s => s.id === id);
  if (!stash) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-brand-muted">Collection not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/stash')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Stash
        </Button>
      </div>
    );
  }

  // Get items in this stash
  const items = stashItems.filter(si => si.stash_id === stash.id);

  // Filter items by query
  const filteredItems = items.filter(si => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const ideaTitle = si.idea?.title.toLowerCase() || '';
    const bookTitle = si.book?.title.toLowerCase() || '';
    return ideaTitle.includes(q) || bookTitle.includes(q);
  });

  const handleAskAI = () => {
    const summaryList = items.map((si, idx) => {
      if (si.idea) return `${idx + 1}. Idea: ${si.idea.title} - ${si.idea.key_takeaway}`;
      if (si.book) return `${idx + 1}. Book: ${si.book.title} by ${si.book.authors.join(', ')}`;
      return '';
    }).join('\n');

    setActiveContextItem({
      type: 'stash',
      title: stash.name,
      content: `Stash Description: ${stash.description || 'N/A'}\nItems in this collection:\n${summaryList}`
    });
    setAIAssistantOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 border-b border-brand-border/60 dark:border-dark-border/60 pb-3">
        <button
          onClick={() => navigate('/stash')}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-text dark:text-dark-muted dark:hover:text-dark-text transition-colors p-2 -ml-2 rounded-xl min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Stash</span>
        </button>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={handleAskAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-mint text-brand-navy font-bold text-xs hover:bg-brand-mint-dark transition-all cursor-pointer min-h-[40px] shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Synthesize with AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Stash Header Hero Box */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-card space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-mint/30 dark:bg-brand-mint/15 text-brand-navy dark:text-brand-mint flex items-center justify-center">
          <Folder className="w-6 h-6 fill-current/20" />
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white tracking-tight">
            {stash.name}
          </h1>
          {stash.description && (
            <p className="text-sm text-brand-text/80 dark:text-dark-text/80 mt-1 leading-relaxed">
              {stash.description}
            </p>
          )}
        </div>

        <div className="pt-2 flex items-center gap-4 text-xs font-medium text-brand-muted dark:text-dark-muted">
          <span>{items.length} {items.length === 1 ? 'item' : 'items'} saved</span>
          <span>• Created {new Date(stash.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Search within Stash */}
      {items.length > 2 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items in this stash..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-xs text-brand-text dark:text-dark-text outline-none focus:border-brand-navy dark:focus:border-brand-mint min-h-[40px]"
          />
        </div>
      )}

      {/* Items List */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((si) => (
            <div key={si.id} className="relative group">
              {si.idea && <IdeaCard idea={si.idea} />}
              {si.book && <BookCard book={si.book} />}

              {/* Remove from this stash button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItemFromStash(stash.id, { ideaId: si.idea_id, bookId: si.book_id });
                }}
                className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-dark-surface/90 hover:bg-red-50 dark:hover:bg-red-950/40 text-brand-muted hover:text-red-600 rounded-lg shadow-xs opacity-0 group-hover:opacity-100 transition-opacity min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer border border-brand-border/60 dark:border-dark-border/60"
                title="Remove item from this stash"
                aria-label="Remove item"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-brand-border dark:border-dark-border">
          <Folder className="w-10 h-10 text-brand-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text">
            This collection is empty
          </h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Browse the Discover feed or Book Library and tap the folder icon on any card to add it here.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/discover')}
          >
            Discover Ideas
          </Button>
        </div>
      )}
    </div>
  );
};
