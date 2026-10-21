import { AIProvider, GeneratedIdea, GeneratedBookSummary, AIContext } from './AIProvider.js';
import { SearchResult } from '../search/SearchProvider.js';

export class OpenAIService implements AIProvider {
  name = 'openai';
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini', baseUrl?: string) {
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = (baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  }

  async generateIdeaCards(sources: SearchResult[], query: string): Promise<GeneratedIdea[]> {
    if (!sources || sources.length === 0) {
      return [];
    }

    const promptSources = sources.map((s, idx) => `[Source ${idx + 1}]
Title: ${s.title}
URL: ${s.url}
Publisher/Domain: ${s.publisher || s.domain}
Published Date: ${s.publishedDate || 'Unknown'}
Snippet: ${s.snippet}`).join('\n\n');

    const systemPrompt = `You are Mihiracle's Senior Editorial Insight Generator.
Your task is to convert credible web sources into concise, high-impact microlearning idea cards.
Strict Guidelines:
1. Every claim MUST be grounded strictly in the provided sources. Do not fabricate facts, statistics, or claims.
2. The original source URLs and Titles must match EXACTLY what is provided in the source snippets. NEVER invent a URL.
3. Language: Clear, engaging, and elegant.
4. Summary length: 80 to 140 words.
5. Key Takeaway: Exactly one memorable, actionable sentence.
6. Why It Matters: 1-2 sentences on practical relevance.
7. Category must be chosen from: ["Business", "Psychology", "Productivity", "Leadership", "Finance", "Philosophy", "Science", "Technology & AI", "History", "Marketing", "Strategy", "Operations", "General Knowledge"].

Return a valid JSON object with the property "cards" containing an array of cards:
{
  "cards": [
    {
      "title": "Concise engaging headline",
      "category": "One of the allowed categories",
      "summary": "80-140 words explanation grounded in source",
      "key_takeaway": "One practical actionable sentence",
      "why_it_matters": "Why this insight matters to the reader",
      "source_title": "Exact source title from provided sources",
      "source_publisher": "Exact domain or publisher",
      "source_url": "Exact source URL from provided sources",
      "source_published_at": "YYYY-MM-DD or null",
      "reading_time_minutes": 3,
      "supporting_excerpt": "Direct short quote or phrase from snippet"
    }
  ]
}`;

    const userPrompt = `Query/Topic: "${query}"\n\nSources:\n${promptSources}\n\nGenerate up to 3 idea cards based strictly on the above sources.`;

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const cards: GeneratedIdea[] = (parsed.cards || []).map((card: any) => ({
      title: card.title,
      category: card.category || 'General Knowledge',
      summary: card.summary,
      key_takeaway: card.key_takeaway,
      why_it_matters: card.why_it_matters,
      source_title: card.source_title,
      source_publisher: card.source_publisher,
      source_url: card.source_url,
      source_published_at: card.source_published_at || undefined,
      reading_time_minutes: card.reading_time_minutes || 3,
      generation_model: this.model,
      supporting_excerpt: card.supporting_excerpt,
    }));

    return cards;
  }

  async generateBookSummary(book: { title: string; authors: string[]; description?: string }): Promise<GeneratedBookSummary> {
    const systemPrompt = `You are a scholarly literary analyst creating a transformative, concise executive summary of a book for Mihiracle.
Strict Guidelines:
1. Do not reproduce copyrighted text verbatim or reconstruct the entire book.
2. Focus on transformative explanation, high-level analysis, key themes, and practical applications.
3. Be candid about limitations and counterarguments.
4. Return a valid JSON object matching the required structure.`;

    const userPrompt = `Book: "${book.title}" by ${book.authors.join(', ')}
Description: ${book.description || 'N/A'}

Provide:
1. Overview: What the book is about, target audience, core thesis (100-150 words).
2. Core Themes: 5 to 7 key ideas with title, clear explanation, and practical example.
3. Practical Takeaways: 4 to 6 actionable lessons.
4. Limitations: 2-3 sentences on where the advice falls short or has been critiqued.
5. Source Basis: Clear note on the synthesis basis (metadata & literary commentary).
6. Sections: 4 to 6 thematic breakdown sections with titles and summaries.

Output format (JSON object):
{
  "overview": "...",
  "core_themes": [{"title": "...", "description": "...", "practical_example": "..."}],
  "practical_takeaways": ["..."],
  "limitations": "...",
  "source_basis": "...",
  "sections": [{"section_title": "...", "section_order": 1, "section_summary": "...", "key_concepts": ["..."]}]
}`;

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return {
      overview: parsed.overview,
      core_themes: parsed.core_themes || [],
      practical_takeaways: parsed.practical_takeaways || [],
      limitations: parsed.limitations || '',
      source_basis: parsed.source_basis || 'Editorial synthesis from published metadata and secondary commentary.',
      generation_model: this.model,
      sections: parsed.sections || [],
    };
  }

