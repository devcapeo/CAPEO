'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card/Card'
import Checkbox from '@/components/ui/Checkbox/Checkbox'
import { isOptedOut, setOptOut } from '@/lib/analytics/tracker'
import styles from './AnalyticsOptOut.module.css'

/* Opposition à la mesure d'audience, mémorisée dans ce navigateur */
export default function AnalyticsOptOut() {
  const [optedOut, setOptedOut] = useState(null)

  useEffect(() => {
    setOptedOut(isOptedOut())
  }, [])

  if (optedOut === null) return null

  return (
    <div id="mesure-audience" className={styles.wrapper}>
    <Card padding="lg" className={styles.card}>
      <p className={styles.title}>Mesure d&apos;audience</p>
      <p className={styles.text}>
        CAPEO mesure la fréquentation de son site par ses propres moyens : pages vues, temps passé, clics. Aucune adresse IP
        n&apos;est conservée et aucune donnée n&apos;est transmise à un tiers. Vous pouvez vous y opposer pour ce navigateur.
      </p>
      <Checkbox
        label="Ne pas mesurer mes visites sur ce navigateur"
        value={optedOut}
        onChange={(event) => {
          setOptOut(event.target.checked)
          setOptedOut(event.target.checked)
        }}
      />
    </Card>
    </div>
  )
}
