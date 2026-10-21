import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Sparkles, Info, X, CheckCircle, ExternalLink } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { health } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  if (isDismissed) return null;

  const isDemo = health?.isDemoMode ?? true;

  return (
    <>
      <div className={`px-4 py-2 text-xs flex items-center justify-between border-b transition-colors ${
        isDemo 
          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-900/50' 
          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900/50'
      }`}>
        <div className="flex items-center gap-2 max-w-[85%] truncate">
          {isDemo ? (
            <>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                Demo Mode
              </span>
              <span className="truncate">
                Running with grounded curated corpus. Zero hallucinations & working source links.
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                Connected: Live Web Search ({health?.searchProvider}) & AI ({health?.aiModel}).
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowConfigModal(true)}
            className="underline font-medium hover:opacity-80 cursor-pointer min-h-[32px] flex items-center px-1"
          >
            Details
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:opacity-70 rounded-sm cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Integration Details Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl max-w-md w-full shadow-2xl border border-brand-border dark:border-dark-border space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-brand-border/60 dark:border-dark-border/60">
              <h3 className="font-bold text-base text-brand-text dark:text-dark-text flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-mint-dark" />
                Integration & Live Status
              </h3>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="p-1 text-brand-muted hover:text-brand-text dark:text-dark-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm space-y-3 text-brand-text/80 dark:text-dark-text/80">
              <p>
                Mihiracle strictly adheres to production standards: it will <strong>never pretend</strong> that live search or AI models are running when API keys are not supplied.
              </p>

              <div className="bg-stone-50 dark:bg-dark-card p-3 rounded-xl border border-brand-border/60 dark:border-dark-border/60 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span>AI Provider:</span>
                  <span className="font-semibold text-brand-navy dark:text-brand-mint">
                    {health?.openAiConfigured ? `OpenAI (${health.aiModel})` : 'Curated Grounded Fallback (Demo)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Search Engine:</span>
                  <span className="font-semibold text-brand-navy dark:text-brand-mint">
                    {health?.searchConfigured ? `Live API (${health.searchProvider})` : 'Curated Academic Corpus (Demo)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Book Provider:</span>
                  <span className="font-semibold text-brand-navy dark:text-brand-mint">
                    Google Books API & Curated Library
                  </span>
                </div>
              </div>

              <div className="text-xs text-brand-muted dark:text-dark-muted space-y-1">
                <p>To connect live production services, simply set your credentials in <code className="bg-stone-100 dark:bg-dark-border px-1 py-0.5 rounded">.env</code>:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li><code className="text-brand-navy dark:text-brand-mint">OPENAI_API_KEY</code> for live AI generation</li>
                  <li><code className="text-brand-navy dark:text-brand-mint">SEARCH_API_KEY</code> (Tavily/Exa) for live web search</li>
                  <li><code className="text-brand-navy dark:text-brand-mint">SUPABASE_URL</code> & anon key for remote Postgres</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full py-2.5 bg-brand-navy text-white dark:bg-brand-mint dark:text-brand-navy font-semibold rounded-xl text-sm"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
