import Link from 'next/link'
import styles from './Breadcrumb.module.css'

/* Fil d'Ariane. items : [{ href, label }] — le dernier élément est la page courante. */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Fil d'Ariane" className={styles.breadcrumb}>
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.href ?? item.label}>
              {isLast ? <span aria-current="page">{item.label}</span> : <Link href={item.href}>{item.label}</Link>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
