'use client'

import Badge from '@/components/ui/Badge/Badge'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import Spinner from '@/components/ui/Spinner/Spinner'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import { KYC_LABELS, REVIEW_LABELS, useAccount } from './accountOverview.logic'
import styles from './AccountOverview.module.css'

export default function AccountOverview() {
  const { status, user, profile, counts, signOut } = useAccount()

  if (status !== 'authenticated') {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    )
  }

  const kyc = KYC_LABELS[profile?.kyc_status ?? 'not_started']
  const review = REVIEW_LABELS[profile?.review_status ?? 'pending']

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <SectionHeading as="h1" eyebrow="Mon espace" title="Bonjour" accent={profile?.first_name ? `${profile.first_name}.` : '.'} />
        <Button variant="ghost" size="sm" onClick={signOut}>Se déconnecter</Button>
      </div>

      <div className={styles.grid}>
        <Card padding="lg" accent className={styles.card}>
          <div className={styles.cardHead}>
            <p className={styles.cardTitle}>Vérification d&apos;identité</p>
            <Badge tone={kyc.tone} dot>{kyc.label}</Badge>
          </div>
          <p className={styles.text}>{kyc.text}</p>
        </Card>

        <Card padding="lg" className={styles.card}>
          <div className={styles.cardHead}>
            <p className={styles.cardTitle}>Examen du profil</p>
            <Badge tone={review.tone} dot>{review.label}</Badge>
          </div>
          <p className={styles.text}>{review.text}</p>
        </Card>

        <Card padding="lg" className={styles.card}>
          <p className={styles.cardTitle}>Mes annonces</p>
          <p className={styles.count}>{counts.assets ?? '—'}</p>
          <Button href="/deposer-un-actif" variant="glass" size="sm">Publier un actif</Button>
        </Card>

        <Card padding="lg" className={styles.card}>
          <p className={styles.cardTitle}>Mes favoris</p>
          <p className={styles.count}>{counts.favorites ?? '—'}</p>
          <Button href="/actifs" variant="glass" size="sm">Explorer les actifs</Button>
        </Card>
      </div>

      <Card padding="lg" className={styles.details}>
        <p className={styles.cardTitle}>Mes informations</p>
        <dl className={styles.list}>
          <div><dt>Nom</dt><dd>{[profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || '—'}</dd></div>
          <div><dt>Adresse e-mail</dt><dd>{user.email}</dd></div>
          <div><dt>Profil</dt><dd>{profile?.member_kind === 'professionnel' ? 'Professionnel' : 'Particulier'}</dd></div>
          {profile?.company_name && <div><dt>Société</dt><dd>{profile.company_name}</dd></div>}
        </dl>
      </Card>
    </div>
  )
}
