export type Category =
  | 'Business'
  | 'Psychology'
  | 'Productivity'
  | 'Leadership'
  | 'Finance'
  | 'Philosophy'
  | 'Science'
  | 'Technology & AI'
  | 'History'
  | 'Marketing'
  | 'Strategy'
  | 'Operations'
  | 'General Knowledge';

export const CATEGORIES: Category[] = [
  'Business',
  'Psychology',
  'Productivity',
  'Leadership',
  'Finance',
  'Philosophy',
  'Science',
  'Technology & AI',
  'History',
  'Marketing',
  'Strategy',
  'Operations',
  'General Knowledge',
];

export interface Profile {
  id: string;
  display_name: string;
  avatar_url?: string;
  interests: Category[];
  daily_goal_minutes: number;
  onboarding_completed: boolean;
  preferred_theme: 'light' | 'dark' | 'system';
  created_at?: string;
}

export interface Idea {
  id: string;
  title: string;
  slug?: string;
  category: Category;
  summary: string;
  key_takeaway: string;
  why_it_matters: string;
  source_title: string;
  source_publisher: string;
  source_url: string;
  source_published_at?: string;
  discovered_at: string;
  reading_time_minutes: number;
  generation_model?: string;
  content_type?: string;
  supporting_excerpt?: string;
}

export interface IdeaSource {
  id: string;
  idea_id: string;
  source_title: string;
  source_url: string;
  publisher: string;
  publication_date?: string;
  source_type: string;
  supporting_excerpt?: string;
  verification_status: string;
}

export type ReadingStatus = 'want_to_read' | 'reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  coverUrl: string;
  publisher?: string;
  publicationYear?: number;
  isbn?: string;
  categories: string[];
  pageCount?: number;
  rating?: number;
  externalProvider?: string;
  externalProviderId?: string;
}

export interface BookSummary {
  id?: string;
  book_id?: string;
  overview: string;
  core_themes: Array<{
    title: string;
    description: string;
    practical_example: string;
  }>;
  practical_takeaways: string[];
  limitations: string;
  source_basis: string;
  generation_model?: string;
  sections?: Array<{
    section_title: string;
    section_order: number;
    section_summary: string;
    key_concepts: string[];
  }>;
}

export interface SavedIdea {
  id: string;
  user_id: string;
  idea_id: string;
  personal_notes?: string;
  created_at: string;
  idea?: Idea;
}

export interface SavedBook {
  id: string;
  user_id: string;
  book_id: string;
  reading_status: ReadingStatus;
  personal_notes?: string;
  created_at: string;
  book?: Book;
}

export interface Stash {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  item_count?: number;
  preview_images?: string[];
}

export interface StashItem {
  id: string;
  stash_id: string;
  idea_id?: string;
  book_id?: string;
  added_at: string;
  idea?: Idea;
  book?: Book;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'view_idea' | 'view_book' | 'save_idea' | 'save_book';
  idea_id?: string;
  book_id?: string;
  created_at: string;
  idea?: Idea;
  book?: Book;
}

export interface HealthStatus {
  status: string;
  isDemoMode: boolean;
  openAiConfigured: boolean;
  searchConfigured: boolean;
  searchProvider: string;
  aiModel: string;
  timestamp: string;
}

export interface HabitStreak {
  streak_days: number;
  longest_streak: number;
  last_active_date: string; // 'YYYY-MM-DD'
  daily_target: number; // e.g. 3 ideas
  today_completed_ids: string[];
}

export interface ImportedArticleResult {
  cards: Idea[];
  source: {
    title: string;
    url: string;
    domain: string;
    publisher?: string;
    author?: string;
    excerpt?: string;
    isYouTube?: boolean;
  };
  isDemo: boolean;
  generationModel?: string;
}
