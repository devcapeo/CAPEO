import { SITE } from '@/config/site'
import { HERO_STEPS, HERO_TRUST } from '@/content/home'
import Button from '@/components/ui/Button/Button'
import HeroStage from '@/components/home/HeroStage/HeroStage'
import styles from './Hero.module.css'

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Hero de la Home : descente immersive en cinq étapes.
 * Tout le texte est rendu côté serveur (H1 + étapes) ; <HeroStage> ajoute la scène
 * générative après l'affichage et pilote l'étape active au scroll.
 */
export default function Hero() {
  const [intro, ...steps] = HERO_STEPS

  return (
    <section className={styles.hero} data-hero data-step="0" aria-labelledby="hero-title">
      <div className={styles.sticky}>
        <HeroStage />

        <div className={`container ${styles.layer}`}>
          <div className={`${styles.step} ${styles.intro}`} data-hero-step="0" data-active="">
            <p className={styles.eyebrow}>{intro.eyebrow}</p>
            <h1 id="hero-title" className={styles.title}>
              {SITE.slogan.lead} <em className={styles.accent}>{SITE.slogan.accent}</em>
            </h1>
            <p className={styles.lead}>{intro.lead}</p>
            <div className={styles.actions}>
              <Button href="/actifs" size="lg" icon={ArrowIcon}>Explorer les actifs</Button>
              <Button href="/comment-ca-marche" variant="glass" size="lg">Comment ça marche</Button>
            </div>
            <ul className={styles.trust}>
              {HERO_TRUST.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            return (
              <div key={step.eyebrow} className={styles.step} data-hero-step={index + 1}>
                <p className={styles.eyebrow}>{step.eyebrow}</p>
                <h2 className={styles.stepTitle}>{step.title}</h2>
                <p className={styles.stepText}>{step.text}</p>
                {isLast && (
                  <div className={styles.actions}>
                    <Button href="/inscription" size="lg" icon={ArrowIcon}>Rejoindre le cercle</Button>
                    <Button href="/deposer-un-actif" variant="glass" size="lg">Publier un actif</Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railFill} />
          {HERO_STEPS.map((step, index) => (
            <span key={step.eyebrow} className={styles.railTick} style={{ '--tick': index / (HERO_STEPS.length - 1) }} />
          ))}
        </div>

        <p className={styles.scrollHint} aria-hidden="true">
          <span>Défiler</span>
          <span className={styles.scrollLine} />
        </p>
      </div>
    </section>
  )
}
