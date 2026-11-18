'use client'

import { BUDGET_STEPS, listRegions } from '@/lib/assets/filters'
import Button from '@/components/ui/Button/Button'
import AssetGrid from '@/components/assets/AssetGrid/AssetGrid'
import { useAssetFilters } from './assetExplorer.logic'
import styles from './AssetExplorer.module.css'

/* Liste d'actifs filtrable. types : sous-catégories proposées dans le filtre « Type ». */
export default function AssetExplorer({ assets, types }) {
  const { filters, results, setFilter, resetFilters, filtered } = useAssetFilters(assets)
  const regions = listRegions(assets)

  return (
    <div className={styles.explorer}>
      <form className={styles.filters} onSubmit={(event) => event.preventDefault()} aria-label="Filtrer les actifs">
        <label className={styles.field}>
          <span>Type</span>
          <select value={filters.type} onChange={(event) => setFilter('type', event.target.value)}>
            <option value="">Tous les types</option>
            {types.map((type) => (
              <option key={type.slug} value={type.slug}>{type.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Localisation</span>
          <select value={filters.region} onChange={(event) => setFilter('region', event.target.value)}>
            <option value="">Toutes les régions</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Budget</span>
          <select value={filters.budget} onChange={(event) => setFilter('budget', event.target.value)}>
            <option value="">Tous les budgets</option>
            {BUDGET_STEPS.map((step) => (
              <option key={step.value} value={step.value}>{step.label}</option>
            ))}
          </select>
        </label>

        {filtered && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className={styles.reset}>
            Réinitialiser
          </Button>
        )}
      </form>

      <p className={styles.count} aria-live="polite">
        {results.length} {results.length > 1 ? 'actifs' : 'actif'}
        <span className={styles.ranking}>Classement : annonces mises en avant, puis les plus récentes</span>
      </p>

      {results.length > 0 ? (
        <AssetGrid assets={results} />
      ) : (
        <div className={styles.empty}>
          <p>Aucun actif ne correspond à ces critères pour le moment.</p>
          <Button variant="glass" size="sm" onClick={resetFilters}>Voir tous les actifs</Button>
        </div>
      )}
    </div>
  )
}
