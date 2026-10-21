import { BookProvider, BookMetadata } from './BookProvider.js';

export const CURATED_BOOKS_CORPUS: BookMetadata[] = [
  {
    id: "curated-atomic-habits",
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    authors: ["James Clear"],
    description: "A comprehensive, practical guide on how to change your habits and get 1% better every day. Using concepts from biology, psychology, and neuroscience, Clear shows how minute shifts create exponential compound results.",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    publisher: "Avery / Penguin Random House",
    publicationYear: 2018,
    isbn: "9780735211292",
    categories: ["Productivity", "Psychology"],
    pageCount: 320,
    rating: 4.8,
    externalProvider: "curated",
    externalProviderId: "atomic-habits"
  },
  {
    id: "curated-thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    authors: ["Daniel Kahneman"],
    description: "Nobel laureate Daniel Kahneman explains the two systems that drive the way we think: System 1 (fast, intuitive, emotional) and System 2 (slower, deliberate, logical), revealing the systematic biases that warp judgment.",
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
    publisher: "Farrar, Straus and Giroux",
    publicationYear: 2011,
    isbn: "9780374533557",
    categories: ["Psychology", "Finance", "Strategy"],
    pageCount: 499,
    rating: 4.7,
    externalProvider: "curated",
    externalProviderId: "thinking-fast-slow"
  },
  {
    id: "curated-deep-work",
    title: "Deep Work: Rules for Focused Success in a Distracted World",
    authors: ["Cal Newport"],
    description: "Cal Newport argues that the ability to focus without distraction on cognitively demanding tasks is becoming increasingly rare at the exact same time it is becoming increasingly valuable in our economy.",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400",
    publisher: "Grand Central Publishing",
    publicationYear: 2016,
    isbn: "9781455586691",
    categories: ["Productivity", "Technology & AI"],
    pageCount: 304,
    rating: 4.6,
    externalProvider: "curated",
    externalProviderId: "deep-work"
  },
  {
    id: "curated-psychology-of-money",
    title: "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness",
    authors: ["Morgan Housel"],
    description: "Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Housel shares 19 short stories exploring the strange ways people think about money.",
    coverUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400",
    publisher: "Harriman House",
    publicationYear: 2020,
    isbn: "9780857197689",
    categories: ["Finance", "Psychology"],
    pageCount: 256,
    rating: 4.8,
    externalProvider: "curated",
    externalProviderId: "psychology-of-money"
  },
  {
    id: "curated-sapiens",
    title: "Sapiens: A Brief History of Humankind",
    authors: ["Yuval Noah Harari"],
    description: "From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution, exploring how biology and history have defined us and enhanced our understanding of what it means to be human.",
    coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400",
    publisher: "Harper",
    publicationYear: 2014,
    isbn: "9780062316097",
    categories: ["History", "Philosophy", "General Knowledge"],
    pageCount: 464,
    rating: 4.7,
    externalProvider: "curated",
    externalProviderId: "sapiens"
  },
  {
    id: "curated-zero-to-one",
    title: "Zero to One: Notes on Startups, or How to Build the Future",
    authors: ["Peter Thiel", "Blake Masters"],
    description: "The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. Thiel explains how building innovative monopolies through vertical progress creates lasting value.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
    publisher: "Crown Business",
    publicationYear: 2014,
    isbn: "9780804139298",
    categories: ["Business", "Strategy", "Technology & AI"],
    pageCount: 224,
    rating: 4.6,
    externalProvider: "curated",
    externalProviderId: "zero-to-one"
  },
  {
    id: "curated-antifragile",
    title: "Antifragile: Things That Gain from Disorder",
    authors: ["Nassim Nicholas Taleb"],
    description: "Just as human bones get stronger when subjected to stress and tension, many things in life benefit from stress, disorder, volatility, and turmoil. Taleb introduces the concept of antifragility across systems and personal strategy.",
    coverUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400",
    publisher: "Random House",
    publicationYear: 2012,
    isbn: "9781400067824",
    categories: ["Philosophy", "Strategy", "Finance"],
    pageCount: 544,
    rating: 4.5,
    externalProvider: "curated",
    externalProviderId: "antifragile"
  },
  {
    id: "curated-high-output-management",
    title: "High Output Management",
    authors: ["Andrew S. Grove"],
    description: "Former Intel CEO Andy Grove's masterclass on creating and maintaining new businesses. It covers managerial leverage, operational architecture, eliciting peak performance from subordinates, and meeting design.",
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400",
    publisher: "Vintage Books",
    publicationYear: 1995,
    isbn: "9780679762881",
    categories: ["Leadership", "Operations", "Business"],
    pageCount: 272,
    rating: 4.8,
    externalProvider: "curated",
    externalProviderId: "high-output-management"
  }
];

export class CuratedBooksProvider implements BookProvider {
  name = 'curated';

  async searchBooks(query: string, options?: { category?: string; limit?: number }): Promise<BookMetadata[]> {
    const qLower = query.toLowerCase().trim();
    const catLower = options?.category?.toLowerCase();

    let matches = CURATED_BOOKS_CORPUS.filter(book => {
      if (catLower && catLower !== 'all') {
        const hasCategory = book.categories.some(c => c.toLowerCase() === catLower);
        if (!hasCategory) return false;
      }

      if (!qLower) return true;

      const titleMatch = book.title.toLowerCase().includes(qLower);
      const authorMatch = book.authors.some(a => a.toLowerCase().includes(qLower));
      const descMatch = book.description.toLowerCase().includes(qLower);

      return titleMatch || authorMatch || descMatch;
    });

    if (matches.length === 0 && !qLower) {
      matches = CURATED_BOOKS_CORPUS;
    }

    const limit = options?.limit || 8;
    return matches.slice(0, limit);
  }

  async getBookDetails(id: string): Promise<BookMetadata | null> {
    return CURATED_BOOKS_CORPUS.find(b => b.id === id || b.externalProviderId === id) || null;
  }
}
