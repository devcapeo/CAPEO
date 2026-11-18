import { SITE } from '@/config/site'
import Button from '@/components/ui/Button/Button'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Hero from '@/components/home/Hero/Hero'
import Pillars from '@/components/sections/Pillars/Pillars'
import AssetFamilies from '@/components/sections/AssetFamilies/AssetFamilies'
import styles from './page.module.css'

export const metadata = {
  alternates: { canonical: '/' },
}

/* Données structurées de l'organisation (SEO) */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  alternateName: SITE.meaning,
  url: SITE.url,
  description: SITE.description,
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className={`container ${styles.section}`} aria-label="La différence CAPEO">
        <SectionHeading
          eyebrow="La différence CAPEO"
          title="Pas un mur d'annonces."
          accent="Un cercle de confiance."
          intro={SITE.pitch}
        />
        <Pillars />
      </section>

      <section className={`container ${styles.section}`} aria-label="Familles d'actifs">
        <SectionHeading
          eyebrow="Actifs rares"
          title="Immobilier, entreprises,"
          accent="startups, objets rares."
          intro="Le catalogue ouvre avec l'immobilier. Les autres familles d'actifs suivent, avec la même exigence de vérification."
        />
        <AssetFamilies />
        <div className={styles.more}>
          <Button href="/comment-ca-marche" variant="glass">Découvrir comment ça marche</Button>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
    </>
  )
}
