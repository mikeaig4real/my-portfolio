export interface ScrapedMetadataResult {
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

// In-memory cache for fast UI re-renders without repeated API calls
const metadataCache = new Map<string, ScrapedMetadataResult>();

/**
 * Verifies if a URL is requestable and fetches its OpenGraph / HTML metadata.
 */
export async function scrapeUrlMetadata(url: string): Promise<ScrapedMetadataResult> {
  if (!url || typeof url !== 'string' || url.trim() === '' || url === 'https://') {
    return { url, isRequestable: false, error: 'No valid URL provided' };
  }

  const cleanUrl = url.trim();

  if (metadataCache.has(cleanUrl)) {
    return metadataCache.get(cleanUrl)!;
  }

  try {
    const res = await fetch('/api/scrape-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleanUrl }),
    });

    const json = await res.json();
    if (json.success && json.data) {
      metadataCache.set(cleanUrl, json.data);
      return json.data;
    }

    const fallbackResult: ScrapedMetadataResult = {
      url: cleanUrl,
      isRequestable: false,
      error: json.error || 'Failed to verify URL',
    };
    metadataCache.set(cleanUrl, fallbackResult);
    return fallbackResult;
  } catch (err: unknown) {
    const error = err as Error;
    const errorResult: ScrapedMetadataResult = {
      url: cleanUrl,
      isRequestable: false,
      error: error.message || 'Network error verifying URL',
    };
    metadataCache.set(cleanUrl, errorResult);
    return errorResult;
  }
}
