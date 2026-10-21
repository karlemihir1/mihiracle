import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Share2, 
  FolderPlus, 
  ExternalLink, 
  Clock, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Idea } from '../../types';
import { useStore } from '../../lib/store';
import { Badge } from '../ui/Badge';
import { AddToStashModal } from '../stash/AddToStashModal';

interface IdeaCardProps {
  idea: Idea;
  showSaveButton?: boolean;
  className?: string;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  showSaveButton = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const { 
    isIdeaSaved, 
    saveIdea, 
    removeSavedIdea, 
    recordActivity,
    setActiveContextItem,
    setAIAssistantOpen,
    markIdeaAsRead,
    isIdeaReadToday,
    getStashesForItem
  } = useStore();

  const [isStashModalOpen, setIsStashModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isSaved = isIdeaSaved(idea.id);
  const isRead = isIdeaReadToday(idea.id);
  const stashesWithItem = getStashesForItem({ ideaId: idea.id });
  const isRestashed = stashesWithItem.length > 0;

  const handleCardClick = () => {
    recordActivity('view_idea', { idea });
    navigate(`/idea/${idea.id}`);
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      await removeSavedIdea(idea.id);
    } else {
      await saveIdea(idea);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markIdeaAsRead(idea.id);
  };

  const handleStashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStashModalOpen(true);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: idea.title,
          text: `${idea.title} - ${idea.key_takeaway}`,
          url: window.location.origin + `/idea/${idea.id}`,
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/idea/${idea.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAskAIClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveContextItem({
      type: 'idea',
      title: idea.title,
      content: `${idea.summary}\nKey Takeaway: ${idea.key_takeaway}\nSource: ${idea.source_title} (${idea.source_url})`
    });
    setAIAssistantOpen(true);
  };

  return (
    <>
      <article
        onClick={handleCardClick}
        className={`group bg-white dark:bg-dark-surface rounded-2xl p-5 border border-brand-border dark:border-dark-border hover:border-brand-navy/30 dark:hover:border-brand-mint/40 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between relative select-none ${className}`}
      >
        <div className="space-y-3">
          {/* Top Row: Category + Reading Time */}
          <div className="flex items-center justify-between gap-2">
            <Badge category={idea.category}>
              {idea.category}
            </Badge>

            <span className="text-[11px] font-medium text-brand-muted dark:text-dark-muted flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {idea.reading_time_minutes} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text group-hover:text-brand-navy dark:group-hover:text-brand-mint transition-colors leading-snug">
            {idea.title}
          </h3>

          {/* Short summary */}
          <p className="text-xs sm:text-sm text-brand-text/80 dark:text-dark-text/80 line-clamp-3 leading-relaxed">
            {idea.summary}
          </p>

          {/* Key Takeaway Highlight Callout */}
          <div className="p-3 bg-brand-bg dark:bg-dark-card rounded-xl border-l-3 border-brand-mint-dark dark:border-brand-mint text-xs">
            <p className="font-semibold text-brand-navy dark:text-brand-mint tracking-tight">
              💡 Key Takeaway:
            </p>
            <p className="text-brand-text dark:text-dark-text mt-0.5 italic">
              "{idea.key_takeaway}"
            </p>
          </div>
        </div>

        {/* Bottom Metadata & Controls */}
        <div className="pt-4 mt-2 border-t border-brand-border/60 dark:border-dark-border/60 flex items-center justify-between text-xs">
          {/* Source Domain */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              window.open(idea.source_url, '_blank', 'noopener,noreferrer');
            }}
            className="flex items-center gap-1.5 text-brand-muted dark:text-dark-muted hover:text-brand-navy dark:hover:text-brand-mint font-medium truncate max-w-[50%] transition-colors"
            title={`Source: ${idea.source_title}`}
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">{idea.source_publisher}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Ask AI Contextual Companion */}
            <button
              onClick={handleAskAIClick}
              className="p-2 text-brand-muted hover:text-brand-navy dark:text-dark-muted dark:hover:text-brand-mint rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              title="Discuss with AI Companion"
              aria-label="Discuss idea with AI"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Mark as Learned (Daily Habit Streak) */}
            <button
              onClick={handleMarkAsRead}
              className={`p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer ${
                isRead
                  ? 'text-emerald-600 dark:text-brand-mint bg-emerald-500/15 dark:bg-emerald-500/10'
                  : 'text-brand-muted hover:text-brand-navy dark:text-dark-muted dark:hover:text-brand-mint hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={isRead ? "Learned today (counts toward habit streak)" : "Mark as learned (build your daily streak)"}
              aria-label="Mark idea as learned"
            >
              <Check className={`w-4 h-4 ${isRead ? 'stroke-[2.5]' : ''}`} />
            </button>

            {/* Add / Restash to Collection */}
            <button
              onClick={handleStashClick}
              className={`p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer relative ${
                isRestashed
                  ? 'text-brand-navy dark:text-brand-mint bg-brand-mint/20 dark:bg-brand-mint/15'
                  : 'text-brand-muted hover:text-brand-navy dark:text-dark-muted dark:hover:text-brand-mint hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title={isRestashed ? `Restashed in ${stashesWithItem.length} collection(s)` : "Restash card into collection"}
              aria-label="Restash idea"
            >
              <FolderPlus className="w-4 h-4" />
              {isRestashed && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy text-[9px] font-bold flex items-center justify-center">
                  {stashesWithItem.length}
                </span>
              )}
            </button>

            {/* Share */}
            <button
              onClick={handleShareClick}
              className="p-2 text-brand-muted hover:text-brand-navy dark:text-dark-muted dark:hover:text-brand-mint rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              title="Share idea"
              aria-label="Share idea"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Save / Bookmark */}
            {showSaveButton && (
              <button
                onClick={handleSaveToggle}
                className={`p-2 rounded-lg transition-all min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer ${
                  isSaved
                    ? 'text-brand-navy dark:text-brand-mint bg-brand-mint/25 dark:bg-brand-mint/15'
                    : 'text-brand-muted hover:text-brand-navy dark:text-dark-muted dark:hover:text-brand-mint hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save to library'}
                aria-label={isSaved ? 'Remove idea from saved' : 'Save idea'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Add To Stash Modal */}
      {isStashModalOpen && (
        <AddToStashModal
          isOpen={isStashModalOpen}
          onClose={() => setIsStashModalOpen(false)}
          item={{ ideaId: idea.id, title: idea.title }}
        />
      )}
    </>
  );
};
