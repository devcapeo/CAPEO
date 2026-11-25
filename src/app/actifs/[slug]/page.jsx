import { notFound } from 'next/navigation'
import { getAssetBySlug, getAssetSlugs, getRelatedAssets, isDemoCatalog } from '@/lib/assets/catalog'
import { getFamily, getTypeLabel } from '@/lib/assets/labels'
import { formatDate } from '@/lib/format'
import Badge from '@/components/ui/Badge/Badge'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import AssetCover from '@/components/assets/AssetCover/AssetCover'
import AssetGrid from '@/components/assets/AssetGrid/AssetGrid'
import AssetContactPanel from '@/components/assets/AssetContactPanel/AssetContactPanel'
import DemoNotice from '@/components/assets/DemoNotice/DemoNotice'
import SellerFigure from '@/components/assets/SellerFigure/SellerFigure'
import styles from './page.module.css'

/*
 * Fiches générées au build ; une annonce publiée ensuite est générée à la première visite,
 * puis régénérée à chaque décision de modération (api/admin?action=revalidate).
 * Une annonce inconnue renvoie une 404.
 */
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAssetSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const asset = await getAssetBySlug(slug)
  if (!asset) return {}

  return {
    title: `${asset.title} — ${asset.city}`,
    description: asset.summary,
    alternates: { canonical: `/actifs/${asset.slug}` },
    robots: isDemoCatalog ? { index: false, follow: true } : undefined,
  }
}

export default async function AssetPage({ params }) {
  const { slug } = await params
  const asset = await getAssetBySlug(slug)
  if (!asset) notFound()

  const family = getFamily(asset.family)
  const typeLabel = getTypeLabel(asset)
  const related = await getRelatedAssets(asset)

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb
        items={[
          { href: '/', label: 'Accueil' },
          { href: '/actifs', label: 'Actifs' },
          { href: `/actifs/famille/${family.slug}`, label: family.label },
          { label: asset.title },
        ]}
      />
      {isDemoCatalog && <DemoNotice />}

      <div className={styles.layout}>
        <article className={styles.main}>
          <AssetCover seed={asset.slug} type={asset.type} label="Photos fournies à la publication" className={styles.cover} />

          <header className={styles.header}>
            <p className={styles.meta}>
              {typeLabel} · {asset.city} · {asset.region}
            </p>
            <h1 className={styles.title}>{asset.title}</h1>
            <div className={styles.badges}>
              <Badge tone="gold" dot>Annonce examinée par CAPEO</Badge>
              {asset.featured && <Badge tone="gold">Mise en avant</Badge>}
              {asset.coAcquisition && <Badge tone="cobalt">Co-acquisition ouverte</Badge>}
            </div>
            <p className={styles.summary}>{asset.summary}</p>
          </header>

          <section aria-labelledby="chiffres" className={styles.section}>
            <h2 id="chiffres" className={styles.sectionTitle}>Chiffres clés</h2>
            <dl className={styles.figures}>
              {asset.figures.map((figure) => (
                <SellerFigure key={figure.label} figure={figure} />
              ))}
            </dl>
          </section>

          <section aria-labelledby="description" className={styles.section}>
            <h2 id="description" className={styles.sectionTitle}>Description</h2>
            {asset.description.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>{paragraph}</p>
            ))}
            {asset.highlights.length > 0 && (
              <ul className={styles.highlights}>
                {asset.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
            )}
          </section>

          <p className={styles.framework}>
            Annonce publiée le {formatDate(asset.publishedAt)}. Les informations de cette annonce sont fournies par le
            vendeur, sous sa responsabilité ; elles ne sont pas vérifiées par CAPEO. CAPEO met en relation vendeurs et
            acquéreurs vérifiés : aucun fonds lié à l&apos;acquisition ne transite par la plateforme et aucune commission
            n&apos;est perçue. La transaction se conclut hors plateforme, entre les parties et leurs propres conseils.
          </p>
        </article>

        <div className={styles.aside}>
          <AssetContactPanel asset={asset} />
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related} aria-label="Actifs similaires">
          <SectionHeading eyebrow="À découvrir aussi" title="Actifs" accent="similaires." />
          <AssetGrid assets={related} />
        </section>
      )}
    </div>
  )
}
