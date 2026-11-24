import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Price from '@/components/ui/Price/Price'
import Badge from '@/components/ui/Badge/Badge'
import SellerDataNotice from '@/components/assets/SellerDataNotice/SellerDataNotice'
import styles from './AssetContactPanel.module.css'

/*
 * Panneau latéral d'une fiche : prix, vendeur, accès à la Business Room.
 * Tout contact passe par la Business Room, réservée aux identités vérifiées (KYC).
 * Co-acquisition : présentée comme une mise en relation, jamais comme une collecte.
 */
export default function AssetContactPanel({ asset }) {
  const room = `/business-room/${asset.slug}`

  return (
    <Card as="aside" padding="lg" accent className={styles.panel} aria-label="Contacter le vendeur">
      <div className={styles.price}>
        <p className={styles.label}>Prix demandé</p>
        <Price amount={asset.price} size="lg" />
        <SellerDataNotice />
      </div>

      <div className={styles.seller}>
        <Badge tone="gold" dot>Identité vérifiée</Badge>
        <p>Vendeur {asset.seller.kind.toLowerCase()} · annonce examinée par l&apos;équipe CAPEO</p>
      </div>

      <div className={styles.actions}>
        <Button href={room} fullWidth>Accéder à la Business Room</Button>
        <Button href={room} variant="glass" fullWidth>Contacter le vendeur</Button>
        <p className={styles.hint}>
          Votre identité doit être vérifiée avant toute prise de contact. Sans frais, sans commission.
        </p>
      </div>

      {asset.coAcquisition && (
        <div className={styles.coAcquisition}>
          <p className={styles.coTitle}>Ouvert à plusieurs acquéreurs</p>
          <p>
            Le vendeur accepte d&apos;échanger avec plusieurs acquéreurs vérifiés dans la Business Room. Les intentions
            qui y sont déclarées ne sont pas contractuelles ; les co-acquéreurs se structurent avec leurs propres
            conseils.
          </p>
        </div>
      )}

      {asset.documents.length > 0 && (
        <div className={styles.documents}>
          <p className={styles.label}>Documents disponibles en Business Room</p>
          <ul>
            {asset.documents.map((document) => <li key={document}>{document}</li>)}
          </ul>
        </div>
      )}
    </Card>
  )
}
