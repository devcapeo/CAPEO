/* ============================================
   CAPEO — PAGE DASHBOARD
   Espace personnel utilisateur.
   Navigation par sections via URL params.
   Sections : overview, annonces, rooms,
   deals, patrimoine, carnet, compte.
   ============================================ */

   import { useState, useEffect } from 'react'
   import { useParams, useNavigate } from 'react-router-dom'
   import DashboardNav from '../../components/dashboard/DashboardNav/DashboardNav.jsx'
   import MesAnnonces from '../../components/dashboard/MesAnnonces/MesAnnonces.jsx'
   import MesRooms from '../../components/dashboard/MesRooms/MesRooms.jsx'
   import MesDeals from '../../components/dashboard/MesDeals/MesDeals.jsx'
   import ProfilPatrimoine from '../../components/dashboard/ProfilPatrimoine/ProfilPatrimoine.jsx'
   import CarnetCoAcquereurs from '../../components/dashboard/CarnetCoAcquereurs/CarnetCoAcquereurs.jsx'
   import MonCompte from '../../components/dashboard/MonCompte/MonCompte.jsx'
   import './Dashboard.css'
   
   // Mock user
   const USER_MOCK = {
     name: 'Laurent V.',
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
   
   const SECTIONS = [
     { id: 'overview',   label: 'Vue d\'ensemble' },
     { id: 'annonces',   label: 'Mes annonces' },
     { id: 'rooms',      label: 'Mes rooms' },
     { id: 'deals',      label: 'Mes deals' },
     { id: 'patrimoine', label: 'Profil patrimoine' },
     { id: 'carnet',     label: 'Co-acquéreurs' },
     { id: 'compte',     label: 'Mon compte' },
   ]
   
   export default function Dashboard() {
     const { section } = useParams()
     const navigate = useNavigate()
     const [active, setActive] = useState(section || 'overview')
     const user = USER_MOCK
   
     useEffect(() => {
       if (section) setActive(section)
     }, [section])
   
     const handleNav = (id) => {
       setActive(id)
       navigate(`/dashboard/${id}`)
     }
   
     return (
       <div className="dashboard-page">
   
         {/* ── SIDEBAR ── */}
         <aside className="dashboard-page__sidebar">
           <DashboardNav
             user={user}
             sections={SECTIONS}
             active={active}
             onNav={handleNav}
           />
         </aside>
   
         {/* ── CONTENU ── */}
         <main className="dashboard-page__main">
   
           {active === 'overview' && (
             <DashboardOverview user={user} onNav={handleNav} />
           )}
           {active === 'annonces'   && <MesAnnonces />}
           {active === 'rooms'      && <MesRooms />}
           {active === 'deals'      && <MesDeals />}
           {active === 'patrimoine' && <ProfilPatrimoine />}
           {active === 'carnet'     && <CarnetCoAcquereurs />}
           {active === 'compte'     && <MonCompte user={user} />}
   
         </main>
   
       </div>
     )
   }
   
   /* ── VUE D'ENSEMBLE ── */
   function DashboardOverview({ user, onNav }) {
     return (
       <div className="dash-overview">
   
         {/* Header */}
         <div className="dash-overview__header">
           <div>
             <div className="section-label">Dashboard</div>
             <h1 className="dash-overview__title">
               Bonjour, {user.name.split(' ')[0]}
             </h1>
             <p className="dash-overview__sub">
               Voici un résumé de votre activité sur CAPEO.
             </p>
           </div>
           {user.isPremium && (
             <div className="dash-overview__premium-badge">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <path d="M7 1l1.5 4H13L9.5 7.5l1.5 4.5L7 9.5 3 12l1.5-4.5L1 5h4.5z"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinejoin="round"/>
               </svg>
               Premium
             </div>
           )}
         </div>
   
         {/* KPIs */}
         <div className="dash-kpis">
           <div className="dash-kpi" onClick={() => onNav('annonces')}>
             <div className="dash-kpi__value">{user.stats.annonces}</div>
             <div className="dash-kpi__label">Annonces actives</div>
             <div className="dash-kpi__arrow">→</div>
           </div>
           <div className="dash-kpi" onClick={() => onNav('rooms')}>
             <div className="dash-kpi__value">{user.stats.rooms}</div>
             <div className="dash-kpi__label">Rooms actives</div>
             <div className="dash-kpi__arrow">→</div>
           </div>
           <div className="dash-kpi" onClick={() => onNav('deals')}>
             <div className="dash-kpi__value">{user.stats.deals}</div>
             <div className="dash-kpi__label">Deals conclus</div>
             <div className="dash-kpi__arrow">→</div>
           </div>
           <div className="dash-kpi">
             <div className="dash-kpi__value">{user.stats.contacts}</div>
             <div className="dash-kpi__label">Contacts reçus</div>
             <div className="dash-kpi__arrow">→</div>
           </div>
         </div>
   
         {/* Score crédibilité */}
         <div className="dash-score">
           <div className="dash-score__header">
             <div className="dash-score__title">Score de crédibilité</div>
             <div className="dash-score__value">{user.score}/100</div>
           </div>
           <div className="dash-score__bar">
             <div
               className="dash-score__fill"
               style={{ width: `${user.score}%` }}
             ></div>
           </div>
           <div className="dash-score__desc">
             Basé sur votre historique de rooms, vos deals conclus
             et la complétude de votre profil.
           </div>
         </div>
   
         {/* Actions rapides */}
         <div className="dash-quick">
           <div className="dash-quick__title">Actions rapides</div>
           <div className="dash-quick__grid">
             <button
               className="dash-quick__btn"
               onClick={() => onNav('annonces')}
             >
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                 <rect x="2" y="2" width="12" height="12" rx="1"
                   stroke="currentColor" strokeWidth="1"/>
                 <path d="M8 5v6M5 8h6"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinecap="round"/>
               </svg>
               Publier un actif
             </button>
             <button
               className="dash-quick__btn"
               onClick={() => onNav('rooms')}
             >
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                 <rect x="2" y="4" width="12" height="9" rx="1"
                   stroke="currentColor" strokeWidth="1"/>
                 <path d="M5 4V3a3 3 0 016 0v1"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinecap="round"/>
               </svg>
               Voir mes rooms
             </button>
             <button
               className="dash-quick__btn"
               onClick={() => onNav('patrimoine')}
             >
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                 <circle cx="8" cy="8" r="6"
                   stroke="currentColor" strokeWidth="1"/>
                 <path d="M8 4v4l3 3"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinecap="round"/>
               </svg>
               Profil patrimoine
             </button>
             <button
               className="dash-quick__btn"
               onClick={() => onNav('carnet')}
             >
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                 <circle cx="6" cy="5" r="3"
                   stroke="currentColor" strokeWidth="1"/>
                 <path d="M1 14c0-3 2-5 5-5"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinecap="round"/>
                 <circle cx="12" cy="10" r="3"
                   stroke="currentColor" strokeWidth="1"/>
               </svg>
               Co-acquéreurs
             </button>
           </div>
         </div>
   
       </div>
     )
   }