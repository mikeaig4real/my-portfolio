import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

export interface ScrapedMetadata {
  url: string;
  isRequestable: boolean;
  statusCode?: number;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  headings?: string[];
  error?: string;
}

/**
 * Extracts meta tags, titles, open-graph images, and headings from raw HTML string.
 */
function parseHtmlMetadata(html: string, baseUrl: string): Partial<ScrapedMetadata> {
  const getMetaContent = (attr: string, value: string): string | undefined => {
    const regex = new RegExp(
      `<meta\\s+[^>]*${attr}=["']${value}["']\\s+content=["']([^"']+)["']|<meta\\s+[^>]*content=["']([^"']+)["']\\s+${attr}=["']${value}["']`,
      'i'
    );
    const match = html.match(regex);
    return match ? (match[1] || match[2])?.trim() : undefined;
  };

  // Title: og:title -> twitter:title -> <title>
  let title =
    getMetaContent('property', 'og:title') ||
    getMetaContent('name', 'twitter:title');

  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) title = titleMatch[1].trim();
  }

  // Description: og:description -> twitter:description -> description
  const description =
    getMetaContent('property', 'og:description') ||
    getMetaContent('name', 'twitter:description') ||
    getMetaContent('name', 'description');

  // Image: og:image -> twitter:image -> rel="image_src"
  let image =
    getMetaContent('property', 'og:image') ||
    getMetaContent('name', 'twitter:image');

  if (!image) {
    const relImageMatch = html.match(/<link\s+[^>]*rel=["']image_src["']\s+href=["']([^"']+)["']/i);
    if (relImageMatch) image = relImageMatch[1].trim();
  }

  // Fallback to first large <img> tag if no og:image found
  if (!image) {
    const imgMatches = [...html.matchAll(/<img\s+[^>]*src=["']([^"']+)["']/gi)];
    for (const match of imgMatches) {
      const src = match[1];
      if (src && !src.includes('avatar') && !src.includes('icon') && !src.endsWith('.svg')) {
        image = src;
        break;
      }
    }
  }

  // Resolve relative image URLs to absolute URLs
  if (image) {
    try {
      image = new URL(image, baseUrl).href;
    } catch {
      // leave as is if parsing fails
    }
  }

  // Site name: og:site_name -> domain hostname
  let siteName = getMetaContent('property', 'og:site_name');
  if (!siteName) {
    try {
      siteName = new URL(baseUrl).hostname.replace(/^www\./, '');
    } catch {
      siteName = undefined;
    }
  }

  // Headings: extract h1 and h2 tags
  const headings: string[] = [];
  const headingMatches = [...html.matchAll(/<h[12][^>]*>([^<]+)<\/h[12]>/gi)];
  for (const match of headingMatches) {
    const text = match[1]?.trim();
    if (text && text.length > 2 && !headings.includes(text) && headings.length < 5) {
      headings.push(text);
    }
  }

  const parsed = {
    title,
    description,
    image,
    siteName,
    headings,
  };

  logger.info(`Scraped metadata for URL: ${baseUrl} - ${JSON.stringify(parsed, null, 2)}`);
  return parsed;
}

/**
 * Special handler for GitHub repository URLs via public REST API.
 */
async function fetchGitHubRepoMetadata(url: string): Promise<Partial<ScrapedMetadata> | null> {
  const match = url.match(/^https?:\/\/(www\.)?github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!match) return null;

  const owner = match[2];
  const repo = match[3];
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 PortfolioScraper/1.0',
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      title: `${data.name || repo}`,
      description: data.description || `GitHub repository by ${owner}`,
      siteName: 'GitHub',
      image: data.owner?.avatar_url || `https://opengraph.githubassets.com/1/${owner}/${repo}`,
      headings: [data.language, `Stars: ${data.stargazers_count || 0}`].filter(Boolean) as string[],
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetUrlRaw = body.url || body.targetUrl;

    if (!targetUrlRaw || typeof targetUrlRaw !== 'string') {
      return ApiResponse.error('Target URL is required', 400);
    }

    let targetUrl = targetUrlRaw.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return ApiResponse.error('Invalid URL format', 400);
    }

    logger.info(`Scraping metadata for URL: ${targetUrl}`);

    // Fast-path 1: Direct image asset URLs
    const isDirectImage = /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(parsedUrl.pathname);
    if (isDirectImage) {
      return ApiResponse.success<ScrapedMetadata>({
        url: targetUrl,
        isRequestable: true,
        statusCode: 200,
        title: parsedUrl.pathname.split('/').pop() || 'Image Asset',
        image: targetUrl,
        siteName: parsedUrl.hostname.replace(/^www\./, ''),
      });
    }

    // Fast-path 2: GitHub repository URL special API handler
    if (parsedUrl.hostname.includes('github.com')) {
      const ghMeta = await fetchGitHubRepoMetadata(targetUrl);
      if (ghMeta) {
        return ApiResponse.success<ScrapedMetadata>({
          url: targetUrl,
          isRequestable: true,
          statusCode: 200,
          ...ghMeta,
        });
      }
    }

    // General HTML scraping with 12-second timeout and redirect following
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const isRequestable = response.ok;
      const statusCode = response.status;

      if (!isRequestable) {
        return ApiResponse.success<ScrapedMetadata>({
          url: targetUrl,
          isRequestable: false,
          statusCode,
          error: `Server returned status code ${statusCode}`,
        });
      }

      const html = await response.text();
      const parsedMetadata = parseHtmlMetadata(html, targetUrl);

      return ApiResponse.success<ScrapedMetadata>({
        url: targetUrl,
        isRequestable: true,
        statusCode,
        ...parsedMetadata,
      });
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      const error = fetchErr as Error;
      logger.warn(`Failed to fetch metadata for ${targetUrl}:`, error.message);

      return ApiResponse.success<ScrapedMetadata>({
        url: targetUrl,
        isRequestable: false,
        error: error.name === 'AbortError' ? 'Request timed out (12s limit)' : error.message,
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Error in scrape-metadata route:', error);
    return ApiResponse.serverError(error.message);
  }
}
