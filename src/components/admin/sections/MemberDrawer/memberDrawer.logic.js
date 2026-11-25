'use client'

import { useMemo, useState } from 'react'
import * as adminApi from '@/lib/admin/api'
import { useAdminQuery } from '@/lib/admin/useAdminQuery'
import { formatDate } from '@/lib/admin/period'

/* Parcours du membre groupé par jour, avec synthèse de ses habitudes */
export function useMemberDetail(member, onChanged) {
  const [pending, setPending] = useState(null)
  const [actionError, setActionError] = useState(null)
  const journey = useAdminQuery(() => (member ? adminApi.fetchJourney(member.id) : Promise.resolve([])), [member?.id])

  const summary = useMemo(() => {
    const events = journey.data ?? []
    const count = (predicate) => events.filter(predicate).length
    const top = (key) => {
      const tally = {}
      events.forEach((event) => {
        if (event[key]) tally[event[key]] = (tally[event[key]] ?? 0) + 1
      })
      return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
    }
    const days = []
    events.forEach((event) => {
      const day = formatDate(event.created_at)
      if (days.at(-1)?.day !== day) days.push({ day, events: [] })
      days.at(-1).events.push(event)
    })
    return {
      pageviews: count((event) => event.event === 'page_view'),
      clicks: count((event) => event.event === 'click'),
      timeSeconds: events.filter((event) => event.event === 'page_leave').reduce((sum, event) => sum + (event.duration_ms ?? 0), 0) / 1000,
      device: top('device'),
      browser: top('browser'),
      city: top('city'),
      referrer: top('referrer_host'),
      firstSeen: events.at(-1)?.created_at ?? null,
      days,
    }
  }, [journey.data])

  const run = async (key, task) => {
    setPending(key)
    setActionError(null)
    try {
      await task()
      onChanged()
    } catch (error) {
      setActionError(error?.message ?? 'Action impossible.')
    } finally {
      setPending(null)
    }
  }

  return {
    journey,
    summary,
    pending,
    actionError,
    review: (status) => run(`review-${status}`, () => adminApi.reviewProfile(member.id, status)),
    setRole: (role) => run(`role-${role}`, () => adminApi.setRole(member.id, role)),
  }
}
