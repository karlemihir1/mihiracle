import React, { useState } from 'react';
import { 
  Bookmark, 
  FolderPlus, 
  BookOpen, 
  Search, 
  ArrowUpDown, 
  Folder, 
  Sparkles,
  Layers,
  Plus
} from 'lucide-react';
import { useStore } from '../lib/store';
import { IdeaCard } from '../components/cards/IdeaCard';
import { BookCard } from '../components/books/BookCard';
import { StashCard } from '../components/stash/StashCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const StashPage: React.FC = () => {
  const { 
    savedIdeas, 
    savedBooks, 
    stashes, 
    createStash 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'collections' | 'ideas' | 'books'>('collections');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStashName, setNewStashName] = useState('');
  const [newStashDesc, setNewStashDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter ideas
  const filteredIdeas = savedIdeas
    .filter(si => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inTitle = si.idea?.title.toLowerCase().includes(q);
      const inNotes = si.personal_notes?.toLowerCase().includes(q);
      const inCat = si.idea?.category.toLowerCase().includes(q);
      return inTitle || inNotes || inCat;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return (a.idea?.title || '').localeCompare(b.idea?.title || '');
    });

  // Filter books
  const filteredBooks = savedBooks
    .filter(sb => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inTitle = sb.book?.title.toLowerCase().includes(q);
      const inAuthor = sb.book?.authors.some(a => a.toLowerCase().includes(q));
      return inTitle || inAuthor;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return (a.book?.title || '').localeCompare(b.book?.title || '');
    });

  // Filter collections
  const filteredStashes = stashes.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
  });

  const handleCreateStash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStashName.trim()) return;

    setIsSubmitting(true);
    try {
      await createStash(newStashName.trim(), newStashDesc.trim());
      setNewStashName('');
      setNewStashDesc('');
      setIsCreateModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-navy dark:text-white tracking-tight">
            My Stash — Knowledge Library
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted mt-1">
            Your permanent digital repository of discovered ideas, books, and curated collections.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start sm:self-auto text-xs font-bold shadow-xs min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Collection
        </Button>
      </div>

      {/* Tabs & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 dark:border-dark-border/60 pb-3">
          {/* Main Navigation Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'collections', label: `Collections (${stashes.length})`, icon: Folder },
              { id: 'ideas', label: `Saved Ideas (${savedIdeas.length})`, icon: Sparkles },
              { id: 'books', label: `Saved Books (${savedBooks.length})`, icon: BookOpen },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px] select-none ${
                    activeTab === tab.id
                      ? 'bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy shadow-xs'
                      : 'text-brand-muted dark:text-dark-muted hover:text-brand-text dark:hover:text-dark-text hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search within Library */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search library..."
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl text-xs text-brand-text dark:text-dark-text outline-none focus:border-brand-navy dark:focus:border-brand-mint min-h-[36px]"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-xl px-2.5 py-1.5 text-xs text-brand-text dark:text-dark-text outline-none cursor-pointer min-h-[36px]"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: COLLECTIONS (STASHES) */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          {filteredStashes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStashes.map((stash) => (
                <StashCard key={stash.id} stash={stash} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-brand-border dark:border-dark-border">
              <Folder className="w-10 h-10 text-brand-muted mx-auto" />
              <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text">
                No collections found
              </h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Group your saved ideas and books into thematic Stashes like "Mental Models", "Strategy", or "Books to Read".
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Your First Stash
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED IDEAS */}
      {activeTab === 'ideas' && (
        <div className="space-y-4">
          {filteredIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIdeas.map((saved) => (
                saved.idea && (
                  <div key={saved.id} className="relative">
                    <IdeaCard idea={saved.idea} />
                    {saved.personal_notes && (
                      <div className="mt-2 p-2.5 bg-brand-mint/15 dark:bg-brand-mint/10 border border-brand-mint/40 rounded-xl text-xs text-brand-navy dark:text-brand-mint">
                        <span className="font-bold">Your note: </span>
                        <span>"{saved.personal_notes}"</span>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-brand-border dark:border-dark-border">
              <Bookmark className="w-10 h-10 text-brand-muted mx-auto" />
              <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text">
                No saved ideas yet
              </h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                When you discover valuable insights in your feed, tap the bookmark icon to save them forever.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED BOOKS */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((saved) => (
                saved.book && (
                  <BookCard key={saved.id} book={saved.book} />
                )
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-brand-border dark:border-dark-border">
              <BookOpen className="w-10 h-10 text-brand-muted mx-auto" />
              <h3 className="font-serif text-lg font-bold text-brand-text dark:text-dark-text">
                No saved books yet
              </h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Track books you are currently reading or want to read from the Book Library.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create New Stash Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Stash"
      >
        <form onSubmit={handleCreateStash} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-brand-text dark:text-dark-text block mb-1">
              Collection Name
            </label>
            <Input
              placeholder="e.g. Cognitive Psychology, MBA Frameworks..."
              value={newStashName}
              onChange={(e) => setNewStashName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-text dark:text-dark-text block mb-1">
              Description (optional)
            </label>
            <Input
              placeholder="Brief description of what belongs in this stash..."
              value={newStashDesc}
              onChange={(e) => setNewStashDesc(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Create Stash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
