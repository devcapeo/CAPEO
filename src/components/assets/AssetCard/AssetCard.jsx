import Link from 'next/link'
import { formatFigure } from '@/lib/format'
import { getTypeLabel } from '@/lib/assets/labels'
import Badge from '@/components/ui/Badge/Badge'
import Price from '@/components/ui/Price/Price'
import AssetCover from '@/components/assets/AssetCover/AssetCover'
import SellerDataNotice from '@/components/assets/SellerDataNotice/SellerDataNotice'
import styles from './AssetCard.module.css'

/* Carte d'annonce. Les deux premiers chiffres descriptifs sont repris sous le prix. */
export default function AssetCard({ asset }) {
  const keyFigures = asset.figures.filter((figure) => !figure.financial).slice(0, 2)

  return (
    <article className={styles.card}>
      <Link href={`/actifs/${asset.slug}`} className={styles.link}>
        <div className={styles.media}>
          <AssetCover seed={asset.slug} type={asset.type} className={styles.cover} />
          <div className={styles.badges}>
            {asset.featured && <Badge tone="gold">Mise en avant</Badge>}
            {asset.coAcquisition && <Badge tone="cobalt">Co-acquisition ouverte</Badge>}
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.meta}>
            {getTypeLabel(asset)} · {asset.city}
          </p>
          <h3 className={styles.title}>{asset.title}</h3>

          <div className={styles.figures}>
            <Price amount={asset.price} size="md" />
            {keyFigures.length > 0 && (
              <p className={styles.keyFigures}>
                {keyFigures.map((figure) => `${figure.label} ${formatFigure(figure)}`).join(' · ')}
              </p>
            )}
            <SellerDataNotice plural />
          </div>
        </div>
      </Link>
    </article>
  )
}
