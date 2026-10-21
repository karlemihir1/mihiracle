import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Bookmark, 
  Folder, 
  X, 
  History, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../lib/store';
import { IdeaCard } from '../components/cards/IdeaCard';
import { BookCard } from '../components/books/BookCard';
import { StashCard } from '../components/stash/StashCard';
import { Button } from '../components/ui/Button';
import { searchBooks, generateIdeaCards } from '../services/api';
import { INITIAL_BOOKS } from '../services/mockData';
import { Idea, Book } from '../types';

export const SearchPage: React.FC = () => {
  const { 
    allIdeas, 
    savedIdeas, 
    savedBooks, 
    stashes, 
    searchHistory, 
    addSearchHistory, 
    clearSearchHistory, 
    removeSearchHistoryItem 
  } = useStore();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'ideas' | 'books' | 'library'>('all');
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webResults, setWebResults] = useState<Idea[]>([]);
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);

  const handleSearchSubmit = async (searchQuery: string = query) => {
    const q = searchQuery.trim();
    if (!q) return;

    addSearchHistory(q);
    setIsSearchingWeb(true);
    try {
      const [ideaRes, bookRes] = await Promise.allSettled([
        generateIdeaCards(q),
        searchBooks(q, undefined, 12)
      ]);

      if (ideaRes.status === 'fulfilled') {
        setWebResults(ideaRes.value.cards || []);
      }
      if (bookRes.status === 'fulfilled') {
        setSearchedBooks(bookRes.value.books || []);
      }
    } catch {
      // Handled in api
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const qLower = query.toLowerCase().trim();

  // Search existing ideas
  const matchedIdeas = allIdeas.filter(i => {
    if (!qLower) return true;
    return i.title.toLowerCase().includes(qLower) || 
           i.summary.toLowerCase().includes(qLower) || 
           i.category.toLowerCase().includes(qLower);
  });

  // Combine with web results
  const combinedIdeas = [...webResults, ...matchedIdeas.filter(m => !webResults.some(w => w.title === m.title))];

  // Search books: combine live searched books, saved books, and initial catalog avoiding duplicates
  const allBookCandidates = useMemo(() => {
    const saved = savedBooks.map(sb => sb.book!).filter(Boolean);
    const list = [...searchedBooks, ...saved, ...INITIAL_BOOKS];
    const seen = new Set<string>();
    const unique: Book[] = [];
    for (const b of list) {
      const key = (b.id || b.title).toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(b);
      }
    }
    return unique;
  }, [searchedBooks, savedBooks]);

  const matchedBooks = useMemo(() => {
    if (!qLower) return allBookCandidates.slice(0, 10);
    return allBookCandidates.filter(b => 
      b.title.toLowerCase().includes(qLower) || 
      b.authors.some(a => a.toLowerCase().includes(qLower)) ||
      (b.categories && b.categories.some(c => c.toLowerCase().includes(qLower)))
    );
  }, [allBookCandidates, qLower]);

  // Search personal stashes
  const matchedStashes = stashes.filter(s => {
    if (!qLower) return true;
    return s.name.toLowerCase().includes(qLower) || (s.description && s.description.toLowerCase().includes(qLower));
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header & Global Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy dark:text-white tracking-tight">
            Search
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted mt-1">
            Search across your saved stashes, book catalog, ideas, or query live internet sources.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
          className="relative"
        >
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-brand-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a topic, book title, author, or research question..."
            autoFocus
            className="w-full pl-11 pr-24 py-3 bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-2xl text-sm outline-none focus:border-brand-navy dark:focus:border-brand-mint text-brand-text dark:text-dark-text placeholder:text-brand-muted/70 shadow-2xs min-h-[48px]"
          />
          <div className="absolute right-2 top-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSearchingWeb}
              className="text-xs font-semibold px-3 min-h-[36px]"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Search History Chips */}
        {searchHistory.length > 0 && !query && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-brand-muted dark:text-dark-muted">
              <span className="flex items-center gap-1 font-semibold">
                <History className="w-3.5 h-3.5" /> Recent Searches
              </span>
              <button
                onClick={clearSearchHistory}
                className="hover:underline text-[11px] cursor-pointer"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {searchHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-full text-xs text-brand-text dark:text-dark-text hover:bg-stone-50 transition-colors"
                >
                  <span
                    onClick={() => {
                      setQuery(item);
                      handleSearchSubmit(item);
                    }}
                    className="cursor-pointer"
                  >
                    {item}
                  </span>
                  <button
                    onClick={() => removeSearchHistoryItem(item)}
                    className="text-brand-muted hover:text-brand-text p-0.5"
                    aria-label="Remove search item"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 border-b border-brand-border/60 dark:border-dark-border/60 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'ideas', label: `Ideas (${combinedIdeas.length})` },
          { id: 'books', label: `Books (${matchedBooks.length})` },
          { id: 'library', label: `Collections (${matchedStashes.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[36px] ${
              activeTab === tab.id
                ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy shadow-xs'
                : 'text-brand-muted hover:text-brand-text dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Results Display */}
      <div className="space-y-6">
        {/* Collections Section */}
        {(activeTab === 'all' || activeTab === 'library') && matchedStashes.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-dark-muted flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5" />
              Collections in My Stash ({matchedStashes.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {matchedStashes.map(stash => (
                <StashCard key={stash.id} stash={stash} />
              ))}
            </div>
          </section>
        )}

        {/* Ideas Section */}
        {(activeTab === 'all' || activeTab === 'ideas') && combinedIdeas.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-dark-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Idea Cards ({combinedIdeas.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {combinedIdeas.map(idea => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </section>
        )}

        {/* Books Section */}
        {(activeTab === 'all' || activeTab === 'books') && matchedBooks.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-dark-muted flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Books ({matchedBooks.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {combinedIdeas.length === 0 && matchedBooks.length === 0 && matchedStashes.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-brand-border dark:border-dark-border">
            <Search className="w-10 h-10 text-brand-muted mx-auto" />
            <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text">
              No results found
            </h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Try searching with broader terms or tap "Discover" to query external live web research.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
