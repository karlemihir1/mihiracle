import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  RefreshCw, 
  Bookmark, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Bot, 
  Share2,
  Atom,
  Brain,
  Compass,
  Zap,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { Idea } from '../../types';

interface BreakthroughTheory {
  id: string;
  title: string;
  theorist: string;
  field: string;
  accentColor: 'volt' | 'cyan' | 'pink' | 'amber';
  summary: string;
  coreInsight: string;
  keyTakeaway: string;
  realWorldApplication: string;
  relatedBookQuery: string;
}

const BREAKTHROUGH_THEORIES: BreakthroughTheory[] = [
  {
    id: 'theory-simulation',
    title: 'The Simulation Argument',
    theorist: 'Nick Bostrom (2003)',
    field: 'Philosophy & Physics',
    accentColor: 'volt',
    summary: 'If civilizations survive to achieve technological maturity, they will possess the computational power to run vast ancestor simulations. Statistically, simulated minds would outnumber physical minds by billions to one.',
    coreInsight: 'At least one of three propositions is almost certainly true: humanity will go extinct before maturity; mature civilizations have zero interest in simulations; or we almost certainly live in a computer simulation.',
    keyTakeaway: 'Reality may be computational rather than material. Treat empirical physics as software mechanics and maintain epistemic humility.',
    realWorldApplication: 'Helps computer scientists architect nested virtual worlds and challenges fundamental assumptions about the nature of space-time.',
    relatedBookQuery: 'Superintelligence Bostrom'
  },
  {
    id: 'theory-fermi-filter',
    title: 'The Great Filter & Fermi Paradox',
    theorist: 'Robin Hanson & Enrico Fermi',
    field: 'Astrophysics & Evolutionary Theory',
    accentColor: 'cyan',
    summary: 'The universe is 13.8 billion years old with trillions of habitable planets, yet we observe zero evidence of extraterrestrial civilization. Somewhere along the path from non-living matter to interstellar civilization lies an evolutionary barrier almost impossible to cross.',
    coreInsight: 'If the Great Filter is behind us (e.g. abiogenesis or eukaryotic life), humanity is uniquely rare and precious. If the filter is ahead (e.g. nuclear war, engineered pandemics, or unaligned AI), our extinction probability is terrifyingly high.',
    keyTakeaway: 'The silence of the cosmos is a warning: the survival of intelligent consciousness is the ultimate existential imperative.',
    realWorldApplication: 'Directly informs planetary risk assessment, existential safety research, and long-term space colonization redundancy.',
    relatedBookQuery: 'The Precipice Toby Ord'
  },
  {
    id: 'theory-bayesian-brain',
    title: 'The Predictive Brain (Free Energy Principle)',
    theorist: 'Karl Friston (2006)',
    field: 'Neuroscience & Cognitive AI',
    accentColor: 'pink',
    summary: 'Your brain does not passively receive sensory data from the eyes and ears. Instead, it is an active generative prediction engine that continuously projects an internal model of reality, only updating when an unexpected prediction error arrives.',
    coreInsight: 'Perception is controlled hallucination. What you experience right now is not the objective world, but your brains best hypothesis constrained by sensory error signals.',
    keyTakeaway: 'To master learning, deliberately expose yourself to anomalies that break your current mental models rather than seeking confirmation.',
    realWorldApplication: 'Forms the architectural backbone of next-generation predictive AI models and explains modern anxiety as prediction-error overload.',
    relatedBookQuery: 'Surfing Uncertainty Andy Clark'
  },
  {
    id: 'theory-antifragility',
    title: 'Antifragility & Convexity',
    theorist: 'Nassim Nicholas Taleb',
    field: 'Complex Systems & Strategy',
    accentColor: 'amber',
    summary: 'The resilient resists shocks and stays the same; the fragile shatters; but the antifragile actually grows stronger and improves when exposed to volatility, randomness, stressors, and disorder.',
    coreInsight: 'Anything that has more upside than downside from random events (convex payoff) is antifragile. You cannot predict crises, but you can build systems that thrive because of them.',
    keyTakeaway: 'Eliminate ruin risk (downside), then embrace small, continuous trial-and-error stressors to compound asymmetric gains.',
    realWorldApplication: 'Applied in decentralized system design, immune system conditioning (hormesis), and barbell investment strategies.',
    relatedBookQuery: 'Antifragile Taleb'
  },
  {
    id: 'theory-godel',
    title: "Gödel's Incompleteness Theorems",
    theorist: 'Kurt Gödel (1931)',
    field: 'Mathematical Logic',
    accentColor: 'cyan',
    summary: 'In any consistent axiomatic mathematical system capable of doing basic arithmetic, there are true mathematical statements that cannot be proven from within the system itself.',
    coreInsight: 'Truth is fundamentally larger than provability. No logical system can fully comprehend or validate itself without stepping into a larger meta-system.',
    keyTakeaway: 'Beware of dogmatic closed systems. Every intellectual framework contains blind spots that require outside perspectives to diagnose.',
    realWorldApplication: 'Proved the theoretical limits of deterministic computing and inspired Alan Turing to discover the Halting Problem.',
    relatedBookQuery: 'Godel Escher Bach Hofstadter'
  },
  {
    id: 'theory-nash',
    title: 'Nash Equilibrium & Schelling Points',
    theorist: 'John Nash & Thomas Schelling',
    field: 'Game Theory & Economics',
    accentColor: 'volt',
    summary: 'A state in a multi-agent game where no player has an incentive to unilaterally change their strategy given what everyone else is doing, even if mutual cooperation would yield vastly superior results for all.',
    coreInsight: 'Individually rational decisions systematically produce collectively catastrophic outcomes (like the Prisoners Dilemma and climate tragedies) unless incentive architectures are altered.',
    keyTakeaway: 'Do not blame individuals for poor outcomes; redesign the payoff matrix and create transparent focal points for cooperation.',
    realWorldApplication: 'Used to govern auction mechanisms, cryptocurrency consensus algorithms, and international treaty negotiations.',
    relatedBookQuery: 'The Strategy of Conflict Schelling'
  }
];

