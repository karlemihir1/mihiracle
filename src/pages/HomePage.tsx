import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Bookmark, 
  Compass, 
  TrendingUp,
  History,
  Folder
} from 'lucide-react';
import { useStore } from '../lib/store';
import { CATEGORIES, Category } from '../types';
import { DailyIdeaCard } from '../components/cards/DailyIdeaCard';
import { IdeaCard } from '../components/cards/IdeaCard';
import { BookCard } from '../components/books/BookCard';
import { StashCard } from '../components/stash/StashCard';
import { DailyHabitWidget } from '../components/habit/DailyHabitWidget';
import { INITIAL_BOOKS } from '../services/mockData';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    profile, 
    allIdeas, 
    savedIdeas, 
    savedBooks, 
    stashes, 
    recentActivity,
    streak,
    setDiscoverModalOpen 
  } = useStore();

  // Greeting based on current time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const userName = profile?.display_name || 'Learner';

  // Stable date string 'YYYY-MM-DD'
  const todayDateStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  // Formatted date label, e.g. "Tuesday, October 13"
  const formattedTodayDate = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Section B: 2 Ideas Everyday (Morning Spark & Evening Wisdom)
  // Deterministically selects 2 distinct ideas rotating every calendar day based on date hash
  const [morningIdea, eveningIdea] = useMemo(() => {
    if (allIdeas.length === 0) return [null, null];
    if (allIdeas.length === 1) return [allIdeas[0], allIdeas[0]];

    let hash = 0;
    for (let i = 0; i < todayDateStr.length; i++) {
      hash = (hash * 31 + todayDateStr.charCodeAt(i)) >>> 0;
    }
    const idx1 = hash % allIdeas.length;
    let idx2 = (hash * 7 + 13) % allIdeas.length;
    if (idx2 === idx1) {
      idx2 = (idx1 + 1) % allIdeas.length;
    }
    return [allIdeas[idx1], allIdeas[idx2]];
  }, [allIdeas, todayDateStr]);

  // Section C: Continue Exploring (excluding today's 2 daily ideas)
  const recommendedIdeas = useMemo(() => {
    const dailyIds = new Set([morningIdea?.id, eveningIdea?.id].filter(Boolean));
    const pool = allIdeas.filter(i => !dailyIds.has(i.id));

    const userInterests = profile?.interests || [];
    if (userInterests.length > 0) {
      const matched = pool.filter(i => userInterests.includes(i.category));
      if (matched.length >= 2) return matched.slice(0, 6);
    }
    return pool.slice(0, 6);
  }, [allIdeas, profile, morningIdea, eveningIdea]);

  // Section G: Book of the Day
  const bookOfTheDay = INITIAL_BOOKS[0];

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {/* SECTION A: Greeting & Prominent Global Search Field */}
      <section className="space-y-4">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-brand-muted dark:text-dark-muted uppercase tracking-wider">
            {greeting}, {userName}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-navy dark:text-white tracking-tight mt-0.5">
            What would you like to learn today?
          </h1>
        </div>

        {/* Global Search Bar */}
        <div 
          onClick={() => navigate('/search')}
          className="relative bg-[#161822] border border-[#262A38] rounded-2xl p-3 sm:p-3.5 shadow-xl hover:border-[#D4FF00]/50 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 text-[#8E92A4] flex-1 pr-2">
            <Search className="w-5 h-5 text-[#8E92A4] group-hover:text-[#D4FF00] transition-colors" />
            <span className="text-sm truncate">
              Search ideas, theories, books, or ask AI...
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-white/5 rounded-lg font-semibold text-[#D4FF00] border border-white/10 shrink-0">
            Search
          </span>
        </div>

        {/* HERO FEATURE: Discover New Ideas & Theories (Capi Creative Styled) */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#161824] via-[#1B1E2D] to-[#12141D] border border-white/10 p-5 sm:p-7 shadow-2xl">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#D4FF00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 tracking-wide uppercase">
                  ⚡ Breakthrough Theories
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4FF00]/15 text-[#D4FF00]">
                  New
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Expand your perception with transformative mental models
              </h2>
              <p className="text-xs sm:text-sm text-[#8E92A4] leading-relaxed">
                Explore deep scientific paradigms, philosophical paradoxes, and counter-intuitive insights designed for fast microlearning.
              </p>
            </div>

            {/* The Main On-Screen Discover Button */}
            <button
              onClick={() => setDiscoverModalOpen(true)}
              className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#D4FF00] hover:bg-[#c2eb00] text-black font-extrabold text-sm shadow-[0_0_25px_rgba(212,255,0,0.4)] active:scale-95 transition-all cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 text-black fill-black group-hover:rotate-12 transition-transform" />
              <span>Discover New Ideas & Theories</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[2.5px] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Habit Streak & Daily Goal Tracker (Deepstash Style) */}
      <section>
        <DailyHabitWidget />
      </section>

      {/* SECTION B: Today's 2 Daily Discoveries (Morning & Evening) */}
      {(morningIdea || eveningIdea) && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-navy/10 dark:bg-brand-mint/10 flex items-center justify-center text-brand-navy dark:text-brand-mint shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-serif text-brand-text dark:text-dark-text tracking-tight flex items-center gap-2">
                  Today's 2 Daily Ideas
                  <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-brand-mint/25 text-brand-navy dark:text-brand-mint border border-brand-mint/30">
                    {streak.today_completed_ids.length}/2 Read Today
                  </span>
                </h2>
                <p className="text-xs text-brand-muted dark:text-dark-muted">
                  {formattedTodayDate} • Rotating daily insights to build your learning streak
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {morningIdea && (
              <DailyIdeaCard 
                idea={morningIdea} 
                slotLabel="Morning Spark • Idea 1 of 2" 
                badgeLabel="Morning Spark • Idea 1 of 2"
              />
            )}
            {eveningIdea && (
              <DailyIdeaCard 
                idea={eveningIdea} 
                slotLabel="Evening Wisdom • Idea 2 of 2" 
                badgeLabel="Evening Wisdom • Idea 2 of 2"
              />
            )}
          </div>
        </section>
      )}

      {/* SECTION C: Continue Exploring (Personalized Recommended Ideas) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-navy dark:text-brand-mint" />
            <h2 className="text-lg sm:text-xl font-bold font-serif text-brand-text dark:text-dark-text tracking-tight">
              Continue Exploring
            </h2>
          </div>
          <button
            onClick={() => navigate('/discover')}
            className="text-xs font-semibold text-brand-navy dark:text-brand-mint hover:underline flex items-center gap-1 cursor-pointer"
          >
            Explore all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal scrollable row on mobile, 2-col or 3-col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>

      {/* SECTION D: Pick Up Where You Left Off (Recently Viewed Ideas & Books) */}
      {recentActivity.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-navy dark:text-brand-mint" />
            <h2 className="text-lg sm:text-xl font-bold font-serif text-brand-text dark:text-dark-text tracking-tight">
              Pick Up Where You Left Off
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentActivity.slice(0, 3).map((act) => {
              if (act.idea) {
                return (
                  <div
                    key={act.id}
                    onClick={() => navigate(`/idea/${act.idea?.id}`)}
                    className="p-3.5 bg-white dark:bg-dark-surface rounded-2xl border border-brand-border dark:border-dark-border hover:border-brand-navy dark:hover:border-brand-mint shadow-2xs hover:shadow-card transition-all cursor-pointer flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-brand-mint/30 dark:bg-brand-mint/10 text-brand-navy dark:text-brand-mint flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1">
                      <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                        {act.idea.category}
                      </p>
                      <h4 className="text-xs font-bold text-brand-text dark:text-dark-text truncate">
                        {act.idea.title}
                      </h4>
                    </div>
                  </div>
                );
              }
              if (act.book) {
                return (
                  <div
                    key={act.id}
                    onClick={() => navigate(`/book/${act.book?.id}`)}
                    className="p-3.5 bg-white dark:bg-dark-surface rounded-2xl border border-brand-border dark:border-dark-border hover:border-brand-navy dark:hover:border-brand-mint shadow-2xs hover:shadow-card transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={act.book.coverUrl}
                      alt={act.book.title}
                      className="w-8 h-11 object-cover rounded-md shadow-xs shrink-0"
                    />
                    <div className="truncate flex-1">
                      <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                        Book
                      </p>
                      <h4 className="text-xs font-bold text-brand-text dark:text-dark-text truncate">
                        {act.book.title}
                      </h4>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </section>
      )}

      {/* SECTION E: Explore Topics (13 Visual Category Topic Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-navy dark:text-brand-mint" />
            <h2 className="text-lg sm:text-xl font-bold font-serif text-brand-text dark:text-dark-text tracking-tight">
              Explore Topics
            </h2>
          </div>
          <span className="text-xs text-brand-muted dark:text-dark-muted font-medium">
            {CATEGORIES.length} Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
          {CATEGORIES.map((category) => (
            <div
              key={category}
              onClick={() => navigate(`/discover?category=${encodeURIComponent(category)}`)}
              className="p-3.5 bg-white dark:bg-dark-surface rounded-2xl border border-brand-border dark:border-dark-border hover:border-brand-navy dark:hover:border-brand-mint hover:shadow-card transition-all duration-200 cursor-pointer flex items-center justify-between group"
            >
              <span className="text-xs font-bold text-brand-text dark:text-dark-text group-hover:text-brand-navy dark:group-hover:text-brand-mint transition-colors">
                {category}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-navy dark:group-hover:text-brand-mint group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION F: Your Stash Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-brand-navy dark:text-brand-mint" />
            <h2 className="text-lg sm:text-xl font-bold font-serif text-brand-text dark:text-dark-text tracking-tight">
              Your Stash
            </h2>
          </div>
          <button
            onClick={() => navigate('/stash')}
            className="text-xs font-semibold text-brand-navy dark:text-brand-mint hover:underline flex items-center gap-1 cursor-pointer"
          >
            Open library ({savedIdeas.length + savedBooks.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stashes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stashes.slice(0, 2).map((stash) => (
              <StashCard key={stash.id} stash={stash} />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-dashed border-brand-border dark:border-dark-border text-center space-y-2">
            <Folder className="w-8 h-8 text-brand-muted mx-auto" />
            <h4 className="text-sm font-bold text-brand-text dark:text-dark-text">Your library is waiting</h4>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Save idea cards or books to create custom learning collections.
            </p>
          </div>
        )}
      </section>

      {/* SECTION G: Book of the Day */}
      {bookOfTheDay && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-navy dark:text-brand-mint" />
              <h2 className="text-lg sm:text-xl font-bold font-serif text-brand-text dark:text-dark-text tracking-tight">
                Book of the Day
              </h2>
            </div>
            <button
              onClick={() => navigate('/books')}
              className="text-xs font-semibold text-brand-navy dark:text-brand-mint hover:underline flex items-center gap-1 cursor-pointer"
            >
              Browse all books <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <BookCard book={bookOfTheDay} />
        </section>
      )}

      {/* Floating Quick Discover Pill */}
      <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-30">
        <button
          onClick={() => setDiscoverModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#D4FF00] hover:bg-[#c2eb00] text-black font-extrabold text-xs shadow-[0_0_25px_rgba(212,255,0,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Discover New Ideas & Theories"
          title="Discover New Theories"
        >
          <Sparkles className="w-4 h-4 text-black fill-black group-hover:rotate-12 transition-transform" />
          <span className="font-extrabold tracking-tight">Discover Theories</span>
        </button>
      </div>
    </div>
  );
};
