import React, { useState } from 'react';
import { 
  BookSummary, 
  Book 
} from '../../types';
import { 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  ListOrdered, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  FolderPlus
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { AddToStashModal } from '../stash/AddToStashModal';

interface BookSummaryViewProps {
  summary: BookSummary;
  book: Book;
}

export const BookSummaryView: React.FC<BookSummaryViewProps> = ({ summary, book }) => {
  const { addCustomIdea } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'themes' | 'action' | 'limitations' | 'chapters'>('overview');
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);
  const [stashingItem, setStashingItem] = useState<{ ideaId: string; title: string } | null>(null);

  const toggleSection = (order: number) => {
    setExpandedSections(prev => 
      prev.includes(order) ? prev.filter(o => o !== order) : [...prev, order]
    );
  };

  const handleRestashTheme = (theme: { title: string; description: string; practical_example?: string }) => {
    const custom = addCustomIdea({
      title: theme.title,
      summary: theme.description,
      key_takeaway: theme.practical_example || theme.description,
      why_it_matters: `Core mental model extracted from "${book.title}" by ${book.authors?.join(', ') || 'the author'}.`,
      source_title: book.title,
      source_publisher: book.authors?.join(', ') || 'Author',
      source_url: window.location.href,
      category: (book.categories && book.categories[0] as any) || 'General Knowledge',
      generation_model: 'atomic-book-restash',
    });
    setStashingItem({ ideaId: custom.id, title: custom.title });
  };

  const handleRestashTakeaway = (takeaway: string) => {
    const custom = addCustomIdea({
      title: `Takeaway: ${takeaway.slice(0, 55)}...`,
      summary: takeaway,
      key_takeaway: takeaway,
      why_it_matters: `Actionable principle extracted from "${book.title}".`,
      source_title: book.title,
      source_publisher: book.authors?.join(', ') || 'Author',
      source_url: window.location.href,
      category: (book.categories && book.categories[0] as any) || 'Productivity',
      generation_model: 'atomic-book-restash',
    });
    setStashingItem({ ideaId: custom.id, title: custom.title });
  };

  const handleRestashSection = (sec: { section_title: string; section_summary: string; key_concepts?: string[] }) => {
    const custom = addCustomIdea({
      title: sec.section_title,
      summary: sec.section_summary,
      key_takeaway: sec.key_concepts?.join(' • ') || sec.section_summary.slice(0, 100),
      why_it_matters: `Chapter breakdown extracted from "${book.title}".`,
      source_title: book.title,
      source_publisher: book.authors?.join(', ') || 'Author',
      source_url: window.location.href,
      category: (book.categories && book.categories[0] as any) || 'General Knowledge',
      generation_model: 'atomic-book-restash',
    });
    setStashingItem({ ideaId: custom.id, title: custom.title });
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-xs space-y-6">
      {/* Header bar with summary badge and model */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/60 dark:border-dark-border/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy rounded-full text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Transformative Editorial Summary
          </span>
          <span className="text-[11px] text-brand-muted dark:text-dark-muted font-medium">
            Original analysis & high-level synthesis
          </span>
        </div>

        {summary.generation_model && (
          <span className="text-[10px] font-mono text-stone-500 bg-stone-100 dark:bg-dark-card px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
            {summary.generation_model}
          </span>
        )}
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-brand-border/60 dark:border-dark-border/60">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'themes', label: `Core Ideas (${summary.core_themes?.length || 0})` },
          { id: 'action', label: 'Takeaways' },
          { id: 'chapters', label: `Sections (${summary.sections?.length || 0})` },
          { id: 'limitations', label: 'Limitations' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none min-h-[40px] cursor-pointer ${
              activeTab === tab.id
                ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy shadow-xs'
                : 'text-brand-muted dark:text-dark-muted hover:text-brand-text dark:hover:text-dark-text hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-navy dark:text-brand-mint" />
                Book Overview & Central Argument
              </h3>
              <p className="mt-3 text-sm sm:text-base text-brand-text/90 dark:text-dark-text/90 leading-relaxed font-serif">
                {summary.overview}
              </p>
            </div>

            <div className="p-4 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60 space-y-2 text-xs">
              <h4 className="font-bold text-brand-navy dark:text-brand-mint flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                Who Should Read This:
              </h4>
              <p className="text-brand-text/80 dark:text-dark-text/80 leading-relaxed">
                Professionals, strategists, and curious individuals seeking to understand how cognitive framing and system design shape real-world execution.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Core Themes */}
        {activeTab === 'themes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Core Concepts & Mental Models
              </h3>
              <span className="text-[11px] text-brand-muted dark:text-dark-muted hidden sm:inline">
                Click Restash to save individual concepts
              </span>
            </div>

            <div className="space-y-3">
              {summary.core_themes?.map((theme, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 h-5 rounded-full bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-brand-text dark:text-dark-text truncate">
                        {theme.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestashTheme(theme)}
                      className="px-2.5 py-1 text-xs font-bold text-brand-navy dark:text-brand-mint bg-brand-mint/20 hover:bg-brand-mint/30 dark:bg-brand-mint/15 dark:hover:bg-brand-mint/25 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0"
                      title="Restash this core theme into your collection"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>Restash</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-text/85 dark:text-dark-text/85 leading-relaxed pl-7">
                    {theme.description}
                  </p>

                  {theme.practical_example && (
                    <div className="ml-7 p-2.5 bg-white dark:bg-dark-surface rounded-xl border border-brand-border/60 dark:border-dark-border/60 text-xs">
                      <span className="font-semibold text-brand-navy dark:text-brand-mint">Real-World Application: </span>
                      <span className="text-brand-text/80 dark:text-dark-text/80 italic">{theme.practical_example}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Practical Takeaways */}
        {activeTab === 'action' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-brand-mint" />
              Actionable Takeaways for Daily Practice
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {summary.practical_takeaways?.map((takeaway, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-brand-mint shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-brand-text dark:text-dark-text font-medium leading-relaxed">
                      {takeaway}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestashTakeaway(takeaway)}
                    className="p-1.5 text-brand-muted hover:text-brand-navy dark:text-dark-muted dark:hover:text-brand-mint hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Restash takeaway to collection"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Sections / Chapters */}
        {activeTab === 'chapters' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-brand-navy dark:text-brand-mint" />
              Thematic & Chapter Breakdown
            </h3>

            <div className="space-y-3">
              {summary.sections?.map((sec) => {
                const isExpanded = expandedSections.includes(sec.section_order);
                return (
                  <div
                    key={sec.section_order}
                    className="rounded-2xl border border-brand-border/70 dark:border-dark-border/70 overflow-hidden bg-brand-bg dark:bg-dark-card transition-all"
                  >
                    <div
                      onClick={() => toggleSection(sec.section_order)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none"
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-dark-border text-brand-text dark:text-dark-text font-bold text-xs flex items-center justify-center shrink-0">
                          {sec.section_order}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-brand-text dark:text-dark-text truncate">
                          {sec.section_title}
                        </h4>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-brand-muted shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-brand-muted shrink-0" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="px-5 pb-4 pt-1 text-xs space-y-3 border-t border-brand-border/40 dark:border-dark-border/40 bg-white dark:bg-dark-surface">
                        <p className="text-brand-text/80 dark:text-dark-text/80 leading-relaxed font-serif text-sm">
                          {sec.section_summary}
                        </p>

                        {sec.key_concepts && sec.key_concepts.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {sec.key_concepts.map((concept, cIdx) => (
                              <span 
                                key={cIdx}
                                className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-dark-card text-brand-muted dark:text-dark-muted font-medium text-[11px]"
                              >
                                #{concept}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRestashSection(sec)}
                            className="px-2.5 py-1 text-xs font-bold text-brand-navy dark:text-brand-mint bg-brand-mint/20 hover:bg-brand-mint/30 dark:bg-brand-mint/15 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                            title="Restash this section summary to your collection"
                          >
                            <FolderPlus className="w-3.5 h-3.5" />
                            <span>Restash Section</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Limitations */}
        {activeTab === 'limitations' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Critical Limitations & Counterarguments
            </h3>

            <div className="p-5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed space-y-3">
              <p>{summary.limitations}</p>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70 italic">
                * Note: Every framework involves trade-offs. Adapt these principles to your specific domain constraints rather than applying them dogma-blind.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Copyright Safeguard & Synthesis Basis */}
      <div className="pt-4 border-t border-brand-border/60 dark:border-dark-border/60 flex items-start gap-2.5 text-xs text-brand-muted dark:text-dark-muted">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-brand-mint shrink-0 mt-0.5" />
        <p className="text-[11px] leading-normal">
          <strong>Copyright Safeguard:</strong> {summary.source_basis || 'Synthesized from published literary metadata and secondary commentary. No full text reproduced.'}
        </p>
      </div>

      {/* Atomic Restashing Modal */}
      {stashingItem && (
        <AddToStashModal
          isOpen={Boolean(stashingItem)}
          onClose={() => setStashingItem(null)}
          item={{ ideaId: stashingItem.ideaId, title: stashingItem.title }}
        />
      )}
    </div>
  );
};
