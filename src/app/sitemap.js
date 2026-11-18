import { SITE } from '@/config/site'

/*
 * sitemap.xml — pages publiques indexables.
 * Les pages légales y entreront une fois finalisées (elles sont en noindex d'ici là) ;
 * les annonces s'y ajouteront en phase 2, générées depuis la base.
 */
const PUBLIC_ROUTES = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/comment-ca-marche', changeFrequency: 'monthly', priority: 0.8 },
]

export default function sitemap() {
  const lastModified = new Date()
  return PUBLIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
