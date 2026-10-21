import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { getSearchProvider } from './services/search/index.js';
import { getAIProvider } from './services/ai/index.js';
import { getBookProvider } from './services/books/index.js';
import { ArticleExtractor } from './services/extractor/ArticleExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// 1. Health check & configuration status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    isDemoMode: config.isDemoMode,
    openAiConfigured: Boolean(config.openAiApiKey),
    searchConfigured: Boolean(config.searchApiKey),
    searchProvider: config.searchProvider,
    aiModel: config.aiModel,
    timestamp: new Date().toISOString()
  });
});

// 2. Internet / Curated Search endpoint
app.post('/api/search', async (req: Request, res: Response) => {
  try {
    const { query, category, limit } = req.body;
    if (!query && !category) {
      return res.status(400).json({ error: 'Query or category is required' });
    }

    const provider = getSearchProvider();
    const results = await provider.search(query || '', {
      category,
      limit: typeof limit === 'number' ? limit : 6,
    });

    res.json({
      query,
      category,
      count: results.length,
      provider: provider.name,
      isDemo: config.isDemoMode,
      results,
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    res.status(500).json({
      error: 'Failed to execute search',
      details: error.message,
    });
  }
});

// 3. Structured Idea Generation
app.post('/api/generate-idea', async (req: Request, res: Response) => {
  try {
    const { query, sources, category } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    let searchSources = sources;
    const searchProvider = getSearchProvider();

    // If caller didn't provide sources, fetch them from search provider first
    if (!searchSources || searchSources.length === 0) {
      searchSources = await searchProvider.search(query, { category, limit: 4 });
    }

    if (!searchSources || searchSources.length === 0) {
      return res.status(404).json({
        error: 'No verified sources could be found for this topic. Try another query.',
        cards: [],
      });
    }

    const aiProvider = getAIProvider();
    const cards = await aiProvider.generateIdeaCards(searchSources, query);

    res.json({
      cards,
      sourcesUsed: searchSources,
      isDemo: config.isDemoMode,
      generationModel: aiProvider.name === 'openai' ? config.aiModel : 'editorial-live-v1',
    });
  } catch (error: any) {
    console.error('Generate Idea error:', error);
    res.status(500).json({
      error: 'Failed to generate idea cards',
      details: error.message,
    });
  }
});

// 3b. Import Web Article or Video URL and Distill to Idea Cards
app.post('/api/import-url', async (req: Request, res: Response) => {
  try {
    const { url, category } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'A valid URL is required' });
    }

    // 1. Extract content from webpage or YouTube
    const extracted = await ArticleExtractor.extract(url.trim());

    // 2. Distill into 3-4 bite-sized idea cards
    const aiProvider = getAIProvider();
    const cards = await aiProvider.generateIdeaCardsFromArticle({
      title: extracted.title,
      text: extracted.fullText,
      url: extracted.url,
      domain: extracted.domain,
      publisher: extracted.publisher,
      category,
    });

    res.json({
      cards,
      source: {
        title: extracted.title,
        url: extracted.url,
        domain: extracted.domain,
        publisher: extracted.publisher,
        author: extracted.author,
        excerpt: extracted.excerpt,
        isYouTube: extracted.isYouTube,
      },
      isDemo: config.isDemoMode,
      generationModel: aiProvider.name === 'openai' ? config.aiModel : 'editorial-live-v1',
    });
  } catch (error: any) {
    console.error('Import URL error:', error);
    res.status(500).json({
      error: error.message || 'Failed to import and distill article',
      details: error.message,
    });
  }
});

// 4. Books Search
app.get('/api/books/search', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const category = (req.query.category as string) || 'all';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const bookProvider = getBookProvider();
    const books = await bookProvider.searchBooks(q, { category, limit });

    res.json({
      query: q,
      category,
      count: books.length,
      books,
    });
  } catch (error: any) {
    console.error('Books search error:', error);
    res.status(500).json({ error: 'Failed to search books', details: error.message });
  }
});

// 5. Book Details
app.get('/api/books/:id', async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
    const bookProvider = getBookProvider();
    const book = await bookProvider.getBookDetails(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ book });
  } catch (error: any) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Failed to retrieve book', details: error.message });
  }
});

// 6. Generate Book Summary
app.post('/api/books/summary', async (req: Request, res: Response) => {
  try {
    const { book } = req.body;
    if (!book || !book.title) {
      return res.status(400).json({ error: 'Book metadata with title is required' });
    }

    const aiProvider = getAIProvider();
    const summary = await aiProvider.generateBookSummary(book);

    res.json({
      summary,
      isDemo: config.isDemoMode,
      generationModel: aiProvider.name === 'openai' ? config.aiModel : 'editorial-live-v1',
    });
  } catch (error: any) {
    console.error('Generate summary error:', error);
    res.status(500).json({ error: 'Failed to generate book summary', details: error.message });
  }
});

// 7. Contextual AI Learning Companion
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const aiProvider = getAIProvider();
    const answer = await aiProvider.answerQuestion(question, context);

    res.json({
      answer,
      isDemo: config.isDemoMode,
    });
  } catch (error: any) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'Failed to process AI chat query', details: error.message });
  }
});

// 8. Serve built frontend assets
app.use(express.static(distPath));

// 9. SPA catch-all fallback for client-side routing
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start listening
const PORT = config.port;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Mihiracle Server] Running on http://localhost:${PORT}`);
    console.log(`[Mihiracle Server] Mode: ${config.isDemoMode ? 'DEMO MODE' : 'LIVE PRODUCTION MODE'}`);
    console.log(`[Mihiracle Server] Engine: AI (${config.openAiApiKey ? 'OpenAI ' + config.aiModel : 'Editorial Live Engine'}), Search (${config.searchProvider})`);
  });
}

export default app;
export { app };
