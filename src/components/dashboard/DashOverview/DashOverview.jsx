/* ============================================
   CAPEO — DASH OVERVIEW
   Vue d'ensemble du dashboard.
   Light mode. KPIs + actions rapides.
   ============================================ */

import { Link } from 'react-router-dom'
import './DashOverview.css'

export default function DashOverview({ user, onNav }) {
  const kpis = [
    {
      label: 'Annonces actives',
      value: user.stats.annonces,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" rx="2"
            stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 8h10M5 11h6"
            stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round"/>
        </svg>
      ),
      action: () => onNav('annonces'),
      color: 'blue',
    },
    {
      label: 'Rooms actives',
      value: user.stats.rooms,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="5" width="16" height="12" rx="1"
            stroke="currentColor" strokeWidth="1.2"/>
          <path d="M6 5V4a4 4 0 018 0v1"
            stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round"/>
          <circle cx="10" cy="12" r="2"
            stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      action: () => onNav('rooms'),
      color: 'gold',
    },
    {
      label: 'Deals conclus',
      value: user.stats.deals,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8"
            stroke="currentColor" strokeWidth="1.2"/>
          <path d="M6 10l3 3 5-5"
            stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      action: () => onNav('deals'),
      color: 'green',
    },
    {
      label: 'Contacts reçus',
      value: user.stats.contacts,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="8" cy="7" r="3"
            stroke="currentColor" strokeWidth="1.2"/>
          <path d="M3 18c0-4 2-6 5-6"
            stroke="currentColor" strokeWidth="1.2"
            strokeLinecap="round"/>
          <circle cx="15" cy="13" r="3"
            stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      action: () => onNav('carnet'),
      color: 'purple',
    },
  ]

  const actions = [
    {
      label: 'Publier un actif',
      desc: 'Créer une nouvelle annonce',
      href: '/proposer-un-actif',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3v12M3 9h12"
            stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'Explorer les actifs',
      desc: 'Voir toutes les annonces',
      href: '/actifs',
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5"
            stroke="currentColor" strokeWidth="1.4"/>
          <path d="M13 13l3 3"
            stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'Mes rooms',
      desc: 'Accéder à mes Business Rooms',
      onClick: () => onNav('rooms'),
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="4" width="14" height="11" rx="1"
            stroke="currentColor" strokeWidth="1.4"/>
          <path d="M6 4V3a4 4 0 016 0v1"
            stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'Profil patrimoine',
      desc: 'Visualiser mon patrimoine',
      onClick: () => onNav('patrimoine'),
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7"
            stroke="currentColor" strokeWidth="1.4"/>
          <path d="M9 5v4l3 3"
            stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="dash-overview">

      {/* ── EN-TÊTE ── */}
      <div className="dash-overview__header">
        <div>
          <h1 className="dash-overview__title">
            Bonjour, {user.name.split(' ')[0]}
          </h1>
          <p className="dash-overview__sub">
            Voici un résumé de votre activité.
          </p>
        </div>
        {user.isPremium && (
          <div className="dash-overview__premium">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1l1.2 3.6H11L8.2 6.8l1.2 3.6L6 8.5l-3.4 1.9 1.2-3.6L1 4.6h3.8z"
                stroke="currentColor" strokeWidth="0.8"
                strokeLinejoin="round"/>
            </svg>
            CAPEO+ actif
          </div>
        )}
      </div>

      {/* ── KPIs ── */}
      <div className="dash-kpis">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`dash-kpi dash-kpi--${kpi.color}`}
            onClick={kpi.action}
          >
            <div className="dash-kpi__icon">{kpi.icon}</div>
            <div className="dash-kpi__value">{kpi.value}</div>
            <div className="dash-kpi__label">{kpi.label}</div>
            <div className="dash-kpi__arrow">→</div>
          </div>
        ))}
      </div>

      {/* ── SCORE CONFIANCE ── */}
      <div className="dash-trust">
        <div className="dash-trust__header">
          <div className="dash-trust__title">Profil de confiance</div>
          <div className="dash-trust__score">{user.score}/100</div>
        </div>
        <div className="dash-trust__bar">
          <div
            className="dash-trust__fill"
            style={{ width: `${user.score}%` }}
          ></div>
        </div>
        <div className="dash-trust__items">
          {[
            { label: 'Identité vérifiée', done: true },
            { label: 'Profil complété', done: true },
            { label: 'Premier deal conclu', done: user.stats.deals > 0 },
            { label: 'Membre depuis 6 mois', done: false },
          ].map((item, i) => (
            <div key={i} className="dash-trust__item">
              <div className={`dash-trust__item-dot ${item.done ? 'dash-trust__item-dot--done' : ''}`}></div>
              <span className={item.done ? 'dash-trust__item-done' : ''}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACTIONS RAPIDES ── */}
      <div className="dash-actions">
        <div className="dash-actions__title">Actions rapides</div>
        <div className="dash-actions__grid">
          {actions.map((action, i) => (
            action.href ? (
              <Link
                key={i}
                to={action.href}
                className="dash-action"
              >
                <div className="dash-action__icon">{action.icon}</div>
                <div className="dash-action__content">
                  <div className="dash-action__label">{action.label}</div>
                  <div className="dash-action__desc">{action.desc}</div>
                </div>
                <div className="dash-action__arrow">→</div>
              </Link>
            ) : (
              <button
                key={i}
                className="dash-action"
                onClick={action.onClick}
              >
                <div className="dash-action__icon">{action.icon}</div>
                <div className="dash-action__content">
                  <div className="dash-action__label">{action.label}</div>
                  <div className="dash-action__desc">{action.desc}</div>
                </div>
                <div className="dash-action__arrow">→</div>
              </button>
            )
          ))}
        </div>
      </div>

    </div>
  )
}
