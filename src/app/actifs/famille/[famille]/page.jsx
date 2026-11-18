import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ASSET_FAMILIES } from '@/config/site'
import { getAssets, isDemoCatalog } from '@/lib/assets/catalog'
import { getFamily } from '@/lib/assets/labels'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import FamilyTabs from '@/components/assets/FamilyTabs/FamilyTabs'
import DemoNotice from '@/components/assets/DemoNotice/DemoNotice'
import AssetGrid from '@/components/assets/AssetGrid/AssetGrid'
import AssetExplorer from '@/components/assets/AssetExplorer/AssetExplorer'
import FamilyComingSoon from '@/components/assets/FamilyComingSoon/FamilyComingSoon'
import styles from '../../actifs.module.css'

/* Une page par famille, générée au build ; toute autre URL renvoie une 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return ASSET_FAMILIES.map((family) => ({ famille: family.slug }))
}

export async function generateMetadata({ params }) {
  const { famille } = await params
  const family = getFamily(famille)
  if (!family) return {}

  return {
    title: `${family.label} — actifs à acquérir`,
    description: family.intro,
    alternates: { canonical: `/actifs/famille/${family.slug}` },
    /* Indexation à l'ouverture réelle de la famille, avec de vraies annonces */
    robots: { index: false, follow: true },
  }
}

export default async function FamilyPage({ params }) {
  const { famille } = await params
  const family = getFamily(famille)
  if (!family) notFound()

  const assets = family.available ? await getAssets({ family: family.slug }) : []

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb items={[{ href: '/', label: 'Accueil' }, { href: '/actifs', label: 'Actifs' }, { label: family.label }]} />
      <SectionHeading
        as="h1"
        eyebrow={family.available ? 'Famille ouverte' : 'Bientôt sur CAPEO'}
        title={family.label}
        intro={family.intro}
        className={styles.heading}
      />
      <FamilyTabs current={family.slug} />

      {family.available ? (
        <>
          {isDemoCatalog && <DemoNotice />}
          <Suspense fallback={<AssetGrid assets={assets} />}>
            <AssetExplorer assets={assets} types={family.types} />
          </Suspense>
        </>
      ) : (
        <FamilyComingSoon family={family} />
      )}
    </div>
  )
}
