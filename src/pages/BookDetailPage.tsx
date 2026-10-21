import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Star, 
  Sparkles, 
  FileEdit, 
  Check, 
  BookOpen, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building,
  Hash
} from 'lucide-react';
import { Book, BookSummary, ReadingStatus } from '../types';
import { useStore } from '../lib/store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BookSummaryView } from '../components/books/BookSummaryView';
import { getBookDetails, generateBookSummary } from '../services/api';
import { INITIAL_BOOKS } from '../services/mockData';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    savedBooks, 
    saveBook, 
    removeSavedBook, 
    updateBookStatus, 
    updateBookNotes, 
    isBookSaved, 
    getBookStatus,
    setActiveContextItem,
    setAIAssistantOpen 
  } = useStore();

  const [book, setBook] = useState<Book | null>(null);
  const [summary, setSummary] = useState<BookSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Check saved books or initial books first
    const found = savedBooks.find(sb => sb.book_id === id)?.book || 
                  INITIAL_BOOKS.find(b => b.id === id || b.externalProviderId === id);
    if (found) {
      setBook(found);
      // Generate default summary for initial curated books
      generateBookSummary(found).then(res => setSummary(res.summary)).catch(console.error);
    } else {
      getBookDetails(id).then(b => {
        if (b) {
          setBook(b);
          generateBookSummary(b).then(res => setSummary(res.summary)).catch(console.error);
        }
      });
    }
  }, [id, savedBooks]);

  const isSaved = book ? isBookSaved(book.id) : false;
  const currentStatus = (book ? getBookStatus(book.id) : null) || 'want_to_read';

  useEffect(() => {
    if (book) {
      const savedRecord = savedBooks.find(sb => sb.book_id === book.id);
      if (savedRecord && savedRecord.personal_notes) {
        setNotes(savedRecord.personal_notes);
      }
    }
  }, [book, savedBooks]);

  if (!book) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-brand-muted">Book details not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
        </Button>
      </div>
    );
  }

  const handleSaveToggle = async () => {
    if (isSaved) {
      await removeSavedBook(book.id);
    } else {
      await saveBook(book, 'want_to_read', notes);
    }
  };

  const handleStatusChange = async (status: ReadingStatus) => {
    if (!isSaved) {
      await saveBook(book, status, notes);
    } else {
      await updateBookStatus(book.id, status);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    if (!isSaved) {
      await saveBook(book, currentStatus, notes);
    } else {
      await updateBookNotes(book.id, notes);
    }
    setIsSavingNotes(false);
    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 2000);
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const res = await generateBookSummary(book);
      setSummary(res.summary);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAskAI = () => {
    setActiveContextItem({
      type: 'book',
      title: book.title,
      content: `Author: ${book.authors.join(', ')}\nOverview: ${summary?.overview || book.description}`
    });
    setAIAssistantOpen(true);
  };

  return (
    <article className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      {/* Top Bar with Back and Actions */}
      <div className="flex items-center justify-between gap-2 border-b border-brand-border/60 dark:border-dark-border/60 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-text dark:text-dark-muted dark:hover:text-dark-text transition-colors p-2 -ml-2 rounded-xl min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Ask AI Contextual Companion */}
          <button
            onClick={handleAskAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-mint text-brand-navy font-bold text-xs hover:bg-brand-mint-dark transition-all cursor-pointer min-h-[40px] shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Discuss with AI</span>
          </button>

          {/* Save Toggle */}
          <button
            onClick={handleSaveToggle}
            className={`p-2 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
              isSaved
                ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold shadow-xs'
                : 'text-brand-muted hover:text-brand-text dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title={isSaved ? 'Saved in library' : 'Save book'}
            aria-label={isSaved ? 'Remove from library' : 'Save to library'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Book Hero Card */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-card flex flex-col sm:flex-row gap-6">
        {/* Cover */}
        <div className="w-32 h-44 sm:w-44 sm:h-64 rounded-2xl overflow-hidden shadow-xl bg-stone-100 shrink-0 mx-auto sm:mx-0">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
            {book.categories && book.categories.length > 0 && (
              <Badge category={book.categories[0]} size="md">
                {book.categories[0]}
              </Badge>
            )}

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white leading-tight">
              {book.title}
            </h1>

            <p className="text-sm font-semibold text-brand-muted dark:text-dark-muted">
              by {book.authors.join(', ')}
            </p>

            {book.rating && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 pt-1">
                <Star className="w-4 h-4 fill-current" />
                <span>{book.rating.toFixed(1)} / 5.0</span>
                {book.publicationYear && (
                  <span className="text-brand-muted dark:text-dark-muted font-normal ml-2">
                    Published in {book.publicationYear}
                  </span>
                )}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-brand-text/80 dark:text-dark-text/80 leading-relaxed font-serif">
            {book.description}
          </p>

          {/* Reading Status Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-brand-muted dark:text-dark-muted mr-1">
              Status:
            </span>
            {(['want_to_read', 'reading', 'completed'] as ReadingStatus[]).map((st) => {
              const labels = { want_to_read: 'Want to Read', reading: 'Currently Reading', completed: 'Completed' };
              const isActive = isSaved && currentStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                    isActive
                      ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-dark-card dark:hover:bg-dark-border text-brand-text dark:text-dark-text'
                  }`}
                >
                  {labels[st]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Book Summary Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text dark:text-dark-text tracking-tight">
            Key Insights & Executive Summary
          </h2>

          {!summary && (
            <Button
              variant="mint"
              size="sm"
              isLoading={isGenerating}
              onClick={handleGenerateSummary}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate Summary
            </Button>
          )}
        </div>

        {summary ? (
          <BookSummaryView summary={summary} book={book} />
        ) : (
          <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-brand-border dark:border-dark-border text-center space-y-3">
            <BookOpen className="w-8 h-8 text-brand-muted mx-auto" />
            <h3 className="font-bold text-sm text-brand-text dark:text-dark-text">
              Transformative Summary Ready to Generate
            </h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Extract core themes, chapter insights, and practical takeaways without reading hundreds of pages.
            </p>
            <Button
              variant="primary"
              size="md"
              isLoading={isGenerating}
              onClick={handleGenerateSummary}
            >
              Generate Book Summary
            </Button>
          </div>
        )}
      </section>

      {/* Personal Notes Section */}
      <section className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-brand-text dark:text-dark-text flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-brand-navy dark:text-brand-mint" />
            Your Reading Notes & Reflections
          </h3>
          {notesSavedAlert && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-brand-mint flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Notes saved!
            </span>
          )}
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Record chapter reflections, quotes to remember, or how you intend to apply this book..."
          rows={3}
          className="w-full p-3.5 bg-brand-bg dark:bg-dark-card border border-brand-border/80 dark:border-dark-border/80 rounded-2xl text-xs sm:text-sm text-brand-text dark:text-dark-text placeholder:text-brand-muted/70 outline-none focus:border-brand-navy dark:focus:border-brand-mint"
        />

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveNotes}
            isLoading={isSavingNotes}
          >
            Save Note
          </Button>
        </div>
      </section>
    </article>
  );
};
