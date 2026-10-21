import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Filter, 
  RotateCw, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Idea, Category, CATEGORIES } from '../types';
import { useStore } from '../lib/store';
import { IdeaCard } from '../components/cards/IdeaCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { UrlImporterCard } from '../components/importer/UrlImporterCard';
import { generateIdeaCards, searchWeb } from '../services/api';

export const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const { allIdeas, addSearchHistory, health } = useStore();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [contentType, setContentType] = useState<'all' | 'insights' | 'academic'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest'>('relevance');

  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discoveredCards, setDiscoveredCards] = useState<Idea[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchProviderName, setSearchProviderName] = useState<string>('');

  // Example suggested searches
  const suggestedSearches = [
    "Cognitive Biases in Decision Making",
    "Architecture of Deep Work",
    "Transformer Attention Mechanisms",
    "Value Investing and Compounding Moats",
    "Stoic Dichotomy of Control",
    "Supply Chain Network Resilience"
  ];

  const handleSearch = async (overrideQuery?: string, overrideCategory?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : query;
    const cat = overrideCategory !== undefined ? overrideCategory : selectedCategory;

    if (!q.trim() && cat === 'All') return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    if (q.trim()) {
      addSearchHistory(q.trim());
    }

    try {
      const res = await generateIdeaCards(q.trim() || cat, undefined, cat === 'All' ? undefined : cat);
      setDiscoveredCards(res.cards || []);
      setSearchProviderName(res.generationModel || 'default');
    } catch (err: any) {
      setError(err.message || 'Failed to discover ideas. Please check connectivity and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
    handleSearch(query, cat);
  };

  // Filter existing library ideas when not in active search
  const displayedIdeas = hasSearched 
    ? discoveredCards 
    : allIdeas.filter(i => {
        if (selectedCategory !== 'All' && i.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        return true;
      });

  // Sort ideas
  const sortedIdeas = [...displayedIdeas].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.discovered_at).getTime() - new Date(a.discovered_at).getTime();
    }
    return 0; // relevance preserves original rank
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header and Live Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy dark:text-white tracking-tight">
            Discover Ideas
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted mt-1">
            Real-time knowledge from credible sources, converted into concise, actionable learning cards.
          </p>
        </div>

        {/* Deepstash-style URL & YouTube Importer Card */}
        <UrlImporterCard />

        {/* Search Input Box */}
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
              placeholder="Search a topic, research question, or mental model..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-2xl text-sm outline-none focus:border-brand-navy dark:focus:border-brand-mint text-brand-text dark:text-dark-text placeholder:text-brand-muted/70 shadow-2xs min-h-[48px]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSearching}
            className="sm:w-36 font-semibold shadow-xs text-sm min-h-[48px]"
          >
            <Sparkles className="w-4 h-4 mr-1.5 fill-current" />
            Discover
          </Button>
        </form>

        {/* Suggested Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-semibold text-brand-muted shrink-0 mr-1">
            Try:
          </span>
          {suggestedSearches.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(s);
                handleSearch(s);
              }}
              className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-white dark:bg-dark-surface hover:bg-stone-100 dark:hover:bg-dark-card border border-brand-border dark:border-dark-border text-brand-text dark:text-dark-text transition-colors select-none cursor-pointer min-h-[32px]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-brand-border/60 dark:border-dark-border/60">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['All', ...CATEGORIES].map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
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

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-brand-muted" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl px-2.5 py-1 text-xs text-brand-text dark:text-dark-text outline-none cursor-pointer min-h-[32px]"
          >
            <option value="relevance">Top Relevance</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Results Header or Status */}
      {hasSearched && (
        <div className="flex items-center justify-between text-xs text-brand-muted dark:text-dark-muted px-1">
          <span>
            Found <strong>{sortedIdeas.length}</strong> structured insights
            {query && <span> for "<em>{query}</em>"</span>}
          </span>
          <button
            onClick={() => {
              setHasSearched(false);
              setQuery('');
              setSelectedCategory('All');
            }}
            className="underline hover:text-brand-text dark:hover:text-dark-text cursor-pointer p-1"
          >
            Reset to feed
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl flex items-start gap-3 text-red-800 dark:text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Discovery notice</p>
            <p>{error}</p>
            <button
              onClick={() => handleSearch()}
              className="mt-1 font-semibold underline cursor-pointer"
            >
              Retry search
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Discovered Cards Grid */}
      {!isSearching && (
        <>
          {sortedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-brand-border dark:border-dark-border">
              <Sparkles className="w-10 h-10 text-brand-muted mx-auto" />
              <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text">
                No matching insights found
              </h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Try searching for broader keywords like "Decision making", "Productivity", or "System design".
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('All');
                  setHasSearched(false);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
