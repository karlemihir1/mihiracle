import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Clock, 
  Compass, 
  BookOpen, 
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../lib/store';
import { CATEGORIES, Category } from '../../types';
import { Button } from '../ui/Button';

export const OnboardingModal: React.FC = () => {
  const { profile, completeOnboarding } = useStore();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<Category[]>(
    profile.interests?.length ? profile.interests : ['Psychology', 'Productivity', 'Business', 'Technology & AI']
  );
  const [dailyGoal, setDailyGoal] = useState<number>(profile.daily_goal_minutes || 10);

  // If already completed, do not render
  if (profile.onboarding_completed) return null;

  const toggleInterest = (cat: Category) => {
    setSelectedInterests(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = async () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#192D3A', '#B8E7BF', '#8FD89B', '#F7F8F5']
    });
    await completeOnboarding(selectedInterests, dailyGoal);
  };

  const handleSkip = async () => {
    await completeOnboarding(selectedInterests, dailyGoal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-dark-surface rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-brand-border dark:border-dark-border relative flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step 
                    ? 'w-8 bg-brand-navy dark:bg-brand-mint' 
                    : s < step 
                    ? 'w-3 bg-brand-mint-dark' 
                    : 'w-3 bg-stone-200 dark:bg-stone-700'
                }`}
              />
            ))}
          </div>
          {step < 4 && (
            <button
              onClick={handleSkip}
              className="text-xs text-brand-muted hover:text-brand-text dark:text-dark-muted underline cursor-pointer p-1"
            >
              Skip
            </button>
          )}
        </div>

        {/* Screen 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 text-center py-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-brand-navy text-brand-mint mx-auto flex items-center justify-center shadow-lg">
              <img src="/favicon.svg" alt="Mihiracle Logo" className="w-10 h-10" />
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white tracking-tight">
                Welcome to Mihiracle
              </h2>
              <p className="mt-2 text-sm text-brand-muted dark:text-dark-muted max-w-sm mx-auto">
                "Discover an idea in minutes. Understand it clearly. Save it forever."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
              <div className="p-3 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60">
                <Compass className="w-5 h-5 text-brand-navy dark:text-brand-mint mb-1.5" />
                <h4 className="text-xs font-bold text-brand-text dark:text-dark-text">Discover Ideas</h4>
                <p className="text-[11px] text-brand-muted dark:text-dark-muted mt-0.5">
                  Bite-sized cards grounded in real sources.
                </p>
              </div>

              <div className="p-3 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60">
                <BookOpen className="w-5 h-5 text-brand-navy dark:text-brand-mint mb-1.5" />
                <h4 className="text-xs font-bold text-brand-text dark:text-dark-text">Explore Books</h4>
                <p className="text-[11px] text-brand-muted dark:text-dark-muted mt-0.5">
                  Actionable takeaways & chapter breakdowns.
                </p>
              </div>

              <div className="p-3 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60">
                <Bookmark className="w-5 h-5 text-brand-navy dark:text-brand-mint mb-1.5" />
                <h4 className="text-xs font-bold text-brand-text dark:text-dark-text">Organize Stashes</h4>
                <p className="text-[11px] text-brand-muted dark:text-dark-muted mt-0.5">
                  Your permanent personal library.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full py-3 text-sm font-semibold"
              onClick={() => setStep(2)}
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Screen 2: Select Interests */}
        {step === 2 && (
          <div className="space-y-5 py-2 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-brand-text dark:text-dark-text tracking-tight">
                What do you want to learn?
              </h2>
              <p className="text-xs text-brand-muted dark:text-dark-muted mt-1">
                Select topics to personalize your daily feed and discovery recommendations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedInterests.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleInterest(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all select-none flex items-center gap-1.5 border min-h-[40px] cursor-pointer ${
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

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="w-1/3"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                className="w-2/3"
                onClick={() => setStep(3)}
                disabled={selectedInterests.length === 0}
              >
                Continue ({selectedInterests.length})
              </Button>
            </div>
          </div>
        )}

        {/* Screen 3: Daily Learning Goal */}
        {step === 3 && (
          <div className="space-y-6 py-2 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-brand-text dark:text-dark-text tracking-tight">
                Set your daily learning goal
              </h2>
              <p className="text-xs text-brand-muted dark:text-dark-muted mt-1">
                Microlearning works best through daily consistency rather than marathon cramming.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { mins: 5, label: '5 minutes / day', desc: 'Read 1-2 powerful insights over coffee.' },
                { mins: 10, label: '10 minutes / day', desc: 'Recommended: 3 idea cards or a book chapter review.' },
                { mins: 15, label: '15 minutes / day', desc: 'Deep dive: Multiple stashes and cross-topic notes.' },
              ].map(option => (
                <div
                  key={option.mins}
                  onClick={() => setDailyGoal(option.mins)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    dailyGoal === option.mins
                      ? 'border-brand-navy dark:border-brand-mint bg-brand-mint/10 dark:bg-brand-mint/5 shadow-xs'
                      : 'border-brand-border dark:border-dark-border bg-stone-50 dark:bg-dark-card hover:border-brand-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className={`w-5 h-5 ${dailyGoal === option.mins ? 'text-brand-navy dark:text-brand-mint' : 'text-brand-muted'}`} />
                    <div>
                      <h4 className="text-sm font-bold text-brand-text dark:text-dark-text">
                        {option.label}
                      </h4>
                      <p className="text-xs text-brand-muted dark:text-dark-muted mt-0.5">
                        {option.desc}
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    dailyGoal === option.mins 
                      ? 'border-brand-navy dark:border-brand-mint bg-brand-navy dark:bg-brand-mint text-white dark:text-brand-navy' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {dailyGoal === option.mins && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="w-1/3"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                className="w-2/3"
                onClick={() => setStep(4)}
              >
                Set Goal & Next
              </Button>
            </div>
          </div>
        )}

        {/* Screen 4: Ready to Start */}
        {step === 4 && (
          <div className="space-y-6 text-center py-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-brand-mint mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-brand-text dark:text-dark-text tracking-tight">
                You're ready to learn!
              </h2>
              <p className="text-xs text-brand-muted dark:text-dark-muted mt-1 max-w-sm mx-auto">
                We've curated your initial feed with {selectedInterests.length} selected interests and calibrated your {dailyGoal}-minute daily target.
              </p>
            </div>

            <div className="p-4 bg-brand-bg dark:bg-dark-card rounded-2xl border border-brand-border/60 dark:border-dark-border/60 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-brand-muted dark:text-dark-muted">Selected Interests:</span>
                <span className="font-semibold text-brand-text dark:text-dark-text truncate max-w-[200px]">
                  {selectedInterests.slice(0, 3).join(', ')}{selectedInterests.length > 3 ? ` +${selectedInterests.length - 3}` : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted dark:text-dark-muted">Daily Target:</span>
                <span className="font-semibold text-brand-text dark:text-dark-text">
                  {dailyGoal} minutes
                </span>
              </div>
            </div>

            <Button
              variant="mint"
              className="w-full py-3.5 text-sm font-bold shadow-md"
              onClick={handleFinish}
            >
              Start Learning Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
