/* ============================================
   CAPEO — Réception des événements de mesure d'audience.
   Validation stricte, aucune adresse IP conservée : seuls le pays, la région et la ville
   déduits par l'hébergeur (en-têtes Vercel) sont enregistrés. Robots ignorés.
   Serveur uniquement.
   ============================================ */

import 'server-only'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const EVENT_NAME = /^[a-z][a-z0-9_]{1,39}$/
const BOTS = /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|facebookexternalhit|embedly|preview|monitor|pingdom|curl|wget|python-requests|axios/i
const MAX_BODY = 48 * 1024
const MAX_EVENTS = 40
const MAX_CLOCK_SKEW = 10 * 60 * 1000

const text = (value, max) => {
  if (typeof value !== 'string') return null
  const cleaned = value.replace(/[\u0000-\u001f]/g, ' ').trim()
  return cleaned ? cleaned.slice(0, max) : null
}

const header = (request, name) => {
  const value = request.headers.get(name)
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/* Navigateur, système et type d'appareil depuis l'agent utilisateur (sans empreinte) */
export function parseUserAgent(ua = '', viewport = 0) {
  const browser =
    (/Edg\//.test(ua) && 'Edge') ||
    (/OPR\/|Opera/.test(ua) && 'Opera') ||
    (/SamsungBrowser/.test(ua) && 'Samsung Internet') ||
    (/Firefox\/|FxiOS/.test(ua) && 'Firefox') ||
    (/CriOS|Chrome\//.test(ua) && 'Chrome') ||
    (/Safari\//.test(ua) && 'Safari') ||
    'Autre'

  const os =
    (/iPad/.test(ua) && 'iPadOS') ||
    (/iPhone|iPod/.test(ua) && 'iOS') ||
    (/Android/.test(ua) && 'Android') ||
    (/Windows/.test(ua) && 'Windows') ||
    (/CrOS/.test(ua) && 'ChromeOS') ||
    (/Mac OS X|Macintosh/.test(ua) && 'macOS') ||
    (/Linux/.test(ua) && 'Linux') ||
    'Autre'

  const tablet = /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))
  const mobile = /Mobi|iPhone|iPod/.test(ua)
  const device = tablet ? 'tablet' : mobile ? 'mobile' : viewport && viewport < 768 ? 'mobile' : 'desktop'

  return { browser, os, device }
}

export const isBot = (ua) => !ua || BOTS.test(ua)

/* Lit et valide le lot envoyé par le navigateur ; renvoie null s'il est inexploitable */
export async function readBatch(request) {
  const raw = await request.text().catch(() => '')
  if (!raw || raw.length > MAX_BODY) return null
  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return null
  }
  if (!UUID.test(body?.v ?? '') || !UUID.test(body?.s ?? '') || !Array.isArray(body.events)) return null
  return body
}

/* Transforme le lot en lignes de la table analytics_events */
export function toRows(request, body, userId) {
  const ua = request.headers.get('user-agent') ?? ''
  const viewport = Number.isFinite(body.vw) ? Math.max(0, Math.min(10000, Math.round(body.vw))) : null
  const { browser, os, device } = parseUserAgent(ua, viewport)
  const geo = {
    country: text(header(request, 'x-vercel-ip-country'), 2),
    region: text(header(request, 'x-vercel-ip-country-region'), 80),
    city: text(header(request, 'x-vercel-ip-city'), 80),
  }

  const serverNow = Date.now()
  const clientNow = Number.isFinite(body.now) ? body.now : serverNow

  return body.events
    .slice(0, MAX_EVENTS)
    .filter((event) => EVENT_NAME.test(event?.e ?? '') && typeof event.p === 'string' && event.p.startsWith('/'))
    .map((event, index) => {
      const age = Number.isFinite(event.ts) ? Math.min(Math.max(clientNow - event.ts, 0), MAX_CLOCK_SKEW) : 0
      const utm = event.utm && typeof event.utm === 'object' ? event.utm : {}
      const isObject = event.x && typeof event.x === 'object' && !Array.isArray(event.x)
      const props = isObject && JSON.stringify(event.x).length <= 2000 ? event.x : null
      return {
        created_at: new Date(serverNow - age + index).toISOString(),
        visitor_id: body.v,
        session_id: body.s,
        user_id: userId,
        event: event.e,
        path: text(event.p.split('?')[0], 300),
        label: text(event.l, 120),
        target: text(event.tg, 300),
        asset_slug: text(event.a, 160),
        referrer_host: text(event.r, 200),
        utm_source: text(utm.utm_source, 100),
        utm_medium: text(utm.utm_medium, 100),
        utm_campaign: text(utm.utm_campaign, 100),
        device,
        browser,
        os,
        ...geo,
        viewport_w: viewport,
        duration_ms: Number.isFinite(event.d) ? Math.max(0, Math.min(86400000, Math.round(event.d))) : null,
        scroll_pct: Number.isFinite(event.sc) ? Math.max(0, Math.min(100, Math.round(event.sc))) : null,
        is_new_visitor: body.n === true && index === 0,
        props,
      }
    })
}
