/**
 * SEO Utilities
 * Tools for better SEO and search engine optimization
 */

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(data: SEOData): string {
  const tags: string[] = [];

  // Title
  tags.push(`<title>${escapeHtml(data.title)}</title>`);
  tags.push(`<meta name="title" content="${escapeHtml(data.title)}" />`);

  // Description
  tags.push(`<meta name="description" content="${escapeHtml(data.description)}" />`);

  // Keywords
  if (data.keywords && data.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${data.keywords.join(', ')}" />`);
  }

  // Open Graph
  tags.push(`<meta property="og:title" content="${escapeHtml(data.title)}" />`);
  tags.push(`<meta property="og:description" content="${escapeHtml(data.description)}" />`);
  if (data.ogImage) {
    tags.push(`<meta property="og:image" content="${data.ogImage}" />`);
  }

  // Canonical URL
  if (data.canonicalUrl) {
    tags.push(`<link rel="canonical" href="${data.canonicalUrl}" />`);
  }

  // Structured Data
  if (data.structuredData) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(data.structuredData)}</script>`
    );
  }

  return tags.join('\n');
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(
  url: string,
  lastmod?: string,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly',
  priority: number = 0.5
): string {
  return `
    <url>
      <loc>${escapeXml(url)}</loc>
      ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>
  `.trim();
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(
  allowPaths: string[] = ['/'],
  disallowPaths: string[] = ['/api/', '/admin/'],
  sitemapUrl?: string
): string {
  const lines: string[] = [];

  allowPaths.forEach((path) => {
    lines.push(`Allow: ${path}`);
  });

  disallowPaths.forEach((path) => {
    lines.push(`Disallow: ${path}`);
  });

  if (sitemapUrl) {
    lines.push(`Sitemap: ${sitemapUrl}`);
  }

  return lines.join('\n');
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function escapeXml(text: string): string {
  return escapeHtml(text);
}
