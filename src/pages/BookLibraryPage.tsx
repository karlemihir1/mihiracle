import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  Star, 
  RotateCw,
  Filter
} from 'lucide-react';
import { Book, CATEGORIES } from '../types';
import { useStore } from '../lib/store';
import { BookCard } from '../components/books/BookCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { searchBooks } from '../services/api';
import { INITIAL_BOOKS } from '../services/mockData';

export const BookLibraryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const { savedBooks } = useStore();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [viewTab, setViewTab] = useState<'all' | 'saved'>('all');
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (q = query, cat = selectedCategory) => {
    setIsSearching(true);
    try {
      const res = await searchBooks(q, cat === 'All' ? undefined : cat, 12);
      setBooks(res.books || []);
    } catch {
      // Handled in api service
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
    handleSearch(query, cat);
  };

  // Filter if viewTab === 'saved'
  const displayedBooks = viewTab === 'saved'
    ? savedBooks.map(sb => sb.book!).filter(Boolean)
    : books;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy dark:text-white tracking-tight">
            Book Library & Summaries
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted mt-1">
            Explore world-class non-fiction, understand core frameworks, and generate transformative chapter insights.
          </p>
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-brand-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books by title, author, or subject..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-2xl text-sm outline-none focus:border-brand-navy dark:focus:border-brand-mint text-brand-text dark:text-dark-text placeholder:text-brand-muted/70 shadow-2xs min-h-[48px]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSearching}
            className="sm:w-32 font-semibold shadow-xs text-sm min-h-[48px]"
          >
            Search Books
          </Button>
        </form>
      </div>

      {/* Tabs: All Books vs Saved Books */}
      <div className="flex items-center justify-between border-b border-brand-border/60 dark:border-dark-border/60 pb-3 gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setViewTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
              viewTab === 'all'
                ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy shadow-xs'
                : 'text-brand-muted hover:text-brand-text dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => setViewTab('saved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
              viewTab === 'saved'
                ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy shadow-xs'
                : 'text-brand-muted hover:text-brand-text dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Books ({savedBooks.length})</span>
          </button>
        </div>

        <span className="text-xs text-brand-muted dark:text-dark-muted font-medium">
          Showing {displayedBooks.length} books
        </span>
      </div>

      {/* Categories Row */}
      {viewTab === 'all' && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['All', ...CATEGORIES.slice(0, 8)].map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all select-none cursor-pointer min-h-[36px] ${
                  isSelected
                    ? 'bg-brand-navy text-white dark:bg-brand-mint dark:text-brand-navy font-bold shadow-2xs'
                    : 'bg-white dark:bg-dark-surface hover:bg-stone-100 dark:hover:bg-dark-card text-brand-text dark:text-dark-text border border-brand-border dark:border-dark-border'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Books Grid */}
      {isSearching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : displayedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-brand-border dark:border-dark-border">
          <BookOpen className="w-10 h-10 text-brand-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text">
            {viewTab === 'saved' ? 'No saved books yet' : 'No books found'}
          </h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            {viewTab === 'saved'
              ? 'Browse the book catalog and click the bookmark icon to track books you want to read.'
              : 'Try searching for books by title or author like "Atomic Habits" or "Daniel Kahneman".'}
          </p>
        </div>
      )}
    </div>
  );
};
