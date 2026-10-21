# Mihiracle 🧠✨

> **"Discover an idea in minutes. Understand it clearly. Save it forever."**
> A production-ready, mobile-first personal knowledge and microlearning Progressive Web App (PWA).

Inspired by the microlearning experience of Deepstash and modern editorial digital libraries, Mihiracle empowers lifelong learners to discover grounded insights from the live web, explore book summaries, organize personal collections called **Stashes**, take notes, and converse with a context-aware AI learning companion.

---

## 🌟 Key Features

### 1. Daily Discovery & Personalized Home Dashboard
- **Personalized Greeting & Global Search**: Dynamic greeting based on time of day with instant access to ideas, books, and AI companion.
- **Daily Insight Card**: Featured daily discovery with category badge, reading time estimate, key takeaway highlight, verified source citations, save, share, and dismiss actions.
- **Continue Exploring**: Personalized recommendation feed based on the user's selected interests.
- **Pick Up Where You Left Off**: Resumes recently viewed ideas and books.
- **13 Core Learning Categories**: Business, Psychology, Productivity, Leadership, Finance, Philosophy, Science, Technology & AI, History, Marketing, Strategy, Operations, and General Knowledge.
- **Book of the Day**: Featured literary work with direct access to structured executive insights.

### 2. Live Internet Discovery & Source Grounding
- **Provider Abstraction Architecture**: Clean interface decoupling the search engine (`Tavily`, `Exa`, `DuckDuckGo`, or `Curated Grounded Fallback`) from the application logic.
- **Zero Hallucinated Citations**: Every generated idea card links directly to the verified original source URL and publisher with publication dates.
- **Structured Idea Cards**: Contains Headline, Category, 80-150 word editorial summary, Key Takeaway, and "Why It Matters" context.
- **Transparent Demo Mode**: When API keys are not supplied, Mihiracle runs seamlessly with a verified academic corpus—clearly labelled with zero false claims of live search.

### 3. Book Library & Transformative Summaries
- **Book Catalog**: Search across millions of titles via Google Books API and curated literary masterpieces.
- **Editorial Executive Summaries**:
  - Book Overview & Central Argument.
  - Core Themes (5-10 key ideas with clear explanations and real-world examples).
  - Practical Takeaways for everyday execution.
  - Critical Limitations & Counterarguments.
  - Thematic & Chapter Breakdown sections.
  - Copyright Safeguard disclosure: strictly transformative and concise commentary without reproducing copyrighted long-form text verbatim.
- **Reading Status Tracking**: Mark books as `Want to Read`, `Currently Reading`, or `Completed`.

### 4. My Stash — Personal Knowledge Library
- **Custom Collections ("Stashes")**: Create, rename, edit descriptions, and organize ideas and books (e.g., "MBA Strategy", "Mental Models").
- **Multi-Stash Membership**: An idea or book can belong to multiple Stashes without duplicating records.
- **Non-Destructive Deletion**: Deleting a Stash never deletes the underlying saved ideas or books from your library.
- **Personal Reading Notes**: Record private reflections on any saved idea or book.
- **In-Library Search & Sorting**: Search within your library and sort by newest, oldest, or title.

### 5. Context-Aware AI Learning Companion
- Accessible from any screen via the top header or floating companion drawer.
- **Context Inheritance**: Automatically adopts the active Idea, Book, or Stash as conversational context.
- **Quick Prompt Chips**:
  - *"Explain this idea in simple language"*
  - *"Give me a practical real-world example"*
  - *"How can I apply this concept tomorrow?"*
  - *"What are the main counterarguments?"*
  - *"Summarize the key takeaway in 10 words"*

### 6. PWA & Mobile-First Experience
- **Progressive Web App**: Complete with Web App Manifest, Service Worker caching, and original 192x192 & 512x512 icons.
- **Mobile Navigation**: Bottom bar with min 44px touch targets, safe-area inset support for iPhone notches and home indicators (`env(safe-area-inset-bottom)`).
- **Desktop Layout**: Collapsible left sidebar, centralized content layout, and keyboard shortcuts.
- **Native Install Prompts**: Android install banner and iOS Safari "Add to Home Screen" visual guide.
- **Dark / Light Mode**: Beautiful custom palette:
  - Primary Navy: `#192D3A`
  - Accent Mint: `#B8E7BF`
  - Light Background: `#F7F8F5`
  - Dark Slate: `#0D151C`

