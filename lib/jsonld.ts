// Data-free structured data helpers, safe to import from client components
// without pulling business or area data into the browser bundle.

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function jsonLdGraph(...nodes: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
}
