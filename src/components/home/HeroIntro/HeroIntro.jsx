import { SITE } from '@/config/site'
import Button from '@/components/ui/Button/Button'
import styles from './HeroIntro.module.css'

/**
 * Couche texte du hero, rendue côté serveur (SEO, LCP).
 * En phase 1, la scène Three.js immersive viendra se placer derrière,
 * chargée en différé : ce bloc reste le contenu indexé de la Home.
 */
export default function HeroIntro() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>Place de marché d&apos;actifs d&apos;exception</p>
        <h1 id="hero-title" className={styles.title}>
          {SITE.slogan.lead} <em className={styles.accent}>{SITE.slogan.accent}</em>
        </h1>
        <p className={styles.lead}>
          Immeubles, domaines, propriétés de prestige : CAPEO réunit les annonces d&apos;actifs rares
          et met en relation vendeurs et acquéreurs vérifiés, en toute discrétion.
        </p>
        <div className={styles.actions}>
          <Button href="/actifs" size="lg">Explorer les actifs</Button>
          <Button href="/deposer-un-actif" variant="glass" size="lg">Publier un actif</Button>
        </div>
        <ul className={styles.trust}>
          <li>0 % de commission sur la vente</li>
          <li>Profils vérifiés</li>
          <li>Mise en relation privée</li>
        </ul>
      </div>
    </section>
  )
}