  async answerQuestion(question: string, context?: AIContext): Promise<string> {
    let contextStr = '';
    if (context) {
      contextStr = `Active Context:
Type: ${context.type || 'General'}
Title: ${context.itemTitle || 'N/A'}
Category: ${context.itemCategory || 'N/A'}
Content/Summary: ${context.itemContent || 'N/A'}
Source URL: ${context.sourceUrl || 'N/A'}
${context.additionalContext ? `Additional Context: ${context.additionalContext}` : ''}`;
    }

    const systemPrompt = `You are the Mihiracle Learning Companion, an intelligent, calm, and insightful personal tutor.
Your role is to help the user deeply understand concepts, apply ideas to their professional and personal life, test assumptions, and connect mental models.
Guidelines:
- Ground your answers in the active context when provided.
- If asked for simple language, use clear analogies and accessible prose without being condescending.
- If asked for practical examples, give concrete, actionable real-world scenarios.
- Keep responses readable, well-spaced, and concise.`;

    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    if (contextStr) {
      messages.push({ role: 'user', content: `[Context Information]\n${contextStr}` });
      messages.push({ role: 'assistant', content: 'Understood. I am aware of this context and will reference it directly.' });
    }

    messages.push({ role: 'user', content: question });

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }

  async generateIdeaCardsFromArticle(article: {
    title: string;
    text: string;
    url: string;
    domain: string;
    publisher: string;
    category?: string;
  }): Promise<GeneratedIdea[]> {
    const systemPrompt = `You are Mihiracle's Chief Content Distiller (inspired by Deepstash's microlearning philosophy).
Your mission is to convert the provided article or video transcript into 3 to 4 distinct, bite-sized, atomic idea cards.
Strict Rules:
1. Each card MUST represent ONE independent, high-value mental model or actionable insight.
2. Ground every claim strictly in the provided text. Do not hallucinate external facts.
3. Summary: 80 to 140 words. Lucid, elegant, and engaging.
4. Key Takeaway: Exactly one powerful, actionable sentence.
5. Why It Matters: 1-2 sentences on practical relevance.
6. Reading time: 2 to 3 minutes.
7. Category: Choose best fit from ["Business", "Psychology", "Productivity", "Leadership", "Finance", "Philosophy", "Science", "Technology & AI", "History", "Marketing", "Strategy", "Operations", "General Knowledge"].

Output MUST be a valid JSON object matching:
{
  "cards": [
    {
      "title": "Engaging Headline for this specific insight",
      "category": "Chosen Category",
      "summary": "80-140 words explaining the insight clearly",
      "key_takeaway": "One actionable sentence to remember",
      "why_it_matters": "Why this matters in practice",
      "reading_time_minutes": 2,
      "supporting_excerpt": "Direct short quote or phrase from the article"
    }
  ]
}`;

    const userPrompt = `Source Title: "${article.title}"
Publisher: ${article.publisher}
URL: ${article.url}
Preferred Category: ${article.category || 'Any'}

Article Content:
${article.text.slice(0, 6000)}

Distill 3 to 4 high-signal, atomic idea cards from this source.`;

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const cards: GeneratedIdea[] = (parsed.cards || []).map((card: any) => ({
      title: card.title,
      category: card.category || article.category || 'General Knowledge',
      summary: card.summary,
      key_takeaway: card.key_takeaway,
      why_it_matters: card.why_it_matters,
      source_title: article.title,
      source_publisher: article.publisher,
      source_url: article.url,
      source_published_at: new Date().toISOString().slice(0, 10),
      reading_time_minutes: card.reading_time_minutes || 2,
      generation_model: this.model,
      supporting_excerpt: card.supporting_excerpt,
    }));

    return cards;
  }
}
