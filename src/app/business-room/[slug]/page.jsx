import BusinessRoom from '@/components/businessRoom/BusinessRoom/BusinessRoom'
import { isDemoCatalog } from '@/lib/assets/catalog'
import styles from './page.module.css'

export const metadata = {
  title: 'Business Room',
  robots: { index: false, follow: false },
}

/* Espace privé d'un actif : rendu côté client (session du navigateur), protégé par les règles d'accès de la base. */
export default async function BusinessRoomPage({ params }) {
  const { slug } = await params
  return (
    <div className={`container ${styles.page}`}>
      <BusinessRoom slug={slug} showListingLink={!isDemoCatalog} />
    </div>
  )
}
