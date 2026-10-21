import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Profile, 
  Idea, 
  Book, 
  SavedIdea, 
  SavedBook, 
  Stash, 
  StashItem, 
  Category, 
  ReadingStatus, 
  UserActivity,
  HealthStatus,
  HabitStreak
} from '../types';
import { INITIAL_IDEAS, INITIAL_BOOKS, INITIAL_STASHES } from '../services/mockData';
import { supabase, isSupabaseConfigured } from './supabase';
import { fetchHealth } from '../services/api';

interface StoreContextType {
  // Auth & Profile
  user: { id: string; email: string } | null;
  profile: Profile;
  isLoadingAuth: boolean;
  loginAsGuest: () => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updateInterests: (interests: Category[]) => Promise<void>;
  updateDailyGoal: (minutes: number) => Promise<void>;
  completeOnboarding: (interests: Category[], dailyGoal: number) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;

  // Ideas & Reading
  allIdeas: Idea[];
  savedIdeas: SavedIdea[];
  saveIdea: (idea: Idea, notes?: string) => Promise<void>;
  removeSavedIdea: (ideaId: string) => Promise<void>;
  updateIdeaNotes: (ideaId: string, notes: string) => Promise<void>;
  isIdeaSaved: (ideaId: string) => boolean;
  addCustomIdea: (idea: Partial<Idea> & { title: string; summary: string }) => Idea;

  // Habit & Streaks (Deepstash-style daily learning)
  streak: HabitStreak;
  markIdeaAsRead: (ideaId: string) => void;
  isIdeaReadToday: (ideaId: string) => boolean;
  updateDailyTarget: (target: number) => void;

  // Books
  savedBooks: SavedBook[];
  saveBook: (book: Book, status?: ReadingStatus, notes?: string) => Promise<void>;
  removeSavedBook: (bookId: string) => Promise<void>;
  updateBookStatus: (bookId: string, status: ReadingStatus) => Promise<void>;
  updateBookNotes: (bookId: string, notes: string) => Promise<void>;
  isBookSaved: (bookId: string) => boolean;
  getBookStatus: (bookId: string) => ReadingStatus | null;

  // Stashes (Collections)
  stashes: Stash[];
  stashItems: StashItem[];
  createStash: (name: string, description?: string) => Promise<Stash>;
  updateStash: (id: string, name: string, description?: string) => Promise<void>;
  deleteStash: (id: string) => Promise<void>;
  addItemToStash: (stashId: string, item: { ideaId?: string; bookId?: string }) => Promise<void>;
  removeItemFromStash: (stashId: string, item: { ideaId?: string; bookId?: string }) => Promise<void>;
  isItemInStash: (stashId: string, item: { ideaId?: string; bookId?: string }) => boolean;
  getStashesForItem: (item: { ideaId?: string; bookId?: string }) => Stash[];

  // Activity & Recents
  recentActivity: UserActivity[];
  recordActivity: (activity: 'view_idea' | 'view_book', item: { idea?: Idea; book?: Book }) => void;
  
  // Search History
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  removeSearchHistoryItem: (query: string) => void;

  // Daily Dismissals
  dismissDailyIdea: (ideaId: string) => void;
  isDailyIdeaDismissed: (ideaId: string) => boolean;

