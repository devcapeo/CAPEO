import { formatNumber } from '@/lib/admin/period'
import styles from './Heatmap.module.css'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

/* Pages vues par jour de la semaine et par heure (heure de Paris) */
export default function Heatmap({ cells }) {
  const grid = new Map((cells ?? []).map((cell) => [`${cell.dow}-${cell.hour}`, Number(cell.pageviews)]))
  const max = Math.max(1, ...grid.values())

  return (
    <div className={styles.scroller}>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th />
            {HOURS.map((hour) => (
              <th key={hour} scope="col">{hour % 3 === 0 ? `${hour}h` : ''}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map((day, index) => (
            <tr key={day}>
              <th scope="row">{day}</th>
              {HOURS.map((hour) => {
                const value = grid.get(`${index + 1}-${hour}`) ?? 0
                return (
                  <td key={hour} title={`${day} ${hour}h : ${formatNumber(value)} pages vues`}>
                    <span className={styles.cell} style={{ opacity: value ? 0.15 + (value / max) * 0.85 : 0.05 }} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
