'use client'

import { cx } from '@/lib/cx'
import { downloadCsv } from '@/lib/admin/csv'
import { formatNumber } from '@/lib/admin/period'
import { useDataTable } from './dataTable.logic'
import styles from './DataTable.module.css'

/*
 * Tableau triable, filtrable et exportable.
 * columns : [{ key, label, render?, sortValue?, searchValue?, csv?, align?, sortable? }]
 */
export default function DataTable({
  columns,
  rows,
  rowKey,
  onRowClick,
  exportName,
  searchPlaceholder = 'Rechercher…',
  searchable = true,
  initialSort,
  empty = 'Aucune donnée sur la période.',
  pageSize = 50,
  toolbar,
}) {
  const table = useDataTable(rows ?? [], columns, { initialSort, pageSize })

  return (
    <div className={styles.wrapper}>
      {(searchable || exportName || toolbar) && (
        <div className={styles.toolbar}>
          {searchable && (
            <input
              type="search"
              className={styles.search}
              placeholder={searchPlaceholder}
              value={table.query}
              onChange={(event) => table.setQuery(event.target.value)}
              aria-label={searchPlaceholder}
            />
          )}
          {toolbar}
          <span className={styles.count}>{formatNumber(table.total)} ligne{table.total > 1 ? 's' : ''}</span>
          {exportName && (
            <button type="button" className={styles.export} onClick={() => downloadCsv(exportName, columns.filter((c) => c.csv !== false), table.all)}>
              Export CSV
            </button>
          )}
        </div>
      )}

      {table.total === 0 ? (
        <p className={styles.empty}>{empty}</p>
      ) : (
        <div className={styles.scroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((column) => {
                  const active = table.sort?.key === column.key
                  return (
                    <th key={column.key} className={cx(column.align === 'right' && styles.right)} scope="col">
                      {column.sortable === false ? (
                        column.label
                      ) : (
                        <button type="button" className={cx(styles.sort, active && styles.sorted)} onClick={() => table.toggleSort(column.key)}>
                          {column.label}
                          <span aria-hidden="true">{active ? (table.sort.dir === 'asc' ? '▲' : '▼') : ''}</span>
                        </button>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {table.visible.map((row, index) => (
                <tr
                  key={rowKey ? rowKey(row) : index}
                  className={cx(onRowClick && styles.clickable)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={onRowClick ? (event) => event.key === 'Enter' && onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={cx(column.align === 'right' && styles.right, column.mono && styles.mono)}>
                      {column.render ? column.render(row) : row[column.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {table.visible.length < table.total && (
        <button type="button" className={styles.more} onClick={table.showMore}>
          Afficher plus ({formatNumber(table.total - table.visible.length)} restantes)
        </button>
      )}
    </div>
  )
}
