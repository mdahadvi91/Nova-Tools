import { TOOLS, CATEGORIES } from '../data/tools';

const LEGAL_PAGES = ['privacy', 'terms', 'disclaimer', 'about', 'contact'];

export function generateSitemapXml(baseUrl: string): string {
  // Normalize base URL (strip trailing slash)
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

  // 1. Homepage
  urls.push({
    loc: `${cleanBase}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
  });

  // 2. Categories
  CATEGORIES.forEach((cat) => {
    urls.push({
      loc: `${cleanBase}/category/${encodeURIComponent(cat.id)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // 3. Tool Pages (Clean Canonical URLs)
  TOOLS.forEach((tool) => {
    urls.push({
      loc: `${cleanBase}/${encodeURIComponent(tool.id)}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9',
    });
  });

  // 4. Legal Pages (Clean Canonical URLs)
  LEGAL_PAGES.forEach((page) => {
    urls.push({
      loc: `${cleanBase}/${encodeURIComponent(page)}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.5',
    });
  });

  // Build XML string
  const xmlEntries = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Google AdSense Crawler
User-agent: Mediapartners-Google
Allow: /

# Googlebot Image Crawler
User-agent: Googlebot-Image
Allow: /

# Sitemap
Sitemap: ${cleanBase}/sitemap.xml
`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
