import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Bookmark, 
  Share2, 
  ArrowRight, 
  X, 
  Check, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { Idea } from '../../types';
import { useStore } from '../../lib/store';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface DailyIdeaCardProps {
  idea: Idea;
  slotLabel?: string;
  badgeLabel?: string;
}

export const DailyIdeaCard: React.FC<DailyIdeaCardProps> = ({ 
  idea, 
  slotLabel = 'Daily Discovery',
  badgeLabel 
}) => {
  const navigate = useNavigate();
  const { 
    isIdeaSaved, 
    saveIdea, 
    removeSavedIdea, 
    dismissDailyIdea, 
    isDailyIdeaDismissed,
    recordActivity,
    markIdeaAsRead,
    isIdeaReadToday,
    setActiveContextItem,
    setAIAssistantOpen 
  } = useStore();

  const [copied, setCopied] = useState(false);
  const isSaved = isIdeaSaved(idea.id);
  const isRead = isIdeaReadToday(idea.id);

  if (isDailyIdeaDismissed(idea.id)) return null;

  const handleReadMore = () => {
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Daily Insight: ${idea.title}`,
          text: `${idea.title} - ${idea.key_takeaway}`,
          url: `${window.location.origin}/idea/${idea.id}`,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/idea/${idea.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismissDailyIdea(idea.id);
  };

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-brand-navy to-brand-navy-dark dark:from-dark-surface dark:to-dark-card text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-brand-mint/20">
      {/* Background Subtle Sparkle Accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-mint/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-mint text-brand-navy font-bold text-xs rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            {badgeLabel || slotLabel}
          </span>
          <span className="text-white/60 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {idea.reading_time_minutes} min read
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1.5 text-white/50 hover:text-white rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          title="Dismiss daily recommendation"
          aria-label="Dismiss daily recommendation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-3 relative z-10">
        <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight tracking-tight text-white">
          {idea.title}
        </h2>

        <p className="text-sm text-white/85 line-clamp-3 leading-relaxed">
          {idea.summary}
        </p>

        {/* Takeaway box */}
        <div className="p-3.5 bg-white/10 dark:bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-mint">
            Key Takeaway
          </p>
          <p className="text-xs sm:text-sm text-white/95 font-medium mt-0.5 italic">
            "{idea.key_takeaway}"
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10 text-xs">
        {/* Source citation */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            window.open(idea.source_url, '_blank', 'noopener,noreferrer');
          }}
          className="flex items-center gap-1 text-white/70 hover:text-brand-mint transition-colors truncate max-w-[45%] cursor-pointer"
          title={`Source: ${idea.source_title}`}
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{idea.source_publisher}</span>
          {idea.source_published_at && (
            <span className="hidden sm:inline text-white/50 text-[10px]">
              • {idea.source_published_at}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Share daily insight"
            aria-label="Share insight"
          >
            {copied ? <Check className="w-4 h-4 text-brand-mint" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Save */}
          <button
            onClick={handleSaveToggle}
            className={`p-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isSaved 
                ? 'bg-brand-mint text-brand-navy font-bold' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isSaved ? 'Saved to library' : 'Save daily insight'}
            aria-label={isSaved ? 'Saved' : 'Save insight'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Mark Learned / Completed Today */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              markIdeaAsRead(idea.id);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              isRead
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
            title={isRead ? 'Completed today! Counted toward your daily goal' : 'Mark idea as completed today'}
          >
            <Check className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-300 stroke-[3]' : 'text-white/70'}`} />
            <span>{isRead ? 'Done' : 'Mark Learned'}</span>
          </button>

          {/* Read More */}
          <Button
            variant="mint"
            size="sm"
            onClick={handleReadMore}
            className="font-bold text-xs shadow-sm"
          >
            Read More <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
