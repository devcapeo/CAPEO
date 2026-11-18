import { Suspense } from 'react'
import { ASSET_FAMILIES } from '@/config/site'
import { getAssets, isDemoCatalog } from '@/lib/assets/catalog'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import FamilyTabs from '@/components/assets/FamilyTabs/FamilyTabs'
import DemoNotice from '@/components/assets/DemoNotice/DemoNotice'
import AssetGrid from '@/components/assets/AssetGrid/AssetGrid'
import AssetExplorer from '@/components/assets/AssetExplorer/AssetExplorer'
import styles from './actifs.module.css'

export const metadata = {
  title: 'Actifs disponibles',
  description:
    "Immobilier, entreprises à céder, startups, objets rares : les actifs présentés sur CAPEO, par des vendeurs dont l'identité est vérifiée. Mise en relation pure, zéro commission.",
  alternates: { canonical: '/actifs' },
  /* Pas d'indexation tant que le catalogue contient des annonces d'exemple */
  robots: isDemoCatalog ? { index: false, follow: true } : undefined,
}

/* Types proposés dans le filtre : ceux des familles ouvertes */
const OPEN_TYPES = ASSET_FAMILIES.filter((family) => family.available).flatMap((family) => family.types)

export default async function AssetsPage() {
  const assets = await getAssets()

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb items={[{ href: '/', label: 'Accueil' }, { label: 'Actifs' }]} />
      <SectionHeading
        as="h1"
        eyebrow="Actifs disponibles"
        title="Des actifs rares,"
        accent="des vendeurs vérifiés."
        intro="Chaque annonce est examinée par notre équipe avant publication. Pour contacter un vendeur ou rejoindre la Business Room d'un actif, votre identité doit être vérifiée."
        className={styles.heading}
      />
      <FamilyTabs current="tous" />
      {isDemoCatalog && <DemoNotice />}
      <Suspense fallback={<AssetGrid assets={assets} />}>
        <AssetExplorer assets={assets} types={OPEN_TYPES} />
      </Suspense>
    </div>
  )
}
