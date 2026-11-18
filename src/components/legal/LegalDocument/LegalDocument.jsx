import Link from 'next/link'
import { LEGAL_LINKS } from '@/config/site'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import { slugify, splitPlaceholders } from './legalDocument.logic'
import styles from './LegalDocument.module.css'

function RichText({ text }) {
  return splitPlaceholders(text).map((segment, index) =>
    segment.placeholder ? (
      <mark key={index} className={styles.placeholder}>{segment.text}</mark>
    ) : (
      <span key={index}>{segment.text}</span>
    )
  )
}

/* Rendu commun des pages légales : sommaire, sections numérotées, mentions à compléter surlignées. */
export default function LegalDocument({ document, currentHref }) {
  return (
    <article className={`container ${styles.page}`}>
      <SectionHeading as="h1" eyebrow="Informations légales" title={document.title} />
      <p className={styles.updated}>
        Dernière mise à jour : <RichText text={document.updated} />
      </p>

      <p className={styles.draft} role="note">
        Projet de document en cours de validation juridique. Les mentions surlignées seront complétées avant
        l&apos;ouverture de la plateforme.
      </p>

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="Sommaire">
          <p className={styles.tocTitle}>Sommaire</p>
          <ol>
            {document.sections.map((section) => (
              <li key={section.title}>
                <a href={`#${slugify(section.title)}`}>{section.title}</a>
              </li>
            ))}
          </ol>
          <p className={styles.tocTitle}>Autres documents</p>
          <ul>
            {LEGAL_LINKS.filter((link) => link.href !== currentHref).map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.body}>
          {document.sections.map((section, index) => (
            <section key={section.title} id={slugify(section.title)} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}><RichText text={paragraph} /></p>
              ))}
              {section.list && (
                <ul className={styles.list}>
                  {section.list.map((item) => <li key={item}><RichText text={item} /></li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}
