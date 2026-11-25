import AdminApp from '@/components/admin/AdminApp/AdminApp'
import styles from './page.module.css'

export const metadata = {
  title: 'Espace admin',
  robots: { index: false, follow: false },
}

/* Back-office CAPEO : rendu côté client, accès garanti par le rôle admin en base */
export default function AdminPage() {
  return (
    <div className={styles.page}>
      <AdminApp />
    </div>
  )
}