  // App & System state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  isOnline: boolean;
  health: HealthStatus | null;
  activeContextItem: { type: 'idea' | 'book' | 'stash'; title: string; content?: string } | null;
  setActiveContextItem: (ctx: { type: 'idea' | 'book' | 'stash'; title: string; content?: string } | null) => void;
  isAIAssistantOpen: boolean;
  setAIAssistantOpen: (open: boolean) => void;
  isSideMenuOpen: boolean;
  setSideMenuOpen: (open: boolean) => void;
  isDiscoverModalOpen: boolean;
  setDiscoverModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const GUEST_USER = {
  id: 'guest-user-001',
  email: 'learner@mihiracle.app'
};

const DEFAULT_PROFILE: Profile = {
  id: 'guest-user-001',
  display_name: 'Mihir',
  avatar_url: '',
  interests: ['Business', 'Psychology', 'Productivity', 'Technology & AI', 'Philosophy'],
  daily_goal_minutes: 10,
  onboarding_completed: false,
  preferred_theme: 'dark',
};

const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DEFAULT_STREAK: HabitStreak = {
  streak_days: 1,
  longest_streak: 1,
  last_active_date: getTodayDateString(),
  daily_target: 2,
  today_completed_ids: [],
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load local state initializers
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    const saved = localStorage.getItem('mihiracle_user');
    return saved ? JSON.parse(saved) : GUEST_USER;
  });

  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('mihiracle_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [allIdeas, setAllIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('mihiracle_custom_ideas');
    if (saved) {
      try {
        const custom: Idea[] = JSON.parse(saved);
        const existingIds = new Set(INITIAL_IDEAS.map(i => i.id));
        return [...custom.filter(c => !existingIds.has(c.id)), ...INITIAL_IDEAS];
      } catch {
        return INITIAL_IDEAS;
      }
    }
    return INITIAL_IDEAS;
  });

  const [streak, setStreak] = useState<HabitStreak>(() => {
    const saved = localStorage.getItem('mihiracle_habit_streak');
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    if (saved) {
      try {
        const parsed: HabitStreak = JSON.parse(saved);
        const target = parsed.daily_target === 3 || !parsed.daily_target ? 2 : parsed.daily_target;
        if (parsed.last_active_date === today) {
          return { ...parsed, daily_target: target };
        }
        if (parsed.last_active_date === yesterday) {
          return {
            ...parsed,
            daily_target: target,
            today_completed_ids: []
          };
        }
        return {
          ...parsed,
          daily_target: target,
          streak_days: 0,
          today_completed_ids: []
        };
      } catch {
        return DEFAULT_STREAK;
      }
    }
    return DEFAULT_STREAK;
  });

  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>(() => {
    const saved = localStorage.getItem('mihiracle_saved_ideas');
    if (saved) return JSON.parse(saved);
    // Seed initial saved idea for pleasant first-run
    return [
      {
        id: 'saved-1',
        user_id: GUEST_USER.id,
        idea_id: INITIAL_IDEAS[0].id,
        personal_notes: 'Must use this in our next product roadmap review.',
        created_at: new Date().toISOString(),
        idea: INITIAL_IDEAS[0]
      }
    ];
  });

  const [savedBooks, setSavedBooks] = useState<SavedBook[]>(() => {
    const saved = localStorage.getItem('mihiracle_saved_books');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'saved-book-1',
        user_id: GUEST_USER.id,
        book_id: INITIAL_BOOKS[0].id,
        reading_status: 'reading',
        personal_notes: 'Focus on habit stacking and environmental cues.',
        created_at: new Date().toISOString(),
        book: INITIAL_BOOKS[0]
      }
    ];
  });

  const [stashes, setStashes] = useState<Stash[]>(() => {
    const saved = localStorage.getItem('mihiracle_stashes');
    return saved ? JSON.parse(saved) : INITIAL_STASHES;
  });

  const [stashItems, setStashItems] = useState<StashItem[]>(() => {
    const saved = localStorage.getItem('mihiracle_stash_items');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'si-1',
        stash_id: 'stash-1',
        idea_id: INITIAL_IDEAS[0].id,
        added_at: new Date().toISOString(),
        idea: INITIAL_IDEAS[0]
      },
      {
        id: 'si-2',
        stash_id: 'stash-2',
        idea_id: INITIAL_IDEAS[1].id,
        added_at: new Date().toISOString(),
        idea: INITIAL_IDEAS[1]
      }
    ];
  });

  const [recentActivity, setRecentActivity] = useState<UserActivity[]>(() => {
    const saved = localStorage.getItem('mihiracle_activity');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'act-1',
        user_id: GUEST_USER.id,
        activity_type: 'view_idea',
        idea_id: INITIAL_IDEAS[0].id,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        idea: INITIAL_IDEAS[0]
      },
      {
        id: 'act-2',
        user_id: GUEST_USER.id,
        activity_type: 'view_book',
        book_id: INITIAL_BOOKS[0].id,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        book: INITIAL_BOOKS[0]
      }
    ];
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('mihiracle_search_history');
    return saved ? JSON.parse(saved) : ['Mental models', 'Atomic habits', 'Transformers', 'Stoicism'];
  });

  const [dismissedDaily, setDismissedDaily] = useState<string[]>(() => {
    const saved = localStorage.getItem('mihiracle_dismissed_daily');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('mihiracle_theme') as any) || 'dark';
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [activeContextItem, setActiveContextItem] = useState<{ type: 'idea' | 'book' | 'stash'; title: string; content?: string } | null>(null);
  const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [isDiscoverModalOpen, setDiscoverModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('mihiracle_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mihiracle_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('mihiracle_saved_ideas', JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  useEffect(() => {
    localStorage.setItem('mihiracle_saved_books', JSON.stringify(savedBooks));
  }, [savedBooks]);

  useEffect(() => {
    localStorage.setItem('mihiracle_stashes', JSON.stringify(stashes));
  }, [stashes]);

  useEffect(() => {
    localStorage.setItem('mihiracle_stash_items', JSON.stringify(stashItems));
  }, [stashItems]);

  useEffect(() => {
    localStorage.setItem('mihiracle_activity', JSON.stringify(recentActivity));
  }, [recentActivity]);

  useEffect(() => {
    localStorage.setItem('mihiracle_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('mihiracle_dismissed_daily', JSON.stringify(dismissedDaily));
  }, [dismissedDaily]);

  useEffect(() => {
    localStorage.setItem('mihiracle_habit_streak', JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    const initialIds = new Set(INITIAL_IDEAS.map(i => i.id));
    const custom = allIdeas.filter(i => !initialIds.has(i.id));
    localStorage.setItem('mihiracle_custom_ideas', JSON.stringify(custom));
  }, [allIdeas]);

  // Handle dark mode class toggle on <html>
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mihiracle_theme', theme);
  }, [theme]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial health check
    fetchHealth().then(setHealth).catch(console.error);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Supabase Auth listener (if configured)
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        // Fetch Supabase profile
        client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data as Profile);
          });
      }
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      } else {
        setUser(GUEST_USER);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginAsGuest = () => {
    setUser(GUEST_USER);
    setProfile(DEFAULT_PROFILE);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const newProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(newProfile);

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  };

  const updateInterests = async (interests: Category[]) => {
    await updateProfile({ interests });
  };

  const updateDailyGoal = async (daily_goal_minutes: number) => {
    await updateProfile({ daily_goal_minutes });
  };

  const completeOnboarding = async (interests: Category[], dailyGoal: number) => {
    await updateProfile({
      interests,
      daily_goal_minutes: dailyGoal,
      onboarding_completed: true,
    });
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const deleteAccount = async () => {
    localStorage.clear();
    setSavedIdeas([]);
    setSavedBooks([]);
    setStashes([]);
    setStashItems([]);
    setRecentActivity([]);
    setSearchHistory([]);
    setUser(null);
    setProfile(DEFAULT_PROFILE);
    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('profiles').delete().eq('id', user.id);
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    updateProfile({ preferred_theme: newTheme });
  };

  // --- Ideas Saving ---
  const saveIdea = async (idea: Idea, notes = '') => {
    if (isIdeaSaved(idea.id)) return;

    // Ensure it exists in allIdeas
    if (!allIdeas.some(i => i.id === idea.id)) {
      setAllIdeas(prev => [idea, ...prev]);
    }

    const newSaved: SavedIdea = {
      id: `saved-${Date.now()}`,
      user_id: user?.id || GUEST_USER.id,
      idea_id: idea.id,
      personal_notes: notes,
      created_at: new Date().toISOString(),
      idea
    };

    setSavedIdeas(prev => [newSaved, ...prev]);

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('user_saved_ideas').insert({
        user_id: user.id,
        idea_id: idea.id,
        personal_notes: notes
      });
    }
  };

  const removeSavedIdea = async (ideaId: string) => {
    setSavedIdeas(prev => prev.filter(si => si.idea_id !== ideaId));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('user_saved_ideas').delete().match({ user_id: user.id, idea_id: ideaId });
    }
  };

  const updateIdeaNotes = async (ideaId: string, notes: string) => {
    setSavedIdeas(prev => prev.map(si => si.idea_id === ideaId ? { ...si, personal_notes: notes } : si));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('user_saved_ideas').update({ personal_notes: notes }).match({ user_id: user.id, idea_id: ideaId });
    }
  };

  const isIdeaSaved = (ideaId: string) => {
    return savedIdeas.some(si => si.idea_id === ideaId);
  };

  const addCustomIdea = (ideaData: Partial<Idea> & { title: string; summary: string }): Idea => {
    const newIdea: Idea = {
      id: ideaData.id || `custom-idea-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: ideaData.title,
      category: (ideaData.category as Category) || 'General Knowledge',
      summary: ideaData.summary,
      key_takeaway: ideaData.key_takeaway || ideaData.summary.slice(0, 120),
      why_it_matters: ideaData.why_it_matters || 'A core mental model or atomic insight worth remembering.',
      source_title: ideaData.source_title || 'Mihiracle Curated',
      source_publisher: ideaData.source_publisher || 'Mihiracle',
      source_url: ideaData.source_url || window.location.href,
      source_published_at: ideaData.source_published_at || new Date().toISOString().slice(0, 10),
      discovered_at: new Date().toISOString(),
      reading_time_minutes: ideaData.reading_time_minutes || 2,
      supporting_excerpt: ideaData.supporting_excerpt,
      generation_model: ideaData.generation_model || 'atomic-restash-v1',
    };

    setAllIdeas(prev => [newIdea, ...prev.filter(i => i.id !== newIdea.id)]);
    return newIdea;
  };

  const markIdeaAsRead = (ideaId: string) => {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    setStreak(prev => {
      if (prev.today_completed_ids.includes(ideaId)) return prev;

      const newCompleted = [...prev.today_completed_ids, ideaId];
      const target = prev.daily_target || 2;
      let newStreakDays = prev.streak_days;

      if (newCompleted.length >= target && prev.today_completed_ids.length < target) {
        if (prev.last_active_date === yesterday || prev.streak_days === 0) {
          newStreakDays = Math.max(1, prev.streak_days + 1);
        } else if (prev.last_active_date !== today) {
          newStreakDays = 1;
        }
      } else if (prev.streak_days === 0) {
        newStreakDays = 1;
      }

      const newLongest = Math.max(prev.longest_streak || 1, newStreakDays);

      return {
        ...prev,
        streak_days: newStreakDays,
        longest_streak: newLongest,
        last_active_date: today,
        today_completed_ids: newCompleted,
      };
    });
  };

  const isIdeaReadToday = (ideaId: string): boolean => {
    return streak.today_completed_ids.includes(ideaId);
  };

  const updateDailyTarget = (target: number) => {
    setStreak(prev => ({
      ...prev,
      daily_target: Math.max(1, target),
    }));
  };

  // --- Books Saving ---
  const saveBook = async (book: Book, status: ReadingStatus = 'want_to_read', notes = '') => {
    if (isBookSaved(book.id)) return;

    const newSaved: SavedBook = {
      id: `saved-book-${Date.now()}`,
      user_id: user?.id || GUEST_USER.id,
      book_id: book.id,
      reading_status: status,
      personal_notes: notes,
      created_at: new Date().toISOString(),
      book
    };

    setSavedBooks(prev => [newSaved, ...prev]);

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('user_saved_books').insert({
        user_id: user.id,
        book_id: book.id,
        reading_status: status,
        personal_notes: notes
      });
    }
  };

  const removeSavedBook = async (bookId: string) => {
    setSavedBooks(prev => prev.filter(sb => sb.book_id !== bookId));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('user_saved_books').delete().match({ user_id: user.id, book_id: bookId });
    }
  };

  const updateBookStatus = async (bookId: string, status: ReadingStatus) => {
    setSavedBooks(prev => prev.map(sb => sb.book_id === bookId ? { ...sb, reading_status: status } : sb));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('user_saved_books').update({ reading_status: status }).match({ user_id: user.id, book_id: bookId });
    }
  };

  const updateBookNotes = async (bookId: string, notes: string) => {
    setSavedBooks(prev => prev.map(sb => sb.book_id === bookId ? { ...sb, personal_notes: notes } : sb));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('user_saved_books').update({ personal_notes: notes }).match({ user_id: user.id, book_id: bookId });
    }
  };

  const isBookSaved = (bookId: string) => {
    return savedBooks.some(sb => sb.book_id === bookId);
  };

  const getBookStatus = (bookId: string): ReadingStatus | null => {
    const item = savedBooks.find(sb => sb.book_id === bookId);
    return item ? item.reading_status : null;
  };

  // --- Stashes (Collections) ---
  const createStash = async (name: string, description = ''): Promise<Stash> => {
    const newStash: Stash = {
      id: `stash-${Date.now()}`,
      user_id: user?.id || GUEST_USER.id,
      name,
      description,
      created_at: new Date().toISOString(),
      item_count: 0
    };

    setStashes(prev => [newStash, ...prev]);

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      const { data } = await supabase.from('stashes').insert({
        user_id: user.id,
        name,
        description
      }).select().single();
      if (data) return data as Stash;
    }

    return newStash;
  };

  const updateStash = async (id: string, name: string, description?: string) => {
    setStashes(prev => prev.map(s => s.id === id ? { ...s, name, description, updated_at: new Date().toISOString() } : s));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('stashes').update({ name, description }).eq('id', id);
    }
  };

  const deleteStash = async (id: string) => {
    // Note: deleting a stash must NOT delete underlying saved ideas or books
    setStashes(prev => prev.filter(s => s.id !== id));
    setStashItems(prev => prev.filter(si => si.stash_id !== id));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('stashes').delete().eq('id', id);
    }
  };

  const addItemToStash = async (stashId: string, item: { ideaId?: string; bookId?: string }) => {
    if (isItemInStash(stashId, item)) return;

    const newItem: StashItem = {
      id: `si-${Date.now()}`,
      stash_id: stashId,
      idea_id: item.ideaId,
      book_id: item.bookId,
      added_at: new Date().toISOString(),
      idea: item.ideaId ? allIdeas.find(i => i.id === item.ideaId) || savedIdeas.find(si => si.idea_id === item.ideaId)?.idea : undefined,
      book: item.bookId ? INITIAL_BOOKS.find(b => b.id === item.bookId) || savedBooks.find(sb => sb.book_id === item.bookId)?.book : undefined,
    };

    setStashItems(prev => [...prev, newItem]);
    setStashes(prev => prev.map(s => s.id === stashId ? { ...s, item_count: (s.item_count || 0) + 1 } : s));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      await supabase.from('stash_items').insert({
        stash_id: stashId,
        idea_id: item.ideaId,
        book_id: item.bookId
      });
    }
  };

  const removeItemFromStash = async (stashId: string, item: { ideaId?: string; bookId?: string }) => {
    setStashItems(prev => prev.filter(si => {
      if (si.stash_id !== stashId) return true;
      if (item.ideaId && si.idea_id === item.ideaId) return false;
      if (item.bookId && si.book_id === item.bookId) return false;
      return true;
    }));

    setStashes(prev => prev.map(s => s.id === stashId ? { ...s, item_count: Math.max(0, (s.item_count || 1) - 1) } : s));

    if (isSupabaseConfigured && supabase && user && user.id !== GUEST_USER.id) {
      if (item.ideaId) {
        await supabase.from('stash_items').delete().match({ stash_id: stashId, idea_id: item.ideaId });
      } else if (item.bookId) {
        await supabase.from('stash_items').delete().match({ stash_id: stashId, book_id: item.bookId });
      }
    }
  };

  const isItemInStash = (stashId: string, item: { ideaId?: string; bookId?: string }) => {
    return stashItems.some(si => {
      if (si.stash_id !== stashId) return false;
      if (item.ideaId && si.idea_id === item.ideaId) return true;
      if (item.bookId && si.book_id === item.bookId) return true;
      return false;
    });
  };

  const getStashesForItem = (item: { ideaId?: string; bookId?: string }): Stash[] => {
    const matchedStashIds = stashItems
      .filter(si => (item.ideaId && si.idea_id === item.ideaId) || (item.bookId && si.book_id === item.bookId))
      .map(si => si.stash_id);
    return stashes.filter(s => matchedStashIds.includes(s.id));
  };

  // --- Reading Activity ---
  const recordActivity = (activity: 'view_idea' | 'view_book', item: { idea?: Idea; book?: Book }) => {
    const newAct: UserActivity = {
      id: `act-${Date.now()}`,
      user_id: user?.id || GUEST_USER.id,
      activity_type: activity,
      idea_id: item.idea?.id,
      book_id: item.book?.id,
      created_at: new Date().toISOString(),
      idea: item.idea,
      book: item.book
    };

    setRecentActivity(prev => {
      // Remove previous duplicate view for the same item to keep recents fresh
      const filtered = prev.filter(a => {
        if (item.idea && a.idea_id === item.idea.id) return false;
        if (item.book && a.book_id === item.book.id) return false;
        return true;
      });
      return [newAct, ...filtered].slice(0, 15);
    });
  };

  // --- Search History ---
  const addSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  };

  const clearSearchHistory = () => setSearchHistory([]);

  const removeSearchHistoryItem = (query: string) => {
    setSearchHistory(prev => prev.filter(q => q !== query));
  };

  // --- Daily Dismissals ---
  const dismissDailyIdea = (ideaId: string) => {
    setDismissedDaily(prev => [...prev, ideaId]);
  };

  const isDailyIdeaDismissed = (ideaId: string) => {
    return dismissedDaily.includes(ideaId);
  };

  return (
    <StoreContext.Provider value={{
      user,
      profile,
      isLoadingAuth,
      loginAsGuest,
      updateProfile,
      updateInterests,
      updateDailyGoal,
      completeOnboarding,
      signOut,
      deleteAccount,
      allIdeas,
      savedIdeas,
      saveIdea,
      removeSavedIdea,
      updateIdeaNotes,
      isIdeaSaved,
      addCustomIdea,
      streak,
      markIdeaAsRead,
      isIdeaReadToday,
      updateDailyTarget,
      savedBooks,
      saveBook,
      removeSavedBook,
      updateBookStatus,
      updateBookNotes,
      isBookSaved,
      getBookStatus,
      stashes,
      stashItems,
      createStash,
      updateStash,
      deleteStash,
      addItemToStash,
      removeItemFromStash,
      isItemInStash,
      getStashesForItem,
      recentActivity,
      recordActivity,
      searchHistory,
      addSearchHistory,
      clearSearchHistory,
      removeSearchHistoryItem,
      dismissDailyIdea,
      isDailyIdeaDismissed,
      theme,
      setTheme,
      isOnline,
      health,
      activeContextItem,
      setActiveContextItem,
      isAIAssistantOpen,
      setAIAssistantOpen,
      isSideMenuOpen,
      setSideMenuOpen,
      isDiscoverModalOpen,
      setDiscoverModalOpen,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
