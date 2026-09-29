import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// /_next/ must stay crawlable: it serves the CSS and JS Google needs to render
// pages properly. /account is left crawlable on purpose too, so crawlers can
// see the job system's own noindex tag instead of indexing a blocked URL.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
