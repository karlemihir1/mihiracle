import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Star, BookOpen, Check } from 'lucide-react';
import { Book, ReadingStatus } from '../../types';
import { useStore } from '../../lib/store';
import { Badge } from '../ui/Badge';

interface BookCardProps {
  book: Book;
  className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({ book, className = '' }) => {
  const navigate = useNavigate();
  const { 
    isBookSaved, 
    saveBook, 
    removeSavedBook, 
    getBookStatus, 
    updateBookStatus,
    recordActivity 
  } = useStore();

  const isSaved = isBookSaved(book.id);
  const currentStatus = getBookStatus(book.id) || 'want_to_read';

  const handleCardClick = () => {
    recordActivity('view_book', { book });
    navigate(`/book/${book.id}`);
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      await removeSavedBook(book.id);
    } else {
      await saveBook(book, 'want_to_read');
    }
  };

  const handleStatusChange = async (e: React.MouseEvent, status: ReadingStatus) => {
    e.stopPropagation();
    if (!isSaved) {
      await saveBook(book, status);
    } else {
      await updateBookStatus(book.id, status);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group bg-white dark:bg-dark-surface rounded-2xl p-4 border border-brand-border dark:border-dark-border hover:border-brand-navy/30 dark:hover:border-brand-mint/40 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between select-none relative ${className}`}
    >
      <div className="space-y-3">
        {/* Cover and Quick Info */}
        <div className="flex gap-3.5">
          <div className="w-20 h-28 sm:w-24 sm:h-34 rounded-xl overflow-hidden shadow-md bg-stone-100 shrink-0 relative">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {isSaved && (
              <span className="absolute top-1 right-1 bg-brand-mint text-brand-navy p-1 rounded-full shadow-xs">
                <Bookmark className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>

          <div className="flex-1 space-y-1 min-w-0">
            {book.categories && book.categories.length > 0 && (
              <Badge category={book.categories[0]} size="sm">
                {book.categories[0]}
              </Badge>
            )}

            <h3 className="font-serif font-bold text-sm sm:text-base text-brand-text dark:text-dark-text group-hover:text-brand-navy dark:group-hover:text-brand-mint transition-colors line-clamp-2 leading-tight mt-1">
              {book.title}
            </h3>

            <p className="text-xs text-brand-muted dark:text-dark-muted truncate">
              by {book.authors.join(', ')}
            </p>

            {book.rating && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 pt-0.5">
                <Star className="w-3 h-3 fill-current" />
                <span>{book.rating.toFixed(1)}</span>
                {book.publicationYear && (
                  <span className="text-brand-muted dark:text-dark-muted font-normal ml-1">
                    • {book.publicationYear}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-brand-text/75 dark:text-dark-text/75 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
      </div>

      {/* Footer controls: Reading Status Selector & Save */}
      <div className="pt-3 mt-3 border-t border-brand-border/60 dark:border-dark-border/60 flex items-center justify-between text-xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1">
          {(['want_to_read', 'reading', 'completed'] as ReadingStatus[]).map((st) => {
            const labels = { want_to_read: 'To Read', reading: 'Reading', completed: 'Done' };
            const isActive = isSaved && currentStatus === st;
            return (
              <button
                key={st}
                onClick={(e) => handleStatusChange(e, st)}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer min-h-[32px] ${
                  isActive
                    ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold'
                    : 'bg-stone-100 hover:bg-stone-200 dark:bg-dark-card dark:hover:bg-dark-border text-brand-muted dark:text-dark-muted'
                }`}
              >
                {labels[st]}
              </button>
            );
          })}
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveToggle}
          className={`p-2 rounded-lg transition-all min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer ${
            isSaved
              ? 'text-brand-navy dark:text-brand-mint bg-brand-mint/20'
              : 'text-brand-muted hover:text-brand-navy dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
          }`}
          title={isSaved ? 'Saved in library' : 'Save book'}
          aria-label={isSaved ? 'Saved book' : 'Save book'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </article>
  );
};
