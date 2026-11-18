import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import styles from './FamilyComingSoon.module.css'

const PROMISES = [
  {
    title: 'La même exigence',
    text: 'Chaque profil et chaque annonce examinés un par un par notre équipe, identité vérifiée avant tout contact.',
  },
  {
    title: 'Une Business Room par actif',
    text: 'Échanges tracés et documents partagés entre le vendeur et les acquéreurs vérifiés, seuls ou ensemble.',
  },
  {
    title: 'Mise en relation pure',
    text: 'Aucune commission, aucun fonds ne transite par CAPEO : la transaction se conclut entre les parties et leurs conseils.',
  },
]

/* Page d'une famille d'actifs pas encore ouverte : on assume le multi-actifs sans afficher d'annonces. */
export default function FamilyComingSoon({ family }) {
  return (
    <div className={styles.wrapper}>
      <Card padding="lg" accent className={styles.status}>
        <p className={styles.badge}>Bientôt</p>
        <p className={styles.text}>
          La famille « {family.label} » ouvrira après l&apos;immobilier. Créez votre compte dès maintenant : votre
          identité sera déjà vérifiée le jour de l&apos;ouverture.
        </p>
        <div className={styles.actions}>
          <Button href="/inscription">Créer mon compte</Button>
          <Button href="/actifs/famille/immobilier" variant="glass">Voir l&apos;immobilier</Button>
        </div>
      </Card>

      <ul className={styles.promises}>
        {PROMISES.map((promise) => (
          <li key={promise.title}>
            <p className={styles.promiseTitle}>{promise.title}</p>
            <p className={styles.promiseText}>{promise.text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
