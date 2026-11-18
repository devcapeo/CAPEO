import AccountOverview from '@/components/account/AccountOverview/AccountOverview'
import styles from './page.module.css'

export const metadata = {
  title: 'Mon espace',
  robots: { index: false, follow: false },
}

/* Espace membre : rendu côté client (session du navigateur), protégé par les règles d'accès de la base. */
export default function AccountPage() {
  return (
    <div className={`container ${styles.page}`}>
      <AccountOverview />
    </div>
  )
}
