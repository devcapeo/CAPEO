/* ============================================
   CAPEO — DASHBOARD V2
   Light mode. Responsive desktop + mobile.
   Sidebar fixe desktop / bottom nav mobile.
   ============================================ */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './Dashboard.css'

// Composants sections
import DashOverview from '../../components/dashboard/DashOverview/DashOverview.jsx'
import MesAnnonces from '../../components/dashboard/MesAnnonces/MesAnnonces.jsx'
import MesRooms from '../../components/dashboard/MesRooms/MesRooms.jsx'
import MesDeals from '../../components/dashboard/MesDeals/MesDeals.jsx'
import ProfilPatrimoine from '../../components/dashboard/ProfilPatrimoine/ProfilPatrimoine.jsx'
import CarnetCoAcquereurs from '../../components/dashboard/CarnetCoAcquereurs/CarnetCoAcquereurs.jsx'
import MonCompte from '../../components/dashboard/MonCompte/MonCompte.jsx'

const USER = {
  name: 'Laurent V.',
  initials: 'L',
  email: 'laurent@capeo.fr',
  role: 'both',
  isPremium: true,
  memberSince: '2024',
  score: 87,
  stats: {
    annonces: 2,
    rooms: 5,
    deals: 1,
    contacts: 14,
  },
}

const NAV = [
  {
    id: 'overview',
    label: 'Vue d\'ensemble',
    short: 'Accueil',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
        <rect x="10" y="2" width="6" height="6" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
        <rect x="2" y="10" width="6" height="6" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
        <rect x="10" y="10" width="6" height="6" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'annonces',
    label: 'Mes annonces',
    short: 'Annonces',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 7h8M5 10h5"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'rooms',
    label: 'Mes rooms',
    short: 'Rooms',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="11" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6 4V3a3 3 0 016 0v1"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"/>
        <circle cx="9" cy="10" r="2"
          stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'deals',
    label: 'Mes deals',
    short: 'Deals',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6 9l2 2 4-4"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'patrimoine',
    label: 'Patrimoine',
    short: 'Patrimoine',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M9 5v4l3 3"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'carnet',
    label: 'Co-acquéreurs',
    short: 'Réseau',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="7" cy="6" r="3"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2 16c0-3 2-5 5-5"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"/>
        <circle cx="13" cy="11" r="3"
          stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'compte',
    label: 'Mon compte',
    short: 'Compte',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M3 16c0-4 2.7-6 6-6s6 2 6 6"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Dashboard() {
  const { section } = useParams()
  const navigate = useNavigate()
  const [active, setActive] = useState(section || 'overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (section) setActive(section)
  }, [section])

  const handleNav = (id) => {
    setActive(id)
    navigate(`/dashboard/${id}`)
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }

  const renderSection = () => {
    switch (active) {
      case 'overview':   return <DashOverview user={USER} onNav={handleNav} />
      case 'annonces':   return <MesAnnonces />
      case 'rooms':      return <MesRooms />
      case 'deals':      return <MesDeals />
      case 'patrimoine': return <ProfilPatrimoine />
      case 'carnet':     return <CarnetCoAcquereurs />
      case 'compte':     return <MonCompte user={USER} />
      default:           return <DashOverview user={USER} onNav={handleNav} />
    }
  }

  return (
    <div className="dash-root">

      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar__inner">

          {/* Profil */}
          <div className="dash-sidebar__profile">
            <div className="dash-sidebar__avatar">
              {USER.initials}
            </div>
            <div className="dash-sidebar__profile-info">
              <div className="dash-sidebar__name">{USER.name}</div>
              <div className="dash-sidebar__badge">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M4.5 1l.9 2.7H8L5.8 5.4l.9 2.7L4.5 6.8 2.3 8.1l.9-2.7L1 3.7h2.6z"
                    stroke="currentColor" strokeWidth="0.7"
                    strokeLinejoin="round"/>
                </svg>
                CAPEO+
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="dash-sidebar__nav">
            {NAV.map((item) => (
              <button
                key={item.id}
                className={`dash-nav-item ${active === item.id ? 'dash-nav-item--active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="dash-nav-item__icon">{item.icon}</span>
                <span className="dash-nav-item__label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer sidebar */}
          <div className="dash-sidebar__footer">
            <div className="dash-sidebar__member">
              Membre depuis {USER.memberSince}
            </div>
          </div>

        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="dash-main">

        {/* Header mobile */}
        <div className="dash-topbar">
          <div className="dash-topbar__left">
            <div className="dash-topbar__logo">
              CAP<span>E</span>O
            </div>
          </div>
          <div className="dash-topbar__center">
            {NAV.find(n => n.id === active)?.label}
          </div>
          <div className="dash-topbar__right">
            <div className="dash-topbar__avatar">
              {USER.initials}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="dash-content">
          {renderSection()}
        </div>

      </main>

      {/* ── BOTTOM NAV MOBILE ── */}
      <nav className="dash-bottom-nav">
        {NAV.slice(0, 5).map((item) => (
          <button
            key={item.id}
            className={`dash-bottom-nav__item ${active === item.id ? 'dash-bottom-nav__item--active' : ''}`}
            onClick={() => handleNav(item.id)}
          >
            <span className="dash-bottom-nav__icon">{item.icon}</span>
            <span className="dash-bottom-nav__label">{item.short}</span>
          </button>
        ))}
        <button
          className={`dash-bottom-nav__item ${['carnet','compte'].includes(active) ? 'dash-bottom-nav__item--active' : ''}`}
          onClick={() => handleNav('compte')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="6" r="3"
              stroke="currentColor" strokeWidth="1.2"/>
            <path d="M3 16c0-4 2.7-6 6-6s6 2 6 6"
              stroke="currentColor" strokeWidth="1.2"
              strokeLinecap="round"/>
          </svg>
          <span className="dash-bottom-nav__label">Compte</span>
        </button>
      </nav>

    </div>
  )
}
