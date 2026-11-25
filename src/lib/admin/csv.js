/* ============================================
   CAPEO ADMIN — EXPORT CSV (compatible Excel : séparateur « ; », BOM UTF-8)
   ============================================ */

const escapeCell = (value) => {
  if (value === null || value === undefined) return ''
  const text = String(value)
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(columns, rows) {
  const header = columns.map((column) => escapeCell(column.label)).join(';')
  const lines = rows.map((row) =>
    columns.map((column) => escapeCell(column.csv ? column.csv(row) : row[column.key])).join(';')
  )
  return [header, ...lines].join('\r\n')
}

export function downloadCsv(filename, columns, rows) {
  const blob = new Blob(['﻿', toCsv(columns, rows)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
