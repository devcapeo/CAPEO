import Link from 'next/link'
import { SITE, FOOTER_COLUMNS, LEGAL_LINKS, LEGAL_NOTICE, SOCIAL_LINKS } from '@/config/site'
import Logo from '@/components/layout/Logo/Logo'
import Button from '@/components/ui/Button/Button'
import styles from './Footer.module.css'

const SOCIAL_ICONS = {
  linkedin: (
    <path d="M5.5 7.5V13M5.5 5.2v.1M8.5 13V9.8a1.8 1.8 0 013.5 0V13M3 2h12a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="14" height="14" rx="4" />
      <circle cx="9" cy="9" r="3.2" />
      <circle cx="13" cy="5" r="0.6" />
    </>
  ),
}

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <section className={styles.cta}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <p className={styles.eyebrow}>Rejoignez CAPEO</p>
            <h2 className={styles.ctaTitle}>
              Prêt à acquérir <em>l&apos;exception</em> ?
            </h2>
          </div>
          <div className={styles.ctaActions}>
            <Button href="/inscription" size="lg" icon={ArrowIcon}>Créer un compte</Button>
            <Button href="/actifs" variant="glass" size="lg">Explorer les actifs</Button>
          </div>
        </div>
      </section>

      <div className={`container ${styles.main}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.meaning}>{SITE.meaning}</p>
          <p className={styles.tagline}>Place de marché d&apos;actifs d&apos;exception. Mise en relation privée entre vendeurs et acquéreurs vérifiés.</p>
          <div className={styles.social}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.icon}
                href={social.href}
                className={styles.socialLink}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
                  {SOCIAL_ICONS[social.icon]}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} className={styles.column} aria-label={column.title}>
            <p className={styles.columnTitle}>{column.title}</p>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className={styles.legal}>
          <p className={styles.columnTitle}>Cadre</p>
          <p className={styles.notice}>{LEGAL_NOTICE}</p>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {year} {SITE.name} — {SITE.meaning}. Tous droits réservés.</p>
        <nav className={styles.legalLinks} aria-label="Informations légales">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
