import AssetCard from '@/components/assets/AssetCard/AssetCard'
import styles from './AssetGrid.module.css'

/* Grille de cartes d'annonces. Rendue côté serveur : c'est elle que lisent les moteurs. */
export default function AssetGrid({ assets }) {
  return (
    <ul className={styles.grid}>
      {assets.map((asset) => (
        <li key={asset.id}>
          <AssetCard asset={asset} />
        </li>
      ))}
    </ul>
  )
}
