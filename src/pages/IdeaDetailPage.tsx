import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  FolderPlus, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Check, 
  FileEdit,
  Lightbulb,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Idea } from '../types';
import { useStore } from '../lib/store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AddToStashModal } from '../components/stash/AddToStashModal';
import { IdeaCard } from '../components/cards/IdeaCard';

export const IdeaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    allIdeas, 
    savedIdeas, 
    saveIdea, 
    removeSavedIdea, 
    updateIdeaNotes, 
    isIdeaSaved,
    setActiveContextItem,
    setAIAssistantOpen,
    markIdeaAsRead,
    isIdeaReadToday,
    getStashesForItem
  } = useStore();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);
  const [isStashModalOpen, setIsStashModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Find idea in allIdeas or in savedIdeas
    const found = allIdeas.find(i => i.id === id) || savedIdeas.find(si => si.idea_id === id)?.idea;
    if (found) {
      setIdea(found);
    }
  }, [id, allIdeas, savedIdeas]);

  const isSaved = idea ? isIdeaSaved(idea.id) : false;
  const isRead = idea ? isIdeaReadToday(idea.id) : false;
  const stashesWithItem = idea ? getStashesForItem({ ideaId: idea.id }) : [];

  // Load existing personal notes if saved
  useEffect(() => {
    if (idea) {
      const savedRecord = savedIdeas.find(si => si.idea_id === idea.id);
      if (savedRecord && savedRecord.personal_notes) {
        setNotes(savedRecord.personal_notes);
      }
    }
  }, [idea, savedIdeas]);

  if (!idea) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-brand-muted">Idea not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
        </Button>
      </div>
    );
  }

  const handleSaveToggle = async () => {
    if (isSaved) {
      await removeSavedIdea(idea.id);
    } else {
      await saveIdea(idea, notes);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    if (!isSaved) {
      await saveIdea(idea, notes);
    } else {
      await updateIdeaNotes(idea.id, notes);
    }
    setIsSavingNotes(false);
    setNotesSavedAlert(true);
    setTimeout(() => setNotesSavedAlert(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: idea.title,
          text: `${idea.title} - ${idea.key_takeaway}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAskAI = () => {
    setActiveContextItem({
      type: 'idea',
      title: idea.title,
      content: `${idea.summary}\nKey Takeaway: ${idea.key_takeaway}\nWhy It Matters: ${idea.why_it_matters}\nSource: ${idea.source_title} (${idea.source_url})`
    });
    setAIAssistantOpen(true);
  };

  // Related ideas from same category
  const relatedIdeas = allIdeas
    .filter(i => i.id !== idea.id && i.category === idea.category)
    .slice(0, 3);

  return (
    <article className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto pb-12">
      {/* Top Navigation Bar: Back button & Actions */}
      <div className="flex items-center justify-between gap-2 border-b border-brand-border/60 dark:border-dark-border/60 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-text dark:text-dark-muted dark:hover:text-dark-text transition-colors p-2 -ml-2 rounded-xl min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Ask AI Contextual Companion */}
          <button
            onClick={handleAskAI}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-mint text-brand-navy font-bold text-xs hover:bg-brand-mint-dark transition-all cursor-pointer min-h-[40px] shadow-2xs"
            title="Ask AI Companion about this idea"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Ask AI</span>
          </button>

          {/* Mark Learned (Daily Habit Streak) */}
          <button
            onClick={() => idea && markIdeaAsRead(idea.id)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px] shadow-2xs ${
              isRead
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-brand-mint border border-emerald-500/30'
                : 'bg-stone-100 dark:bg-dark-card text-brand-muted hover:text-brand-text dark:text-dark-muted border border-brand-border/60'
            }`}
            title="Mark as learned to build your daily habit streak"
          >
            <Check className={`w-3.5 h-3.5 ${isRead ? 'stroke-[2.5]' : ''}`} />
            <span>{isRead ? 'Learned today 🔥' : 'Mark Learned'}</span>
          </button>

          {/* Add to Stash */}
          <button
            onClick={() => setIsStashModalOpen(true)}
            className={`p-2 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer relative ${
              stashesWithItem.length > 0
                ? 'text-brand-navy dark:text-brand-mint bg-brand-mint/20 dark:bg-brand-mint/15'
                : 'text-brand-muted hover:text-brand-text dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title={stashesWithItem.length > 0 ? `Restashed in ${stashesWithItem.length} collection(s)` : "Restash idea"}
            aria-label="Add to collection"
          >
            <FolderPlus className="w-5 h-5" />
            {stashesWithItem.length > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy text-[9px] font-bold flex items-center justify-center">
                {stashesWithItem.length}
              </span>
            )}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 text-brand-muted hover:text-brand-text dark:text-dark-muted rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Share idea"
            aria-label="Share idea"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
          </button>

          {/* Save Toggle */}
          <button
            onClick={handleSaveToggle}
            className={`p-2 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
              isSaved
                ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold shadow-xs'
                : 'text-brand-muted hover:text-brand-text dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title={isSaved ? 'Saved in library' : 'Save idea'}
            aria-label={isSaved ? 'Remove from library' : 'Save to library'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Idea Content Box */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-10 border border-brand-border dark:border-dark-border shadow-card space-y-6">
        {/* Category & Time */}
        <div className="flex items-center justify-between gap-3">
          <Badge category={idea.category} size="md">
            {idea.category}
          </Badge>
          <span className="text-xs font-medium text-brand-muted dark:text-dark-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {idea.reading_time_minutes} min read
          </span>
        </div>

        {/* Full Headline */}
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-navy dark:text-white leading-tight tracking-tight">
          {idea.title}
        </h1>

        {/* Key Takeaway Hero Callout */}
        <div className="p-4 sm:p-5 bg-brand-bg dark:bg-dark-card rounded-2xl border-l-4 border-brand-mint-dark dark:border-brand-mint space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-navy dark:text-brand-mint flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 fill-current/20" />
            Key Takeaway
          </p>
          <p className="text-sm sm:text-base font-semibold text-brand-text dark:text-dark-text italic leading-relaxed">
            "{idea.key_takeaway}"
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-dark-muted">
            The Insight Explained
          </h3>
          <p className="prose-editorial text-brand-text/90 dark:text-dark-text/90">
            {idea.summary}
          </p>
        </div>

        {/* Why It Matters */}
        <div className="space-y-2 p-5 bg-stone-50 dark:bg-dark-card/60 rounded-2xl border border-brand-border/60 dark:border-dark-border/60">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy dark:text-brand-mint">
            Why It Matters
          </h3>
          <p className="text-sm text-brand-text/85 dark:text-dark-text/85 leading-relaxed font-serif">
            {idea.why_it_matters}
          </p>
        </div>

        {/* Verified Original Source Information */}
        <div className="pt-6 border-t border-brand-border/60 dark:border-dark-border/60 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-dark-muted flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-brand-mint" />
            Verified Source Reference
          </h4>

          <div className="p-4 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 truncate pr-2">
              <p className="font-bold text-brand-text dark:text-dark-text truncate">
                {idea.source_title}
              </p>
              <p className="text-brand-muted dark:text-dark-muted">
                Published by {idea.source_publisher}
                {idea.source_published_at && ` • ${idea.source_published_at}`}
              </p>
            </div>

            <a
              href={idea.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-dark-surface hover:bg-stone-100 dark:hover:bg-dark-border text-brand-navy dark:text-brand-mint font-semibold rounded-xl border border-brand-border/80 dark:border-dark-border shrink-0 transition-colors"
            >
              <span>View Original Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Personal Notes Section */}
      <section className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-brand-text dark:text-dark-text flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-brand-navy dark:text-brand-mint" />
            Your Personal Notes
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
          placeholder="Jot down personal takeaways, project applications, or questions..."
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

      {/* Related Ideas in this category */}
      {relatedIdeas.length > 0 && (
        <section className="space-y-4 pt-4">
          <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text">
            Related Insights in {idea.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedIdeas.map((rel) => (
              <IdeaCard key={rel.id} idea={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Add To Stash Modal */}
      {isStashModalOpen && (
        <AddToStashModal
          isOpen={isStashModalOpen}
          onClose={() => setIsStashModalOpen(false)}
          item={{ ideaId: idea.id, title: idea.title }}
        />
      )}
    </article>
  );
};
