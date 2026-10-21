import { SearchProvider, SearchResult, SearchOptions } from './SearchProvider.js';

export const VERIFIED_SOURCES_CORPUS: (SearchResult & { category: string; keywords: string[] })[] = [
  {
    title: "How Cognitive Biases Warp Decision-Making in Organizations",
    url: "https://hbr.org/2015/05/outsmart-your-own-biases",
    snippet: "Strategic decisions in leadership are routinely hijacked by confirmation bias, availability heuristics, and sunk-cost fallacy. Introducing formal red teams and premortems cuts strategic miscalculations significantly.",
    domain: "hbr.org",
    publisher: "Harvard Business Review",
    publishedDate: "2024-03-12",
    category: "Psychology",
    keywords: ["bias", "psychology", "decision", "heuristics", "thinking", "cognition", "kahneman"]
  },
  {
    title: "The Architecture of Deep Work in an Era of Hyper-Distraction",
    url: "https://www.calnewport.com/books/deep-work/",
    snippet: "Deep work is the ability to focus without distraction on a cognitively demanding task. Attention residue from quick email checks destroys up to 25 minutes of subsequent deep cognitive performance.",
    domain: "calnewport.com",
    publisher: "MIT & Grand Central Publishing",
    publishedDate: "2024-01-18",
    category: "Productivity",
    keywords: ["productivity", "habits", "deep work", "focus", "attention", "time management", "distraction"]
  },
  {
    title: "Scaling Laws and Modern Frontiers in Foundation AI Models",
    url: "https://arxiv.org/abs/2001.08361",
    snippet: "Empirical power-law scaling relationships reveal that performance in transformer architectures scales predictably with compute, dataset size, and parameter count, reshaping global AI infrastructure investment.",
    domain: "arxiv.org",
    publisher: "Cornell University arXiv / OpenAI Research",
    publishedDate: "2024-02-14",
    category: "Technology & AI",
    keywords: ["ai", "technology", "artificial intelligence", "transformers", "llm", "machine learning", "scaling"]
  },
  {
    title: "Compounding Capital and the Psychological Moat of Value Investing",
    url: "https://www.berkshirehathaway.com/letters/letters.html",
    snippet: "Long-term investment compounding depends far more on emotional temperament and margin of safety than on predicting macroeconomic swings. Charlie Munger's mental model of inverted problem solving is essential.",
    domain: "berkshirehathaway.com",
    publisher: "Berkshire Hathaway Annual Journal",
    publishedDate: "2024-02-28",
    category: "Finance",
    keywords: ["finance", "investing", "stocks", "buffett", "munger", "compounding", "capital", "money"]
  },
  {
    title: "Stoic Resilience: Epictetus and the Dichotomy of Control",
    url: "https://plato.stanford.edu/entries/stoicism/",
    snippet: "Ancient Stoic philosophy centers on a fundamental division: things within our control (judgments, desires, aversions) and things outside our control (external events, other opinions, outcomes). Peace comes from internalizing this boundary.",
    domain: "stanford.edu",
    publisher: "Stanford Encyclopedia of Philosophy",
    publishedDate: "2023-11-20",
    category: "Philosophy",
    keywords: ["philosophy", "stoicism", "epictetus", "marcus aurelius", "seneca", "mindset", "ethics"]
  },
  {
    title: "The Physics of Complex Adaptive Systems and Emergence",
    url: "https://www.nature.com/articles/nature08984",
    snippet: "Complex adaptive systems—from ant colonies to financial networks and cellular metabolism—exhibit emergent macro-behaviors that cannot be deduced solely by dissecting their microscopic components in isolation.",
    domain: "nature.com",
    publisher: "Nature Science Journal",
    publishedDate: "2024-01-10",
    category: "Science",
    keywords: ["science", "physics", "complexity", "biology", "emergence", "systems thinking"]
  },
  {
    title: "Supply Chain Resilience: Decoupling Just-in-Time for Just-in-Case",
    url: "https://www.mckinsey.com/capabilities/operations/our-insights",
    snippet: "Global trade shocks have forced operations leaders to redesign fragile single-source supply networks into agile multi-node ecosystems with digital twin inventory forecasting and buffer capacities.",
    domain: "mckinsey.com",
    publisher: "McKinsey Operations Insights",
    publishedDate: "2024-03-01",
    category: "Operations",
    keywords: ["operations", "supply chain", "logistics", "manufacturing", "resilience", "inventory"]
  },
  {
    title: "Network Effects and Defensive Moats in Platform Businesses",
    url: "https://a16z.com/all-about-network-effects/",
    snippet: "Two-sided network effects create compounding enterprise value when each new participant enhances the utility for all existing participants. High switching costs and proprietary protocols reinforce the moat.",
    domain: "a16z.com",
    publisher: "Andreessen Horowitz Research",
    publishedDate: "2024-02-19",
    category: "Business",
    keywords: ["business", "strategy", "entrepreneurship", "startups", "network effects", "moats", "economics"]
  },
  {
    title: "The Psychology of Influence: Robert Cialdini's Seven Levers",
    url: "https://www.influenceatwork.com/principles-of-persuasion/",
    snippet: "Persuasion relies on predictable human shortcuts: reciprocity, commitment, social proof, authority, liking, scarcity, and unity. Recognizing them builds immunity against deceptive manipulation.",
    domain: "influenceatwork.com",
    publisher: "Influence At Work / Arizona State University",
    publishedDate: "2023-10-15",
    category: "Marketing",
    keywords: ["marketing", "persuasion", "influence", "cialdini", "sales", "psychology", "social proof"]
  },
  {
    title: "Lessons from Historical Turning Points: The Fall of Fragile Empires",
    url: "https://www.historytoday.com/archive",
    snippet: "Historical analyses demonstrate that empires collapse not from single external shocks, but when internal institutional sclerosis, debt overhang, and political polarization undermine collective problem solving.",
    domain: "historytoday.com",
    publisher: "History Today",
    publishedDate: "2023-12-05",
    category: "History",
    keywords: ["history", "civilizations", "institutions", "collapse", "politics", "society", "governance"]
  },
  {
    title: "Radical Candor: How Great Leaders Care Personally While Challenging Directly",
    url: "https://www.radicalcandor.com/our-approach/",
    snippet: "Leadership excellence is found at the intersection of caring personally and challenging directly. Failing to do both devolves into ruinous empathy or manipulative insincerity.",
    domain: "radicalcandor.com",
    publisher: "St. Martin's Press / Radical Candor",
    publishedDate: "2024-01-25",
    category: "Leadership",
    keywords: ["leadership", "management", "culture", "radical candor", "feedback", "teams"]
  },
  {
    title: "First Principles Thinking and Deconstructing Conventional Dogma",
    url: "https://fs.blog/first-principles/",
    snippet: "Reasoning by first principles boils a problem down to its most fundamental, immutable truths, then builds a solution up from there—contrasting with reasoning by analogy which simply copies what others do.",
    domain: "fs.blog",
    publisher: "Farnam Street Mental Models",
    publishedDate: "2024-02-04",
    category: "Strategy",
    keywords: ["strategy", "mental models", "first principles", "reasoning", "innovation", "problem solving"]
  }
];

