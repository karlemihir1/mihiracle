import React, { useState } from 'react';
import { Link as LinkIcon, Sparkles, Youtube, Globe, ArrowRight } from 'lucide-react';
import { UrlImporterModal } from './UrlImporterModal';

export const UrlImporterCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="p-4 sm:p-5 bg-gradient-to-r from-brand-navy/5 via-brand-mint/15 to-transparent dark:from-brand-mint/10 dark:via-dark-card dark:to-transparent rounded-2xl sm:rounded-3xl border border-brand-border dark:border-dark-border hover:border-brand-navy/30 dark:hover:border-brand-mint/40 transition-all cursor-pointer group shadow-2xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-brand-navy dark:text-white">
                  Import & Distill from Web or YouTube
                </h3>
                <span className="px-2 py-0.5 bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy text-[10px] font-bold rounded-full">
                  Deepstash Style
                </span>
              </div>
              <p className="text-xs text-brand-muted dark:text-dark-muted mt-0.5">
                Paste any article, Substack, Medium essay, or YouTube link to extract 3–4 atomic idea cards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-bold text-brand-navy dark:text-brand-mint group-hover:underline flex items-center gap-1">
              <span>Import URL</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <UrlImporterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
