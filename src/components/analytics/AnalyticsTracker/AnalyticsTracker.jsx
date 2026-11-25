'use client'

import { useAnalyticsTracker } from './analyticsTracker.logic'

/* Mesure d'audience first-party : n'affiche rien */
export default function AnalyticsTracker() {
  useAnalyticsTracker()
  return null
}