### 7. Supabase Database & Security
- **13 Normalized Tables**: `profiles`, `ideas`, `idea_sources`, `books`, `book_summaries`, `book_sections`, `user_saved_ideas`, `user_saved_books`, `stashes`, `stash_items`, `user_activity`, `search_history`, `user_daily_content`.
- **Row Level Security (RLS)**: Enforced across all user data tables to ensure absolute tenant isolation.
- **Zero Client Secret Exposure**: All AI and search API keys reside securely on the backend server (`/api/*`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS, Lucide Icons, React Router 6 |
| **State Management** | TanStack Query v5, Custom Store Context with LocalStorage sync |
| **PWA & Offline** | Vite Plugin PWA, Workbox Service Worker, Canvas Confetti |
| **Backend API** | Node.js, Express.js, TypeScript (`tsx`), CORS, Dotenv |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS) |
| **AI Integration** | OpenAI API (`gpt-4o-mini` / configurable via `.env`), Curated Grounded Engine |
| **Search Engine** | Tavily Search API, Google Books API, Curated Corpus |
| **Testing** | Vitest (Unit & Integration tests) |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies

```bash
cd mihiracle
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default configuration runs in **Demo Mode** out of the box with zero external setup:
```env
PORT=3001
AI_MODEL=gpt-4o-mini
SEARCH_PROVIDER=demo
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

To enable live web search and OpenAI generation, add:
```env
OPENAI_API_KEY=sk-...
SEARCH_API_KEY=tvly-...
SEARCH_PROVIDER=tavily
```

### 3. Run the Development Server

A single command launches both the Express backend API (`http://localhost:3001`) and the Vite client (`http://localhost:5173`):

```bash
npm run dev
```

Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 💾 Setting Up Supabase Database & Auth

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the Supabase Dashboard, open the **SQL Editor**.
3. Open the file `supabase/migrations/20260927000000_mihiracle_init.sql` from this repository.
4. Copy and paste the entire script into the SQL Editor and click **Run**.
   - This creates all 13 tables, performance indexes, RLS policies, and the user signup profile trigger.
5. In Project Settings > API, copy:
   - `Project URL`
   - `anon public key`
   - `service_role secret key`
6. Add them to your `.env` file:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
7. Restart the development server (`npm run dev`). Your app is now connected to live PostgreSQL with complete authentication and Row Level Security!

---

## 📱 Mobile Installation (PWA)

### Android (Chrome / Brave / Edge)
1. Navigate to the deployed HTTPS website on your mobile device.
2. An unobtrusive banner will appear: **"Install Mihiracle"**.
3. Tap **Install** to add the native PWA to your home screen and app launcher.

### iPhone (iOS Safari)
1. Open the deployed website in **Safari**.
2. Tap the **Share** button in Safari's bottom toolbar.
3. Scroll down and tap **Add to Home Screen**.
4. Confirm by tapping **Add** in the top right.
5. Mihiracle will launch in standalone mode with its custom icon, without browser chrome.

---

## ☁️ Deployment Guide (Public HTTPS URL)

To enable PWA installation and mobile use, deploy to a public HTTPS provider:

### Option A: Vercel (Recommended)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. Configure Environment Variables in the Vercel dashboard:
   - `OPENAI_API_KEY`
   - `SEARCH_API_KEY`
   - `SEARCH_PROVIDER`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will build the frontend and serve it over HTTPS with global CDN edge caching!

### Option B: Render / Railway (Fullstack with Node Server)
1. Set the build command to `npm install && npm run build`.
2. Set the start command to `npm run server:start`.
3. Provide the environment variables in the settings panel.

---

## 🧪 Running Automated Tests

Run the Vitest test suite covering idea card generation, book summarization, and stash collection integrity:

```bash
npm run test
```

To run a production TypeScript and Vite build check:

```bash
npm run build
```

---

## 📄 License & Attribution

Mihiracle is crafted with original branding and illustrations for the Mihiracle project.
All book summaries and microlearning cards are transformative educational syntheses based on verified public research citations.
