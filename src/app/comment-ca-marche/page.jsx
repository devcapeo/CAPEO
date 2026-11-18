import { FAQ } from '@/content/howItWorks'
import Button from '@/components/ui/Button/Button'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Pillars from '@/components/sections/Pillars/Pillars'
import Journeys from '@/components/sections/Journeys/Journeys'
import CoAcquisition from '@/components/sections/CoAcquisition/CoAcquisition'
import AssetFamilies from '@/components/sections/AssetFamilies/AssetFamilies'
import Faq from '@/components/sections/Faq/Faq'
import styles from './page.module.css'

export const metadata = {
  title: 'Comment ça marche',
  description:
    "Vérification humaine des profils et des annonces, identité contrôlée avant tout contact, Business Room privée par actif : comment CAPEO met en relation vendeurs et acquéreurs d'actifs rares, sans commission.",
  alternates: { canonical: '/comment-ca-marche' },
}

export default function HowItWorksPage() {
  return (
    <div className={styles.page}>
      <section className={`container ${styles.intro}`}>
        <SectionHeading
          as="h1"
          eyebrow="Comment ça marche"
          title="Un cercle de confiance,"
          accent="pas un mur d'annonces."
          intro="CAPEO réunit vendeurs et acquéreurs sérieux autour d'actifs rares. Chaque membre est vérifié, chaque annonce est examinée, chaque échange a lieu dans un espace tracé. La transaction, elle, se conclut hors plateforme, sans commission."
        />
        <div className={styles.introActions}>
          <Button href="#acquereur" variant="glass">Parcours acquéreur</Button>
          <Button href="#vendeur" variant="ghost">Parcours vendeur</Button>
        </div>
      </section>

      <section className={`container ${styles.section}`} aria-label="La différence CAPEO">
        <SectionHeading eyebrow="La différence CAPEO" title="Trois garanties" accent="avant la première poignée de main." />
        <Pillars />
      </section>

      <section className={`container ${styles.section}`} aria-label="Parcours">
        <SectionHeading eyebrow="Pas à pas" title="De l'inscription" accent="à la signature." />
        <Journeys />
      </section>

      <section className={`container ${styles.section}`} aria-label="Co-acquisition">
        <CoAcquisition />
      </section>

      <section className={`container ${styles.section}`} aria-label="Familles d'actifs">
        <SectionHeading
          eyebrow="Actifs rares"
          title="Une place de marché"
          accent="multi-actifs."
          intro="Le catalogue ouvre avec l'immobilier. Les entreprises à céder, les startups et les objets rares suivront."
        />
        <AssetFamilies />
      </section>

      <section className={`container-narrow ${styles.section}`} aria-label="Questions fréquentes">
        <SectionHeading eyebrow="Questions fréquentes" title="Ce qu'on nous demande" accent="le plus souvent." />
        <Faq items={FAQ} />
      </section>
    </div>
  )
}
