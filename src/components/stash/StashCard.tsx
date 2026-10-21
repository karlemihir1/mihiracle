import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, MoreVertical, Trash2, Edit2, Bookmark, BookOpen } from 'lucide-react';
import { Stash } from '../../types';
import { useStore } from '../../lib/store';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface StashCardProps {
  stash: Stash;
}

export const StashCard: React.FC<StashCardProps> = ({ stash }) => {
  const navigate = useNavigate();
  const { updateStash, deleteStash, stashItems } = useStore();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editName, setEditName] = useState(stash.name);
  const [editDesc, setEditDesc] = useState(stash.description || '');

  // Calculate actual item count in this stash
  const count = stashItems.filter(si => si.stash_id === stash.id).length;

  const handleCardClick = () => {
    navigate(`/stash/${stash.id}`);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    await updateStash(stash.id, editName.trim(), editDesc.trim());
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteStash(stash.id);
    setIsDeleting(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-white dark:bg-dark-surface rounded-2xl p-5 border border-brand-border dark:border-dark-border hover:border-brand-navy/30 dark:hover:border-brand-mint/40 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between select-none relative"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-brand-bg dark:bg-dark-card border border-brand-border dark:border-dark-border flex items-center justify-center text-brand-navy dark:text-brand-mint group-hover:scale-105 transition-transform">
              <Folder className="w-5 h-5 fill-current/20" />
            </div>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 text-brand-muted hover:text-brand-text dark:text-dark-muted rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                aria-label="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-brand-border dark:border-dark-border p-1 space-y-0.5 animate-in fade-in duration-150"
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditing(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-brand-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Stash
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsDeleting(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Stash
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-base text-brand-text dark:text-dark-text group-hover:text-brand-navy dark:group-hover:text-brand-mint transition-colors truncate">
              {stash.name}
            </h3>
            {stash.description ? (
              <p className="text-xs text-brand-muted dark:text-dark-muted line-clamp-2 mt-1 leading-relaxed">
                {stash.description}
              </p>
            ) : (
              <p className="text-xs text-brand-muted/60 dark:text-dark-muted/60 mt-1 italic">
                No description provided.
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-brand-border/60 dark:border-dark-border/60 flex items-center justify-between text-xs text-brand-muted dark:text-dark-muted font-medium">
          <span>{count} {count === 1 ? 'saved item' : 'saved items'}</span>
          <span className="text-[11px] text-brand-navy dark:text-brand-mint font-semibold group-hover:underline">
            Open Stash →
          </span>
        </div>
      </div>

      {/* Edit Stash Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Stash"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-brand-text dark:text-dark-text block mb-1">
              Stash Name
            </label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-text dark:text-dark-text block mb-1">
              Description (optional)
            </label>
            <Input
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Stash"
      >
        <div className="space-y-3">
          <p className="text-sm text-brand-text dark:text-dark-text">
            Are you sure you want to delete <strong>"{stash.name}"</strong>?
          </p>
          <div className="p-3 bg-stone-50 dark:bg-dark-card rounded-xl text-xs text-brand-muted dark:text-dark-muted border border-brand-border/60 dark:border-dark-border/60">
            💡 <strong>Note:</strong> Deleting this collection will <em>never</em> delete your underlying saved ideas or books from your library.
          </div>
          <div className="flex gap-2 justify-end pt-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleting(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Collection
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
