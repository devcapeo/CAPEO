import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import styles from './not-found.module.css'

export const metadata = {
  title: 'Page introuvable',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <section className={`container-narrow ${styles.wrapper}`}>
      <Card padding="lg" accent className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>
          Cette page <em>n&apos;existe pas</em>
        </h1>
        <p className={styles.text}>
          Le lien est peut-être erroné, ou l&apos;annonce a été retirée par son vendeur.
        </p>
        <div className={styles.actions}>
          <Button href="/">Retour à l&apos;accueil</Button>
          <Button href="/actifs" variant="glass">Voir les actifs</Button>
        </div>
      </Card>
    </section>
  )
}
