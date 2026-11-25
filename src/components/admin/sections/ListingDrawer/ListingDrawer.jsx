'use client'

import Link from 'next/link'
import Drawer from '@/components/admin/Drawer/Drawer'
import Button from '@/components/ui/Button/Button'
import Badge from '@/components/ui/Badge/Badge'
import Input from '@/components/ui/Input/Input'
import Spinner from '@/components/ui/Spinner/Spinner'
import FormStatus from '@/components/auth/FormStatus/FormStatus'
import { formatFigure, formatPrice } from '@/lib/format'
import { getFamily, getTypeLabel } from '@/lib/assets/labels'
import { KYC_LABELS, LISTING_LABELS, formatDateTime } from '@/lib/admin/period'
import { useListingReview } from './listingDrawer.logic'
import styles from './ListingDrawer.module.css'

/* Fiche complète d'une annonce et décisions : publier, refuser (motif), remettre en examen, archiver, mettre en avant */
export default function ListingDrawer({ listing, onClose, onChanged }) {
  const review = useListingReview(listing, onChanged)
  if (!listing) return null
  const asset = review.detail.data
  const status = LISTING_LABELS[listing.status]

  return (
    <Drawer
      open
      title={listing.title}
      subtitle={`${getFamily(listing.family)?.label ?? listing.family} · ${listing.city}${listing.region ? `, ${listing.region}` : ''}`}
      onClose={onClose}
      footer={
        <>
          <Button size="sm" onClick={() => review.decide('publish')} loading={review.pending === 'publish'} disabled={listing.status === 'published'}>
            Publier
          </Button>
          <Button size="sm" variant="ghost" onClick={() => review.decide('reject')} loading={review.pending === 'reject'}>
            Refuser
          </Button>
          <Button size="sm" variant="ghost" onClick={() => review.decide('review')} disabled={listing.status === 'pending_review'}>
            Remettre en examen
          </Button>
          <Button size="sm" variant="ghost" onClick={() => review.decide('archive')} disabled={listing.status === 'archived'}>
            Archiver
          </Button>
          {listing.status === 'published' && (
            <Button size="sm" variant="glass" onClick={() => review.feature(listing.featured ? 0 : 30)} loading={review.pending?.startsWith('feature')}>
              {listing.featured ? 'Retirer la mise en avant' : 'Mettre en avant 30 j'}
            </Button>
          )}
        </>
      }
    >
      {review.message && <FormStatus tone={review.message.tone}>{review.message.text}</FormStatus>}

      <div className={styles.badges}>
        <Badge tone={status.tone}>{status.label}</Badge>
        {listing.featured && <Badge tone="gold">Mise en avant jusqu&apos;au {formatDateTime(listing.featured_until)}</Badge>}
        {listing.co_acquisition && <Badge tone="cobalt">Plusieurs acquéreurs possibles</Badge>}
        <Badge tone={KYC_LABELS[listing.seller_kyc].tone}>Vendeur : identité {KYC_LABELS[listing.seller_kyc].label.toLowerCase()}</Badge>
      </div>

      <div className={styles.links}>
        {listing.status === 'published' && <Link href={`/actifs/${listing.slug}`} target="_blank">Voir la fiche publique</Link>}
        <Link href={`/business-room/${listing.slug}`} target="_blank">Business Room</Link>
      </div>

      <dl className={styles.fields}>
        <div><dt>Prix</dt><dd className={styles.mono}>{formatPrice(listing.price)}</dd></div>
        <div><dt>Type</dt><dd>{asset ? getTypeLabel(asset) || asset.type : listing.type}</dd></div>
        <div><dt>Vendeur</dt><dd>{listing.seller_name || '—'}<br /><small>{listing.seller_email}</small></dd></div>
        <div><dt>Créée</dt><dd>{formatDateTime(listing.created_at)}</dd></div>
        <div><dt>Modifiée</dt><dd>{formatDateTime(listing.updated_at)}</dd></div>
        <div><dt>Publiée</dt><dd>{formatDateTime(listing.published_at)}</dd></div>
      </dl>

      {listing.review_note && <FormStatus tone="info">Dernier motif transmis : {listing.review_note}</FormStatus>}

      {!asset ? (
        <Spinner />
      ) : (
        <>
          <section className={styles.block}>
            <p className={styles.blockTitle}>Résumé</p>
            <p className={styles.text}>{asset.summary || '—'}</p>
          </section>
          {asset.description?.length > 0 && (
            <section className={styles.block}>
              <p className={styles.blockTitle}>Description</p>
              {asset.description.map((paragraph, index) => <p key={index} className={styles.text}>{paragraph}</p>)}
            </section>
          )}
          {asset.highlights?.length > 0 && (
            <section className={styles.block}>
              <p className={styles.blockTitle}>Points forts</p>
              <ul className={styles.list}>{asset.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}
          {Array.isArray(asset.figures) && asset.figures.length > 0 && (
            <section className={styles.block}>
              <p className={styles.blockTitle}>Chiffres déclarés par le vendeur</p>
              <dl className={styles.fields}>
                {asset.figures.map((figure, index) => (
                  <div key={index}><dt>{figure.label}</dt><dd className={styles.mono}>{formatFigure(figure)}</dd></div>
                ))}
              </dl>
            </section>
          )}
          {asset.document_labels?.length > 0 && (
            <section className={styles.block}>
              <p className={styles.blockTitle}>Documents annoncés</p>
              <p className={styles.text}>{asset.document_labels.join(' · ')}</p>
            </section>
          )}
        </>
      )}

      <section className={styles.block}>
        <p className={styles.blockTitle}>Message au vendeur</p>
        <Input
          multiline
          rows={3}
          label="Motif du refus ou remarque"
          hint="Obligatoire pour un refus. Envoyé au vendeur par e-mail et visible dans son espace."
          value={review.note}
          onChange={(event) => review.setNote(event.target.value)}
          maxLength={600}
        />
        <p className={styles.check}>
          Avant de publier : identité du vendeur vérifiée, vocabulaire conforme (pas de rendement, de plus-value ni d&apos;« investissement »), chiffres présentés comme déclarés par le vendeur.
        </p>
      </section>
    </Drawer>
  )
}
