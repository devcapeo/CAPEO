import Card from '@/components/ui/Card/Card'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import ListingGate from '@/components/listing/ListingGate/ListingGate'
import styles from './page.module.css'

export const metadata = {
  title: 'Publier un actif',
  description:
    "Publiez votre actif sur CAPEO : annonce examinée par notre équipe, contacts réservés aux acquéreurs dont l'identité est vérifiée, aucune commission sur la vente.",
  alternates: { canonical: '/deposer-un-actif' },
}

const STEPS = [
  'Vous décrivez votre actif : brouillon enregistrable à tout moment.',
  'Vous soumettez l’annonce : notre équipe l’examine, une par une.',
  'Après validation et vérification de votre identité, l’annonce est publiée.',
  'Seuls les acquéreurs vérifiés peuvent vous contacter ou rejoindre la Business Room.',
]

const RULES = [
  'Décrivez l’actif, sans promesse financière : ni rendement, ni plus-value, ni avantage fiscal.',
  'Entreprises et startups : cessions uniquement, jamais de levée de fonds.',
  'Vos chiffres sont affichés comme « fournis par le vendeur, non vérifiés par CAPEO ».',
  'La transaction se conclut hors plateforme, avec vos conseils. Aucune commission.',
]

export default function PublishPage() {
  return (
    <div className={`container ${styles.page}`}>
      <SectionHeading
        as="h1"
        eyebrow="Publier un actif"
        title="Présentez votre actif"
        accent="au cercle CAPEO."
        intro="Une annonce claire, examinée par notre équipe, présentée à des acquéreurs dont l'identité est vérifiée."
      />

      <div className={styles.layout}>
        <div className={styles.main}>
          <ListingGate />
        </div>

        <aside className={styles.aside}>
          <Card padding="lg" className={styles.card}>
            <p className={styles.cardTitle}>Comment ça se passe</p>
            <ol className={styles.steps}>
              {STEPS.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </Card>
          <Card padding="lg" accent className={styles.card}>
            <p className={styles.cardTitle}>Le cadre CAPEO</p>
            <ul className={styles.rules}>
              {RULES.map((rule) => <li key={rule}>{rule}</li>)}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  )
}