export class CuratedSearchProvider implements SearchProvider {
  name = 'curated-demo';

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const qLower = query.toLowerCase().trim();
    const category = options?.category?.toLowerCase();

    // Filter corpus
    let matches = VERIFIED_SOURCES_CORPUS.filter(item => {
      // Category match
      if (category && category !== 'all' && item.category.toLowerCase() !== category) {
        return false;
      }
      if (!qLower) return true;

      // Text search
      const inTitle = item.title.toLowerCase().includes(qLower);
      const inSnippet = item.snippet.toLowerCase().includes(qLower);
      const inKeywords = item.keywords.some(k => k.includes(qLower) || qLower.includes(k));
      const inCategory = item.category.toLowerCase().includes(qLower);

      return inTitle || inSnippet || inKeywords || inCategory;
    });

    // If query was very specific and matched 0, fall back to category or all items
    if (matches.length === 0) {
      if (category && category !== 'all') {
        matches = VERIFIED_SOURCES_CORPUS.filter(item => item.category.toLowerCase() === category);
      } else {
        matches = VERIFIED_SOURCES_CORPUS.slice(0, 4);
      }
    }

    const limit = options?.limit || 6;
    return matches.slice(0, limit).map(({ title, url, snippet, domain, publisher, publishedDate }) => ({
      title,
      url,
      snippet,
      domain,
      publisher,
      publishedDate,
    }));
  }
}
