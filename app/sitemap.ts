import type { MetadataRoute } from 'next'
import { AREAS } from '@/lib/areas'
import { SITE_URL } from '@/lib/seo'

// Bump this when page content genuinely changes. A lastModified that moves on
// every build (new Date()) teaches search engines to ignore it entirely.
const CONTENT_UPDATED = new Date('2026-09-28')
const LEGAL_UPDATED = new Date('2026-09-20')

type Entry = MetadataRoute.Sitemap[number]

function page(path: string, priority: number, changeFrequency: Entry['changeFrequency'] = 'monthly', lastModified = CONTENT_UPDATED): Entry {
  return { url: path === '/' ? SITE_URL : `${SITE_URL}${path}`, lastModified, changeFrequency, priority }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    page('/', 1, 'weekly'),
    page('/mobile-car-detailing', 0.9),
    page('/mobile-car-wash', 0.9),
    page('/professional-car-valeting', 0.9),
    page('/interior-car-detailing', 0.9),
    page('/exterior-car-detailing', 0.9),
    page('/full-car-detail', 0.9),
    page('/van-fleet', 0.8),
    page('/areas', 0.9),
    ...AREAS.map((area) => page(`/areas/${area.slug}`, 0.85)),
    page('/privacy', 0.3, 'yearly', LEGAL_UPDATED),
    page('/terms', 0.3, 'yearly', LEGAL_UPDATED),
    page('/cookies', 0.3, 'yearly', LEGAL_UPDATED),
  ]
}
