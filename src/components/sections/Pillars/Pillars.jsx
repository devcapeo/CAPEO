import { PILLARS } from '@/content/howItWorks'
import Card from '@/components/ui/Card/Card'
import styles from './Pillars.module.css'

/* Pictogrammes au trait, dessinés pour CAPEO */
const ICONS = {
  review: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5M8.5 11l1.8 1.8L14 9.2" />
    </>
  ),
  identity: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2.3" />
      <path d="M5.8 16.2c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h4M14.5 13.5h3" />
    </>
  ),
  room: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" />
    </>
  ),
}

export default function Pillars() {
  return (
    <div className={styles.grid}>
      {PILLARS.map((pillar, index) => (
        <Card key={pillar.title} as="article" padding="lg" accent={index === 1} className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              {ICONS[pillar.icon]}
            </svg>
          </span>
          <h3 className={styles.title}>{pillar.title}</h3>
          <p className={styles.text}>{pillar.text}</p>
        </Card>
      ))}
    </div>
  )
}
