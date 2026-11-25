'use client'

import { useMemo, useState } from 'react'

const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/* Tri, recherche plein texte et pagination progressive d'un tableau */
export function useDataTable(rows, columns, { initialSort, pageSize = 50 } = {}) {
  const [sort, setSort] = useState(initialSort ?? null)
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(pageSize)

  const filtered = useMemo(() => {
    const needle = normalize(query.trim())
    if (!needle) return rows
    return rows.filter((row) => columns.some((column) => normalize(column.searchValue ? column.searchValue(row) : row[column.key]).includes(needle)))
  }, [rows, columns, query])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const column = columns.find((item) => item.key === sort.key)
    const valueOf = column?.sortValue ?? ((row) => row[sort.key])
    return [...filtered].sort((a, b) => {
      const x = valueOf(a)
      const y = valueOf(b)
      if (x === y) return 0
      if (x === null || x === undefined) return 1
      if (y === null || y === undefined) return -1
      const result = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'fr')
      return sort.dir === 'asc' ? result : -result
    })
  }, [filtered, columns, sort])

  const toggleSort = (key) =>
    setSort((previous) => (previous?.key === key ? { key, dir: previous.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }))

  return {
    sort,
    toggleSort,
    query,
    setQuery: (value) => {
      setQuery(value)
      setLimit(pageSize)
    },
    visible: sorted.slice(0, limit),
    total: sorted.length,
    all: sorted,
    showMore: () => setLimit((value) => value + pageSize),
  }
}
