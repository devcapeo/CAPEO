'use client'

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '@/lib/admin/period'
import styles from './TrendChart.module.css'

export const CHART_COLORS = ['#C9A84C', '#4F7FD1', '#4FB38A', '#E1C778', '#E06C6C', '#9B7FD9']

const axisStyle = { fontSize: 11, fill: 'rgba(243, 240, 231, 0.45)' }

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className={styles.tooltipRow}>
          <span className={styles.dot} style={{ background: item.color }} />
          {item.name} : <strong>{formatNumber(item.value)}</strong>
        </p>
      ))}
    </div>
  )
}

/*
 * Graphique temporel. series : [{ key, label }] ; data : [{ label, [key]: nombre }].
 * type : 'area' (courbes) ou 'bar' (barres).
 */
export default function TrendChart({ data, series, type = 'area', height = 260 }) {
  const Chart = type === 'bar' ? BarChart : AreaChart
  return (
    <div className={styles.wrapper} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            {series.map((serie, index) => (
              <linearGradient key={serie.key} id={`fill-${serie.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[index]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_COLORS[index]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" tick={axisStyle} tickLine={false} axisLine={false} minTickGap={12} />
          <YAxis allowDecimals={false} tick={axisStyle} tickLine={false} axisLine={false} width={48} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)', stroke: 'rgba(201,168,76,0.4)' }} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(243,240,231,0.66)' }} iconType="circle" iconSize={8} />}
          {series.map((serie, index) =>
            type === 'bar' ? (
              <Bar key={serie.key} dataKey={serie.key} name={serie.label} fill={CHART_COLORS[index]} radius={[4, 4, 0, 0]} maxBarSize={28} />
            ) : (
              <Area
                key={serie.key}
                type="monotone"
                dataKey={serie.key}
                name={serie.label}
                stroke={CHART_COLORS[index]}
                strokeWidth={2}
                fill={`url(#fill-${serie.key})`}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
