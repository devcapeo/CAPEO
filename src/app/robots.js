import { SITE } from '@/config/site'

/* robots.txt — les espaces privés et pages internes ne sont pas explorés. */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/espace', '/business-room', '/admin', '/api/', '/styleguide'],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
