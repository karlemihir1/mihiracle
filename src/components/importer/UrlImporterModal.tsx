import React, { useState } from 'react';
import { 
  Link as LinkIcon, 
  Sparkles, 
  Youtube, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  FolderPlus, 
  Bookmark, 
  ExternalLink,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { AddToStashModal } from '../stash/AddToStashModal';
import { importFromUrl } from '../../services/api';
import { CATEGORIES, Category, Idea } from '../../types';

interface UrlImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (cards: Idea[]) => void;
}

export const UrlImporterModal: React.FC<UrlImporterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addCustomIdea, saveIdea, isIdeaSaved, markIdeaAsRead, isIdeaReadToday } = useStore();
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<Category>('General Knowledge');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [importedCards, setImportedCards] = useState<Idea[]>([]);
  const [sourceInfo, setSourceInfo] = useState<{ title: string; domain: string; url: string; isYouTube?: boolean } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Stashing modal state
  const [stashingItem, setStashingItem] = useState<{ ideaId: string; title: string } | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setError('Please enter a full URL starting with https:// or http://');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImportedCards([]);
    setLoadingStep('Fetching webpage and extracting content...');

    try {
      setTimeout(() => {
        setLoadingStep('Distilling core mental models into bite-sized cards...');
      }, 1200);

      const result = await importFromUrl(trimmed, category);

      // Register all cards into store
      const registeredCards: Idea[] = (result.cards || []).map(c => addCustomIdea({
        ...c,
        category: category,
        source_url: trimmed,
        source_title: result.source?.title || c.source_title,
        source_publisher: result.source?.publisher || c.source_publisher,
      }));

      setImportedCards(registeredCards);
      setSourceInfo(result.source);
      setIsDemoMode(result.isDemo);
      if (onSuccess) onSuccess(registeredCards);
    } catch (err: any) {
      setError(err.message || 'Failed to import and distill article. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSaveToggle = async (idea: Idea) => {
    await saveIdea(idea);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="xl"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy flex items-center justify-center">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-brand-navy dark:text-white">
                Import & Distill from Web or YouTube
              </h3>
              <p className="text-[11px] text-brand-muted dark:text-dark-muted font-sans font-normal">
                Paste any article, blog post, or video URL to generate 3 bite-sized idea cards
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Form */}
          <form onSubmit={handleImport} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-text dark:text-dark-text flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-muted" />
                Source URL
              </label>
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://paulgraham.com/lesson.html or https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                  required
                  className="pr-20 text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text.startsWith('http')) setUrl(text);
                    } catch {
                      // ignore
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] font-semibold text-brand-navy dark:text-brand-mint bg-brand-bg dark:bg-dark-card rounded border border-brand-border/60 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Paste
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-text dark:text-dark-text">
                Target Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                disabled={isLoading}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border text-brand-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-navy dark:focus:ring-brand-mint"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs rounded-xl border border-rose-200 dark:border-rose-900/40 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{loadingStep || 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Distill to 3 Idea Cards</span>
                </>
              )}
            </Button>
          </form>

          {/* Distilled Cards Results */}
          {importedCards.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-brand-border/60 dark:border-dark-border/60 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-brand-mint" />
                    Distilled {importedCards.length} Atomic Idea Cards
                  </h4>
                  {sourceInfo && (
                    <p className="text-[11px] text-brand-muted dark:text-dark-muted truncate max-w-sm mt-0.5">
                      Source: {sourceInfo.title} ({sourceInfo.domain})
                    </p>
                  )}
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-mint/20 text-brand-navy dark:text-brand-mint rounded border border-brand-mint/30">
                  AI Distilled
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {importedCards.map((card) => {
                  const isSaved = isIdeaSaved(card.id);
                  const isRead = isIdeaReadToday(card.id);

                  return (
                    <div
                      key={card.id}
                      className="p-4 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge category={card.category}>{card.category}</Badge>
                        <span className="text-[11px] text-brand-muted dark:text-dark-muted flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {card.reading_time_minutes} min read
                        </span>
                      </div>

                      <h5 className="font-serif font-bold text-sm text-brand-text dark:text-dark-text">
                        {card.title}
                      </h5>

                      <p className="text-xs text-brand-text/80 dark:text-dark-text/80 leading-relaxed">
                        {card.summary}
                      </p>

                      <div className="p-2.5 bg-white dark:bg-dark-surface rounded-xl border border-brand-border/60 dark:border-dark-border/60 text-xs">
                        <span className="font-bold text-brand-navy dark:text-brand-mint">Key Takeaway: </span>
                        <span className="text-brand-text dark:text-dark-text italic">"{card.key_takeaway}"</span>
                      </div>

                      {/* Card Action Toolbar */}
                      <div className="pt-2 flex items-center justify-between border-t border-brand-border/40 dark:border-dark-border/40 text-xs">
                        <a
                          href={card.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-brand-muted hover:text-brand-navy dark:hover:text-brand-mint transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Original Link</span>
                        </a>

                        <div className="flex items-center gap-1.5">
                          {/* Mark as Learned */}
                          <button
                            type="button"
                            onClick={() => markIdeaAsRead(card.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                              isRead 
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-brand-mint'
                                : 'text-brand-muted hover:text-brand-text hover:bg-stone-200 dark:hover:bg-dark-border'
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{isRead ? 'Learned today' : 'Mark Learned'}</span>
                          </button>

                          {/* Restash */}
                          <button
                            type="button"
                            onClick={() => setStashingItem({ ideaId: card.id, title: card.title })}
                            className="px-2.5 py-1 bg-brand-navy text-white dark:bg-brand-mint dark:text-brand-navy rounded-lg text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                          >
                            <FolderPlus className="w-3.5 h-3.5" />
                            <span>Restash</span>
                          </button>

                          {/* Save */}
                          <button
                            type="button"
                            onClick={() => handleSaveToggle(card)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-brand-mint/20 border-brand-mint text-brand-navy dark:text-brand-mint'
                                : 'border-brand-border dark:border-dark-border text-brand-muted hover:text-brand-text'
                            }`}
                            title={isSaved ? 'Saved to library' : 'Save to library'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Embedded Restashing Modal */}
      {stashingItem && (
        <AddToStashModal
          isOpen={Boolean(stashingItem)}
          onClose={() => setStashingItem(null)}
          item={{ ideaId: stashingItem.ideaId, title: stashingItem.title }}
        />
      )}
    </>
  );
};
