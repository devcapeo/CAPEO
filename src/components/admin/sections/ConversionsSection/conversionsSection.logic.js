'use client'

import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'

export function useConversions(period, refreshKey) {
  return useAdminQuery(
    async () => {
      const [funnel, actions, clicks] = await Promise.all([
        adminApi.fetchFunnel(period),
        adminApi.fetchActions(period),
        adminApi.fetchClicks(period),
      ])
      return { funnel, actions, clicks }
    },
    [period.from, period.to, refreshKey]
  )
}
