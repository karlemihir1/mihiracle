-- ==============================================================================
-- Mihiracle PostgreSQL Schema & Row Level Security (RLS) Migrations
-- Compatible with Supabase Postgres
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    interests TEXT[] DEFAULT '{}',
    daily_goal_minutes INTEGER DEFAULT 10,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferred_theme TEXT DEFAULT 'light',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. PUBLIC IDEAS (Reusable knowledge cards)
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    key_takeaway TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    source_title TEXT NOT NULL,
    source_publisher TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_published_at TIMESTAMPTZ,
    discovered_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    content_hash TEXT,
    generation_model TEXT,
    content_type TEXT DEFAULT 'article',
    reading_time_minutes INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. IDEA SOURCES (Multi-source verification & citations)
CREATE TABLE IF NOT EXISTS public.idea_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    source_title TEXT NOT NULL,
    source_url TEXT NOT NULL,
    publisher TEXT NOT NULL,
    publication_date TIMESTAMPTZ,
    source_type TEXT DEFAULT 'web',
    supporting_excerpt TEXT,
    verification_status TEXT DEFAULT 'verified',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. BOOKS (Book metadata catalog)
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    authors TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    cover_url TEXT,
    publisher TEXT,
    publication_year INTEGER,
    isbn TEXT,
    categories TEXT[] DEFAULT '{}',
    external_provider TEXT DEFAULT 'google_books',
    external_provider_id TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_book_provider UNIQUE (external_provider, external_provider_id)
);

-- 5. BOOK SUMMARIES (Transformative, concise editorial insights)
CREATE TABLE IF NOT EXISTS public.book_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    summary_type TEXT DEFAULT 'editorial_insight',
    overview TEXT NOT NULL,
    core_themes JSONB NOT NULL DEFAULT '[]'::jsonb,
    practical_takeaways JSONB NOT NULL DEFAULT '[]'::jsonb,
    limitations TEXT,
    source_basis TEXT,
    generation_model TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. BOOK SECTIONS (Chapter-wise or key thematic breakdown)
CREATE TABLE IF NOT EXISTS public.book_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID NOT NULL REFERENCES public.book_summaries(id) ON DELETE CASCADE,
    section_title TEXT NOT NULL,
    section_order INTEGER NOT NULL DEFAULT 0,
    section_summary TEXT NOT NULL,
    key_concepts TEXT[] DEFAULT '{}',
    source_basis TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. USER SAVED IDEAS (Personal saved library)
CREATE TABLE IF NOT EXISTS public.user_saved_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    personal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_user_saved_idea UNIQUE (user_id, idea_id)
);

-- 8. USER SAVED BOOKS (Personal saved books & reading state)
CREATE TABLE IF NOT EXISTS public.user_saved_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    reading_status TEXT NOT NULL DEFAULT 'want_to_read' CHECK (reading_status IN ('want_to_read', 'reading', 'completed')),
    personal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_user_saved_book UNIQUE (user_id, book_id)
);

-- 9. STASHES (User custom collections)
CREATE TABLE IF NOT EXISTS public.stashes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. STASH ITEMS (Junction table for Stashes)
CREATE TABLE IF NOT EXISTS public.stash_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stash_id UUID NOT NULL REFERENCES public.stashes(id) ON DELETE CASCADE,
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT chk_stash_item_type CHECK (
        (idea_id IS NOT NULL AND book_id IS NULL) OR
        (idea_id IS NULL AND book_id IS NOT NULL)
    )
);

-- Unique index to prevent duplicate ideas in the same stash
CREATE UNIQUE INDEX IF NOT EXISTS uq_stash_idea 
ON public.stash_items(stash_id, idea_id) 
WHERE idea_id IS NOT NULL;

-- Unique index to prevent duplicate books in the same stash
CREATE UNIQUE INDEX IF NOT EXISTS uq_stash_book 
ON public.stash_items(stash_id, book_id) 
WHERE book_id IS NOT NULL;

-- 11. USER ACTIVITY (Recent reading logs & recommendation signals)
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- e.g., 'view_idea', 'view_book', 'save_idea'
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. SEARCH HISTORY
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    search_type TEXT DEFAULT 'all',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. USER DAILY CONTENT (Featured daily recommendation delivery)
CREATE TABLE IF NOT EXISTS public.user_daily_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    content_date DATE NOT NULL DEFAULT CURRENT_DATE,
    dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_user_daily_content UNIQUE (user_id, content_date)
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_ideas_category ON public.ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_discovered_at ON public.ideas(discovered_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books(title);
CREATE INDEX IF NOT EXISTS idx_user_saved_ideas_user ON public.user_saved_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_books_user ON public.user_saved_books(user_id);
CREATE INDEX IF NOT EXISTS idx_stashes_user ON public.stashes(user_id);
CREATE INDEX IF NOT EXISTS idx_stash_items_stash ON public.stash_items(stash_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON public.user_activity(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON public.search_history(user_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stashes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stash_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_content ENABLE ROW LEVEL SECURITY;

-- 1. Public catalog tables: anyone can read
CREATE POLICY "Public ideas are viewable by all" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Public idea sources are viewable by all" ON public.idea_sources FOR SELECT USING (true);
CREATE POLICY "Public books are viewable by all" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public book summaries are viewable by all" ON public.book_summaries FOR SELECT USING (true);
CREATE POLICY "Public book sections are viewable by all" ON public.book_sections FOR SELECT USING (true);

-- Authenticated server role or users can insert generated public ideas/books
CREATE POLICY "Authenticated users can insert ideas" ON public.ideas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert book summaries" ON public.book_summaries FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 2. Profiles: Users can view and manage their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Saved Ideas: Strictly isolated per user
CREATE POLICY "Users can view own saved ideas" ON public.user_saved_ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved ideas" ON public.user_saved_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved ideas notes" ON public.user_saved_ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved ideas" ON public.user_saved_ideas FOR DELETE USING (auth.uid() = user_id);

-- 4. Saved Books: Strictly isolated per user
CREATE POLICY "Users can view own saved books" ON public.user_saved_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved books" ON public.user_saved_books FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved books" ON public.user_saved_books FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved books" ON public.user_saved_books FOR DELETE USING (auth.uid() = user_id);

-- 5. Stashes: Strictly isolated per user
CREATE POLICY "Users can view own stashes" ON public.stashes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stashes" ON public.stashes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stashes" ON public.stashes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stashes" ON public.stashes FOR DELETE USING (auth.uid() = user_id);

-- 6. Stash Items: Restricted to owner of the stash
CREATE POLICY "Users can view items in own stashes" ON public.stash_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.stashes s WHERE s.id = stash_id AND s.user_id = auth.uid())
);
CREATE POLICY "Users can insert items in own stashes" ON public.stash_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.stashes s WHERE s.id = stash_id AND s.user_id = auth.uid())
);
CREATE POLICY "Users can delete items in own stashes" ON public.stash_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.stashes s WHERE s.id = stash_id AND s.user_id = auth.uid())
);

-- 7. User Activity: Private to user
CREATE POLICY "Users can view own activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Search History: Private to user
CREATE POLICY "Users can view own search history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own search history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own search history" ON public.search_history FOR DELETE USING (auth.uid() = user_id);

-- 9. User Daily Content: Private to user
CREATE POLICY "Users can view own daily content" ON public.user_daily_content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update own daily content" ON public.user_daily_content FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, interests)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    '{}'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
