import { buildFaqJsonLd } from './faq.logic'
import styles from './Faq.module.css'

/* FAQ en <details> natifs (aucun JavaScript), avec données structurées pour Google. */
export default function Faq({ items }) {
  return (
    <>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.question}>
              {item.question}
              <span className={styles.toggle} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(items)) }}
      />
    </>
  )
}
