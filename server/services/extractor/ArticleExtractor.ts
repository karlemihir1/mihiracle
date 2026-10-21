export interface ExtractedArticle {
  title: string;
  url: string;
  domain: string;
  publisher: string;
  author?: string;
  excerpt: string;
  fullText: string;
  isYouTube: boolean;
}

export class ArticleExtractor {
  static isYouTubeUrl(url: string): boolean {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url);
  }

  static getDomain(urlString: string): string {
    try {
      const u = new URL(urlString);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return 'web';
    }
  }

  static async extract(urlString: string): Promise<ExtractedArticle> {
    const trimmed = urlString.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      throw new Error('Please provide a valid URL starting with http:// or https://');
    }

    const domain = this.getDomain(trimmed);
    const isYouTube = this.isYouTubeUrl(trimmed);

    if (isYouTube) {
      return this.extractYouTube(trimmed, domain);
    }

    return this.extractWebArticle(trimmed, domain);
  }

  private static async extractYouTube(url: string, domain: string): Promise<ExtractedArticle> {
    let title = 'YouTube Video';
    let author = 'Creator';
    let description = '';

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        title = data.title || title;
        author = data.author_name || author;
      }
    } catch {
      // Fallback
    }

    // Try fetching page meta description
    try {
      const pageRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html',
        },
        signal: AbortSignal.timeout(6000)
      });
      if (pageRes.ok) {
        const html = await pageRes.text();
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                          html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
        if (descMatch && descMatch[1]) {
          description = this.cleanHtmlEntities(descMatch[1]);
        }
      }
    } catch {
      // Ignore
    }

    const excerpt = description ? description.slice(0, 300) : `A high-signal educational video by ${author} exploring key concepts and practical ideas.`;
    const fullText = `Title: ${title}\nAuthor/Speaker: ${author}\nPlatform: YouTube\nURL: ${url}\nSummary & Key Points: ${description || excerpt}`;

    return {
      title,
      url,
      domain: 'youtube.com',
      publisher: `YouTube (${author})`,
      author,
      excerpt,
      fullText,
      isYouTube: true,
    };
  }

  private static async extractWebArticle(url: string, domain: string): Promise<ExtractedArticle> {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(7000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch article (HTTP ${res.status}). The website may be protected or unreachable.`);
    }

    const html = await res.text();

    // 1. Extract Title
    let title = '';
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
                         html.match(/<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      title = this.cleanHtmlEntities(ogTitleMatch[1]);
    } else {
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = this.cleanHtmlEntities(titleMatch[1]);
      }
    }
    if (!title) {
      title = `Article from ${domain}`;
    }

    // 2. Extract Publisher / Site Name
    let publisher = domain;
    const siteNameMatch = html.match(/<meta\s+property=["']og:site_name["']\s+content=["'](.*?)["']/i);
    if (siteNameMatch && siteNameMatch[1]) {
      publisher = this.cleanHtmlEntities(siteNameMatch[1]);
    }

    // 3. Extract Description
    let description = '';
    const descMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) ||
                      html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    if (descMatch && descMatch[1]) {
      description = this.cleanHtmlEntities(descMatch[1]);
    }

    // 4. Extract Main Paragraphs
    // Clean out noisy tags
    const cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '');

    const paragraphMatches = cleaned.match(/<p\b[^>]*>(.*?)<\/p>/gi) || [];
    const paragraphs: string[] = [];

    for (const p of paragraphMatches) {
      const text = this.cleanHtml(p).trim();
      // Filter out cookie notices, tiny snippets, copyright notices
      if (text.length > 50 && !/cookie|privacy policy|rights reserved|subscribe/i.test(text)) {
        paragraphs.push(text);
      }
    }

    const fullContent = paragraphs.slice(0, 15).join('\n\n');
    const excerpt = description || (paragraphs[0] ? paragraphs[0].slice(0, 280) + '...' : `Insightful article from ${publisher}.`);

    return {
      title,
      url,
      domain,
      publisher,
      excerpt,
      fullText: fullContent.length > 100 ? fullContent : (description || title),
      isYouTube: false,
    };
  }

  private static cleanHtml(html: string): string {
    return this.cleanHtmlEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
  }

  private static cleanHtmlEntities(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
  }
}
