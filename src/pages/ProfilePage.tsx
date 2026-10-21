import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Sparkles, 
  BookOpen, 
  Folder, 
  Clock, 
  Sun, 
  Moon, 
  Laptop, 
  LogOut, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Bookmark,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../lib/store';
import { CATEGORIES, Category } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    profile, 
    updateProfile, 
    updateInterests, 
    updateDailyGoal, 
    theme, 
    setTheme, 
    signOut, 
    deleteAccount,
    savedIdeas,
    savedBooks,
    stashes
  } = useStore();

  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [selectedInterests, setSelectedInterests] = useState<Category[]>(profile.interests || []);
  const [dailyGoal, setDailyGoal] = useState<number>(profile.daily_goal_minutes || 10);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleInterest = (cat: Category) => {
    setSelectedInterests(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        display_name: displayName.trim(),
        interests: selectedInterests,
        daily_goal_minutes: dailyGoal,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    setIsDeleteModalOpen(false);
    navigate('/auth');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto pb-12">
      {/* Profile Header Hero Card */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <div className="w-20 h-20 rounded-2xl bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy font-bold text-3xl flex items-center justify-center shadow-lg shrink-0">
          {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'M'}
        </div>

        <div className="space-y-1 flex-1">
          <h1 className="font-serif text-2xl font-bold text-brand-navy dark:text-white tracking-tight">
            {profile.display_name || 'Learner'}
          </h1>
          <p className="text-xs text-brand-muted dark:text-dark-muted font-medium">
            {user?.email || 'guest@mihiracle.app'}
          </p>

          <div className="pt-3 grid grid-cols-3 gap-2 border-t border-brand-border/60 dark:border-dark-border/60 mt-3">
            <div className="p-2 bg-brand-bg dark:bg-dark-card rounded-xl text-center">
              <p className="text-lg font-bold text-brand-navy dark:text-brand-mint">
                {savedIdeas.length}
              </p>
              <p className="text-[10px] text-brand-muted uppercase font-semibold">Ideas</p>
            </div>
            <div className="p-2 bg-brand-bg dark:bg-dark-card rounded-xl text-center">
              <p className="text-lg font-bold text-brand-navy dark:text-brand-mint">
                {savedBooks.length}
              </p>
              <p className="text-[10px] text-brand-muted uppercase font-semibold">Books</p>
            </div>
            <div className="p-2 bg-brand-bg dark:bg-dark-card rounded-xl text-center">
              <p className="text-lg font-bold text-brand-navy dark:text-brand-mint">
                {stashes.length}
              </p>
              <p className="text-[10px] text-brand-muted uppercase font-semibold">Stashes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Info */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-xs space-y-4">
          <h2 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
            <User className="w-4 h-4 text-brand-navy dark:text-brand-mint" />
            Personal Details
          </h2>

          <div>
            <label className="text-xs font-semibold text-brand-text dark:text-dark-text block mb-1">
              Display Name
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name or handle"
              required
            />
          </div>
        </div>

        {/* Selected Interests */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-xs space-y-4">
          <h2 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-navy dark:text-brand-mint" />
            Learning Topics & Interests
          </h2>
          <p className="text-xs text-brand-muted dark:text-dark-muted">
            These preferences tune your daily feed and discovery recommendations.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedInterests.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all select-none flex items-center gap-1.5 border min-h-[36px] cursor-pointer ${
                    isSelected
                      ? 'bg-brand-navy text-white dark:bg-brand-mint dark:text-brand-navy border-transparent shadow-xs'
                      : 'bg-stone-50 dark:bg-dark-card hover:bg-stone-100 text-brand-text dark:text-dark-text border-brand-border dark:border-dark-border'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-xs space-y-4">
          <h2 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-navy dark:text-brand-mint" />
            Daily Learning Goal
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {[5, 10, 15].map((mins) => (
              <button
                type="button"
                key={mins}
                onClick={() => setDailyGoal(mins)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                  dailyGoal === mins
                    ? 'border-brand-navy dark:border-brand-mint bg-brand-mint/15 dark:bg-brand-mint/5 text-brand-navy dark:text-brand-mint font-bold shadow-xs'
                    : 'border-brand-border dark:border-dark-border bg-stone-50 dark:bg-dark-card text-brand-text dark:text-dark-text hover:border-brand-muted'
                }`}
              >
                <p className="text-base sm:text-lg font-bold">{mins} min</p>
                <p className="text-[10px] text-brand-muted dark:text-dark-muted mt-0.5">daily habit</p>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-xs space-y-4">
          <h2 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
            <Sun className="w-4 h-4 text-brand-navy dark:text-brand-mint" />
            Appearance & Theme
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ].map(t => {
              const Icon = t.icon;
              const isSelected = theme === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-brand-navy dark:border-brand-mint bg-brand-mint/15 dark:bg-brand-mint/5 text-brand-navy dark:text-brand-mint font-bold shadow-xs'
                      : 'border-brand-border dark:border-dark-border bg-stone-50 dark:bg-dark-card text-brand-text dark:text-dark-text hover:border-brand-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-brand-mint flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved!
            </span>
          ) : <span />}

          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            className="px-6 font-bold shadow-xs"
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* Account Management & Danger Zone */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 sm:p-8 border border-brand-border dark:border-dark-border shadow-xs space-y-4">
        <h2 className="text-base font-bold text-brand-text dark:text-dark-text flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-navy dark:text-brand-mint" />
          Account Management
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full sm:w-auto text-xs font-semibold min-h-[44px]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full sm:w-auto text-xs font-semibold min-h-[44px]"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account & Reset
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account & Data"
      >
        <div className="space-y-4 text-sm text-brand-text dark:text-dark-text">
          <p>
            Are you sure you want to delete your account? This action is permanent and will remove all your saved ideas, custom stashes, and personal notes.
          </p>

          <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>This cannot be undone. All offline data and account links will be wiped immediately.</span>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
