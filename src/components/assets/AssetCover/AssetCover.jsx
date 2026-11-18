import { cx } from '@/lib/cx'
import { buildCover, COVER_HEIGHT, COVER_WIDTH } from './assetCover.logic'
import styles from './AssetCover.module.css'

/**
 * Visuel génératif d'une annonce (SVG, aucune image externe).
 * Décoratif : le titre de l'annonce est porté par le texte qui l'accompagne.
 */
export default function AssetCover({ seed, type, label, className }) {
  const cover = buildCover(seed, type)

  return (
    <div className={cx(styles.cover, className)}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${COVER_WIDTH} ${COVER_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={cover.gradientId} cx={cover.glow.cx} cy={cover.glow.cy} r={cover.glow.r} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1B3A6B" stopOpacity="0.85" />
            <stop offset="1" stopColor="#070B18" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={COVER_WIDTH} height={COVER_HEIGHT} fill="#0A1022" />
        <rect width={COVER_WIDTH} height={COVER_HEIGHT} fill={`url(#${cover.gradientId})`} />
        {cover.dots.map((dot, index) => (
          <circle key={index} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#C9A84C" opacity={dot.opacity} />
        ))}
        <path d={cover.arc} fill="none" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
        <g transform={`translate(${COVER_WIDTH / 2 - 55} ${COVER_HEIGHT / 2 - 58}) scale(1.1)`}>
          <path d={cover.icon} fill="none" stroke="#E1C778" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        </g>
      </svg>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}
