import React, { useState } from 'react';
import { FolderPlus, Check, Plus, Folder } from 'lucide-react';
import { useStore } from '../../lib/store';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface AddToStashModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: { ideaId?: string; bookId?: string; title: string };
}

export const AddToStashModal: React.FC<AddToStashModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const { 
    stashes, 
    createStash, 
    addItemToStash, 
    removeItemFromStash, 
    isItemInStash 
  } = useStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newStashName, setNewStashName] = useState('');
  const [newStashDesc, setNewStashDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleStash = async (stashId: string) => {
    const inStash = isItemInStash(stashId, item);
    if (inStash) {
      await removeItemFromStash(stashId, item);
    } else {
      await addItemToStash(stashId, item);
    }
  };

  const handleCreateStash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStashName.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createStash(newStashName.trim(), newStashDesc.trim());
      await addItemToStash(created.id, item);
      setNewStashName('');
      setNewStashDesc('');
      setIsCreating(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-brand-navy dark:text-brand-mint" />
          <span className="font-bold text-base">Add to Collection</span>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-brand-muted dark:text-dark-muted truncate">
          Item: <span className="font-semibold text-brand-text dark:text-dark-text">"{item.title}"</span>
        </p>

        {/* Existing Stashes List */}
        <div className="space-y-2 max-h-56 overflow-y-auto p-1">
          {stashes.length === 0 ? (
            <p className="text-xs text-center text-brand-muted py-4">
              You don't have any Stashes yet. Create your first one below!
            </p>
          ) : (
            stashes.map((s) => {
              const inStash = isItemInStash(s.id, item);
              return (
                <div
                  key={s.id}
                  onClick={() => handleToggleStash(s.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-150 select-none ${
                    inStash
                      ? 'border-brand-navy dark:border-brand-mint bg-brand-mint/15 dark:bg-brand-mint/5'
                      : 'border-brand-border dark:border-dark-border bg-stone-50 dark:bg-dark-card hover:border-brand-muted'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <Folder className={`w-4 h-4 shrink-0 ${inStash ? 'text-brand-navy dark:text-brand-mint' : 'text-brand-muted'}`} />
                    <div className="truncate">
                      <p className="text-xs font-bold text-brand-text dark:text-dark-text truncate">
                        {s.name}
                      </p>
                      {s.description && (
                        <p className="text-[11px] text-brand-muted dark:text-dark-muted truncate">
                          {s.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                    inStash
                      ? 'bg-brand-navy dark:bg-brand-mint border-brand-navy dark:border-brand-mint text-white dark:text-brand-navy'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {inStash && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create New Stash Form */}
        {isCreating ? (
          <form onSubmit={handleCreateStash} className="p-3 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border dark:border-dark-border space-y-3">
            <h4 className="text-xs font-bold text-brand-text dark:text-dark-text">New Stash</h4>
            <Input
              placeholder="e.g. Mental Models, MBA Strategy..."
              value={newStashName}
              onChange={(e) => setNewStashName(e.target.value)}
              autoFocus
              required
            />
            <Input
              placeholder="Description (optional)"
              value={newStashDesc}
              onChange={(e) => setNewStashDesc(e.target.value)}
            />
            <div className="flex gap-2 justify-end pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
              >
                Create & Add
              </Button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2.5 px-3 border border-dashed border-brand-border dark:border-dark-border hover:border-brand-navy dark:hover:border-brand-mint rounded-xl text-xs font-semibold text-brand-navy dark:text-brand-mint flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Stash</span>
          </button>
        )}

        <Button
          variant="primary"
          className="w-full mt-2"
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
};
