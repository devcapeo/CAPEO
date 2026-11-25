/* ============================================
   CAPEO — MESURE D'AUDIENCE (navigateur)
   First-party, sans adresse IP ni service tiers :
   - identifiant de visiteur aléatoire, renouvelé tous les 13 mois ;
   - session = 30 minutes d'inactivité ;
   - pages vues, temps passé (onglet visible), défilement, clics, actions clés ;
   - jamais le contenu d'un champ de saisie.
   Opposition : réglage sur la page Confidentialité, ou signal GPC du navigateur.
   Les visites de l'équipe CAPEO (admins) ne sont pas comptées.
   ============================================ */

import { getBrowserClient } from '@/lib/supabase/browserClient'

const ENDPOINT = '/api/admin?action=collect'
const KEYS = { visitor: 'capeo_vid', session: 'capeo_sid', optOut: 'capeo_no_track', staff: 'capeo_staff' }
const VISITOR_TTL = 395 * 24 * 3600 * 1000
const SESSION_TTL = 30 * 60 * 1000
const FLUSH_DELAY = 4000
const MAX_BATCH = 25
const TRACKED_HOSTS = ['capeo.org', 'www.capeo.org']

let queue = []
let flushTimer = null
let accessToken = null
let excluded = false
let initialized = false
let isNewVisitor = false
const leaveHooks = new Set()

const storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return null
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* stockage indisponible : la mesure continue sans persistance */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* rien à faire */
    }
  },
}

const uuid = () =>
  crypto.randomUUID?.() ??
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })

function visitorId() {
  const now = Date.now()
  const stored = storage.get(KEYS.visitor)
  if (stored?.id && now - stored.createdAt < VISITOR_TTL) return stored.id
  const id = uuid()
  storage.set(KEYS.visitor, { id, createdAt: now })
  isNewVisitor = true
  return id
}

/* Renvoie { id, isNew } ; une session expire après 30 minutes sans activité */
function touchSession() {
  const now = Date.now()
  const stored = storage.get(KEYS.session)
  if (stored?.id && now - stored.lastAt < SESSION_TTL) {
    storage.set(KEYS.session, { id: stored.id, lastAt: now })
    return { id: stored.id, isNew: false }
  }
  const id = uuid()
  storage.set(KEYS.session, { id, lastAt: now })
  return { id, isNew: true }
}

export function isOptedOut() {
  return storage.get(KEYS.optOut) === true
}

export function setOptOut(value) {
  if (value) {
    storage.set(KEYS.optOut, true)
    queue = []
  } else {
    storage.remove(KEYS.optOut)
  }
}

function trackingAllowed() {
  if (typeof window === 'undefined' || excluded) return false
  if (!TRACKED_HOSTS.includes(window.location.hostname) && !window.__CAPEO_TRACK_ANY_HOST__) return false
  if (navigator.globalPrivacyControl === true) return false
  if (isOptedOut() || storage.get(KEYS.staff) === true) return false
  return true
}

/* Les membres de l'équipe ne sont pas comptés, y compris lors de leurs visites déconnectées */
export function markStaff() {
  excluded = true
  queue = []
  storage.set(KEYS.staff, true)
}

export function assetSlugFromPath(path) {
  const match = path.match(/^\/(?:actifs|business-room)\/([^/]+)$/)
  return match && match[1] !== 'famille' ? decodeURIComponent(match[1]) : null
}

function enqueue(event) {
  if (!trackingAllowed()) return
  queue.push({ ...event, ts: Date.now() })
  if (queue.length >= MAX_BATCH) flush()
  else if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_DELAY)
}

export function flush(useBeacon = false) {
  clearTimeout(flushTimer)
  flushTimer = null
  if (!queue.length || !trackingAllowed()) return

  const session = touchSession()
  const payload = JSON.stringify({
    v: visitorId(),
    s: session.id,
    n: isNewVisitor,
    vw: window.innerWidth,
    t: accessToken,
    now: Date.now(),
    events: queue.splice(0, MAX_BATCH),
  })
  isNewVisitor = false

  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }))
  } else {
    fetch(ENDPOINT, { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => null)
  }
  if (queue.length) flushTimer = setTimeout(flush, FLUSH_DELAY)
}

/* ---------- API publique ---------- */

export function trackPageView(path) {
  const session = touchSession()
  const event = { e: 'page_view', p: path, a: assetSlugFromPath(path) }

  if (session.isNew) {
    const params = new URLSearchParams(window.location.search)
    const utm = ['utm_source', 'utm_medium', 'utm_campaign'].reduce((acc, key) => {
      if (params.get(key)) acc[key] = params.get(key).slice(0, 100)
      return acc
    }, {})
    let referrer = null
    try {
      const host = document.referrer ? new URL(document.referrer).hostname : null
      referrer = host && !TRACKED_HOSTS.includes(host) && host !== window.location.hostname ? host : null
    } catch {
      referrer = null
    }
    Object.assign(event, { r: referrer, utm })
  }
  enqueue(event)
}

export function trackPageLeave(path, durationMs, scrollPct) {
  if (durationMs < 500) return
  enqueue({ e: 'page_leave', p: path, a: assetSlugFromPath(path), d: Math.round(durationMs), sc: scrollPct })
}

export function trackClick(path, label, target) {
  enqueue({ e: 'click', p: path, a: assetSlugFromPath(path), l: label, tg: target })
}

/* Action clé (inscription, vérification, dépôt d'annonce, Business Room…) */
export function trackAction(name, details = {}) {
  if (typeof window === 'undefined') return
  const path = window.location.pathname
  enqueue({ e: name, p: path, a: details.asset ?? assetSlugFromPath(path), l: details.label, tg: details.target, x: details.props })
}

/* Appelé juste avant l'envoi final (onglet masqué ou fermé) : permet d'enregistrer le temps passé */
export function beforeLeave(hook) {
  leaveHooks.add(hook)
  return () => leaveHooks.delete(hook)
}

/* Branche la session Supabase (le serveur vérifie le jeton pour rattacher les visites au membre) */
export function initTracker() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  const supabase = getBrowserClient()
  supabase.auth.getSession().then(({ data }) => {
    accessToken = data.session?.access_token ?? null
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    accessToken = session?.access_token ?? null
  })

  const leave = () => {
    leaveHooks.forEach((hook) => hook())
    flush(true)
  }
  window.addEventListener('pagehide', leave)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') leave()
  })
}
