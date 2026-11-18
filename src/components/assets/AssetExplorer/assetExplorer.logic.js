'use client'

import { useCallback, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { applyFilters, hasActiveFilters, parseFilters, toQueryString } from '@/lib/assets/filters'

/**
 * Filtres de la liste d'actifs, synchronisés avec l'URL (?type=…&region=…&budget=…) :
 * une recherche filtrée se partage par simple lien. La page reste statique ;
 * le filtrage se fait côté client sur le catalogue déjà rendu.
 */
export function useAssetFilters(assets) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const results = useMemo(() => applyFilters(assets, filters), [assets, filters])

  const setFilter = useCallback(
    (key, value) => {
      router.replace(`${pathname}${toQueryString({ ...filters, [key]: value })}`, { scroll: false })
    },
    [router, pathname, filters]
  )

  const resetFilters = useCallback(() => router.replace(pathname, { scroll: false }), [router, pathname])

  return { filters, results, setFilter, resetFilters, filtered: hasActiveFilters(filters) }
}