export const DiscoverTheoriesModal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isDiscoverModalOpen, 
    setDiscoverModalOpen, 
    saveIdea, 
    isIdeaSaved,
    setAIAssistantOpen,
    setActiveContextItem
  } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const currentTheory = useMemo(() => {
    return BREAKTHROUGH_THEORIES[currentIndex % BREAKTHROUGH_THEORIES.length];
  }, [currentIndex]);

  if (!isDiscoverModalOpen) return null;

  const handleNextTheory = () => {
    setIsRotating(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % BREAKTHROUGH_THEORIES.length);
      setIsRotating(false);
    }, 200);
  };

  const handleSaveToStash = () => {
    const asIdea: Idea = {
      id: currentTheory.id,
      title: currentTheory.title,
      category: 'Philosophy',
      summary: currentTheory.summary,
      key_takeaway: currentTheory.keyTakeaway,
      why_it_matters: currentTheory.realWorldApplication,
      source_title: currentTheory.theorist,
      source_publisher: currentTheory.field,
      source_url: `https://en.wikipedia.org/wiki/${encodeURIComponent(currentTheory.title.replace(/\s+/g, '_'))}`,
      discovered_at: new Date().toISOString(),
      reading_time_minutes: 2,
      generation_model: 'breakthrough-theory-v1',
      supporting_excerpt: currentTheory.coreInsight
    };
    saveIdea(asIdea);
  };

  const handleAskAI = () => {
    setActiveContextItem({
      type: 'idea',
      title: currentTheory.title,
      content: `${currentTheory.summary}\n\nCore Insight: ${currentTheory.coreInsight}`
    });
    setDiscoverModalOpen(false);
    setAIAssistantOpen(true);
  };

  const handleFindBooks = () => {
    setDiscoverModalOpen(false);
    navigate(`/books?q=${encodeURIComponent(currentTheory.relatedBookQuery)}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentTheory.title,
        text: `${currentTheory.title}: ${currentTheory.coreInsight}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${currentTheory.title} — ${currentTheory.coreInsight}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const alreadySaved = isIdeaSaved(currentTheory.id);

  // Accent styling helpers matching the Capi Creative image palette
  const accentStyles = {
    volt: {
      badge: 'bg-[#D4FF00]/15 text-[#D4FF00] border-[#D4FF00]/40',
      pill: 'bg-[#D4FF00] text-black font-bold shadow-[0_0_20px_rgba(212,255,0,0.4)]',
      border: 'border-[#D4FF00]/30',
      glow: 'shadow-[0_0_35px_rgba(212,255,0,0.15)]',
      dot: 'bg-[#D4FF00]',
      gradient: 'from-[#D4FF00]/20 via-transparent to-transparent'
    },
    cyan: {
      badge: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40',
      pill: 'bg-[#00F0FF] text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]',
      border: 'border-[#00F0FF]/30',
      glow: 'shadow-[0_0_35px_rgba(0,240,255,0.15)]',
      dot: 'bg-[#00F0FF]',
      gradient: 'from-[#00F0FF]/20 via-transparent to-transparent'
    },
    pink: {
      badge: 'bg-[#FF007A]/15 text-[#FF007A] border-[#FF007A]/40',
      pill: 'bg-[#FF007A] text-white font-bold shadow-[0_0_20px_rgba(255,0,122,0.4)]',
      border: 'border-[#FF007A]/30',
      glow: 'shadow-[0_0_35px_rgba(255,0,122,0.15)]',
      dot: 'bg-[#FF007A]',
      gradient: 'from-[#FF007A]/20 via-transparent to-transparent'
    },
    amber: {
      badge: 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40',
      pill: 'bg-[#FFB800] text-black font-bold shadow-[0_0_20px_rgba(255,184,0,0.4)]',
      border: 'border-[#FFB800]/30',
      glow: 'shadow-[0_0_35px_rgba(255,184,0,0.15)]',
      dot: 'bg-[#FFB800]',
      gradient: 'from-[#FFB800]/20 via-transparent to-transparent'
    }
  }[currentTheory.accentColor];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setDiscoverModalOpen(false);
      }}
    >
      <div 
        className={`relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[28px] bg-[#161822] text-white border ${accentStyles.border} ${accentStyles.glow} shadow-2xl transition-all duration-300 p-6 sm:p-8 no-scrollbar`}
      >
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 left-0 right-0 h-36 bg-gradient-to-b ${accentStyles.gradient} rounded-t-[28px] pointer-events-none`} />

        {/* Header bar */}
        <div className="relative flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${accentStyles.badge}`}>
              <Sparkles className="w-3.5 h-3.5" />
              Breakthrough Theory
            </span>
            <span className="text-xs text-[#8E92A4] font-medium">
              {currentIndex + 1} of {BREAKTHROUGH_THEORIES.length}
            </span>
          </div>

          <button
            onClick={() => setDiscoverModalOpen(false)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with transition */}
        <div className={`space-y-5 transition-opacity duration-200 ${isRotating ? 'opacity-20 scale-[0.98]' : 'opacity-100 scale-100'}`}>
          {/* Title & Originator */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {currentTheory.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8E92A4]">
              <span className="font-semibold text-white/90">{currentTheory.theorist}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                {currentTheory.field}
              </span>
            </div>
          </div>

          {/* Core Insight Glassmorphic Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1C1E2A]/90 border border-white/10 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${accentStyles.badge}`}>
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8E92A4] mb-1">
                  Core Axiom
                </p>
                <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                  "{currentTheory.coreInsight}"
                </p>
              </div>
            </div>
          </div>

          {/* Deep Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E92A4]">
              How It Works
            </h4>
            <p className="text-sm text-[#D1D5DB] leading-relaxed">
              {currentTheory.summary}
            </p>
          </div>

          {/* Key Takeaway & Application Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#1A1D27] border border-white/5">
              <span className="text-[11px] font-bold text-[#D4FF00] uppercase tracking-wider block mb-1">
                Mental Model
              </span>
              <p className="text-xs text-white/90 leading-normal">
                {currentTheory.keyTakeaway}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1A1D27] border border-white/5">
              <span className="text-[11px] font-bold text-[#00F0FF] uppercase tracking-wider block mb-1">
                Real World Impact
              </span>
              <p className="text-xs text-white/90 leading-normal">
                {currentTheory.realWorldApplication}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="mt-7 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left Buttons: Save & Discuss */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSaveToStash}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                alreadySaved 
                  ? 'bg-[#D4FF00]/15 text-[#D4FF00] border-[#D4FF00]/40' 
                  : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
              }`}
            >
              {alreadySaved ? (
                <>
                  <Check className="w-4 h-4 text-[#D4FF00]" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save to Stash</span>
                </>
              )}
            </button>

            <button
              onClick={handleAskAI}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#00F0FF]" />
              <span>Discuss AI</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Share Theory"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Right Main Action: Roll Next Theory (Styled like Capi Creative neon button) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleFindBooks}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-medium text-[#8E92A4] hover:text-white transition-colors"
            >
              Related Books →
            </button>

            <button
              onClick={handleNextTheory}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4FF00] hover:bg-[#c2eb00] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(212,255,0,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-black ${isRotating ? 'animate-spin' : ''}`} />
              <span>Roll Next Theory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
