'use client'

import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Spinner from '@/components/ui/Spinner/Spinner'
import { useAuth } from '@/components/auth/AuthProvider/auth.logic'
import ListingForm from '@/components/listing/ListingForm/ListingForm'
import styles from './ListingGate.module.css'

/* Le dépôt d'annonce est réservé aux membres connectés. */
export default function ListingGate() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    )
  }

  if (status === 'anonymous') {
    return (
      <Card padding="lg" accent className={styles.gate}>
        <p className={styles.title}>Connectez-vous pour publier un actif</p>
        <p className={styles.text}>
          Le dépôt d&apos;annonce est réservé aux membres. Créez votre compte en quelques minutes : votre annonce sera
          examinée par notre équipe avant publication.
        </p>
        <div className={styles.actions}>
          <Button href="/inscription?suite=/deposer-un-actif">Créer un compte</Button>
          <Button href="/connexion?suite=/deposer-un-actif" variant="glass">Se connecter</Button>
        </div>
      </Card>
    )
  }

  return <ListingForm />
}
