/* ============================================
   CAPEO — ADMIN DASHBOARD
   Accès restreint — toi seul.
   KPIs globaux, modération annonces,
   vérifications KYC, stats plateforme.
   ============================================ */

   import { useState } from 'react'
   import './AdminDashboard.css'
   
   const STATS = [
     { label: 'Annonces actives',    value: '24',    delta: '+3 cette semaine' },
     { label: 'Utilisateurs',        value: '187',   delta: '+12 ce mois' },
     { label: 'Rooms actives',       value: '8',     delta: '+2 aujourd\'hui' },
     { label: 'Revenu du mois',      value: '1 240€', delta: '+340€ vs mois dernier' },
     { label: 'Abonnés premium',     value: '34',    delta: '+5 ce mois' },
     { label: 'KYC en attente',      value: '3',     delta: 'À traiter' },
   ]
   
   const ANNONCES_PENDING = [
     {
       id: '1',
       title: 'Appartement T3 — Bordeaux',
       category: 'Immobilier',
       seller: 'Pierre M.',
       price: '280 000€',
       submittedAt: 'Il y a 2h',
       hasDoc: true,
     },
     {
       id: '2',
       title: 'Fonds de commerce — Boulangerie',
       category: 'Entreprise',
       seller: 'Marie K.',
       price: '95 000€',
       submittedAt: 'Il y a 5h',
       hasDoc: true,
     },
     {
       id: '3',
       title: 'Montre Rolex Daytona 2021',
       category: 'Objet rare',
       seller: 'Lucas B.',
       price: '28 000€',
       submittedAt: 'Hier',
       hasDoc: false,
     },
   ]
   
   const KYC_PENDING = [
     {
       id: '1',
       name: 'Sophie L.',
       email: 'sophie@email.com',
       docType: 'Carte d\'identité',
       submittedAt: 'Il y a 1h',
     },
     {
       id: '2',
       name: 'Thomas R.',
       email: 'thomas@email.com',
       docType: 'Passeport',
       submittedAt: 'Il y a 3h',
     },
     {
       id: '3',
       name: 'Lena M.',
       email: 'lena@email.com',
       docType: 'Titre de séjour',
       submittedAt: 'Hier',
     },
   ]
   
   export default function AdminDashboard() {
     const [activeSection, setActiveSection] = useState('overview')
     const [annonces, setAnnonces] = useState(ANNONCES_PENDING)
     const [kyc, setKyc] = useState(KYC_PENDING)
   
     const handleApproveAnnonce = (id) => {
       setAnnonces((prev) => prev.filter((a) => a.id !== id))
     }
   
     const handleRejectAnnonce = (id) => {
       setAnnonces((prev) => prev.filter((a) => a.id !== id))
     }
   
     const handleApproveKyc = (id) => {
       setKyc((prev) => prev.filter((k) => k.id !== id))
     }
   
     const handleRejectKyc = (id) => {
       setKyc((prev) => prev.filter((k) => k.id !== id))
     }
   
     return (
       <div className="admin-page">
   
         {/* ── SIDEBAR ── */}
         <aside className="admin-sidebar">
           <div className="admin-sidebar__logo">
             CAP<span>E</span>O
             <div className="admin-sidebar__badge">Admin</div>
           </div>
   
           <nav className="admin-sidebar__nav">
             {[
               { id: 'overview',   label: 'Vue d\'ensemble' },
               { id: 'annonces',   label: `Modération (${annonces.length})` },
               { id: 'kyc',        label: `KYC (${kyc.length})` },
               { id: 'users',      label: 'Utilisateurs' },
             ].map((item) => (
               <button
                 key={item.id}
                 className={`admin-sidebar__item ${activeSection === item.id ? 'admin-sidebar__item--active' : ''}`}
                 onClick={() => setActiveSection(item.id)}
               >
                 {item.label}
                 {(item.id === 'annonces' && annonces.length > 0) ||
                  (item.id === 'kyc' && kyc.length > 0) ? (
                   <div className="admin-sidebar__alert"></div>
                 ) : null}
               </button>
             ))}
           </nav>
         </aside>
   
         {/* ── MAIN ── */}
         <main className="admin-main">
   
           {/* ── OVERVIEW ── */}
           {activeSection === 'overview' && (
             <div className="admin-section">
               <div className="admin-section__header">
                 <div className="section-label">Administration</div>
                 <h1 className="admin-section__title">Vue d'ensemble</h1>
               </div>
   
               <div className="admin-kpis">
                 {STATS.map((stat) => (
                   <div key={stat.label} className="admin-kpi">
                     <div className="admin-kpi__value">{stat.value}</div>
                     <div className="admin-kpi__label">{stat.label}</div>
                     <div className="admin-kpi__delta">{stat.delta}</div>
                   </div>
                 ))}
               </div>
   
               {/* Alertes */}
               {(annonces.length > 0 || kyc.length > 0) && (
                 <div className="admin-alerts">
                   <div className="admin-alerts__title">
                     Actions requises
                   </div>
                   {annonces.length > 0 && (
                     <div
                       className="admin-alert"
                       onClick={() => setActiveSection('annonces')}
                     >
                       <div className="admin-alert__dot admin-alert__dot--gold"></div>
                       <div className="admin-alert__text">
                         <strong>{annonces.length}</strong> annonce{annonces.length > 1 ? 's' : ''} en attente de modération
                       </div>
                       <div className="admin-alert__arrow">→</div>
                     </div>
                   )}
                   {kyc.length > 0 && (
                     <div
                       className="admin-alert"
                       onClick={() => setActiveSection('kyc')}
                     >
                       <div className="admin-alert__dot admin-alert__dot--blue"></div>
                       <div className="admin-alert__text">
                         <strong>{kyc.length}</strong> vérification{kyc.length > 1 ? 's' : ''} KYC en attente
                       </div>
                       <div className="admin-alert__arrow">→</div>
                     </div>
                   )}
                 </div>
               )}
             </div>
           )}
   
           {/* ── MODÉRATION ANNONCES ── */}
           {activeSection === 'annonces' && (
             <div className="admin-section">
               <div className="admin-section__header">
                 <div className="section-label">Modération</div>
                 <h1 className="admin-section__title">
                   Annonces en attente
                 </h1>
               </div>
   
               {annonces.length === 0 ? (
                 <div className="admin-empty">
                   Aucune annonce en attente de modération.
                 </div>
               ) : (
                 <div className="admin-list">
                   {annonces.map((annonce) => (
                     <div key={annonce.id} className="admin-row">
                       <div className="admin-row__main">
                         <div className="admin-row__title">
                           {annonce.title}
                         </div>
                         <div className="admin-row__meta">
                           <span>{annonce.category}</span>
                           <span>·</span>
                           <span>{annonce.seller}</span>
                           <span>·</span>
                           <span>{annonce.price}</span>
                           <span>·</span>
                           <span>{annonce.submittedAt}</span>
                         </div>
                       </div>
   
                       <div className="admin-row__doc">
                         {annonce.hasDoc ? (
                           <div className="admin-row__doc-ok">
                             <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                               <path d="M2 5l2 2 4-4"
                                 stroke="currentColor" strokeWidth="1.2"
                                 strokeLinecap="round" strokeLinejoin="round"/>
                             </svg>
                             Document soumis
                           </div>
                         ) : (
                           <div className="admin-row__doc-missing">
                             Pas de document
                           </div>
                         )}
                       </div>
   
                       <div className="admin-row__actions">
                         <button
                           className="admin-btn admin-btn--approve"
                           onClick={() => handleApproveAnnonce(annonce.id)}
                         >
                           Approuver
                         </button>
                         <button
                           className="admin-btn admin-btn--reject"
                           onClick={() => handleRejectAnnonce(annonce.id)}
                         >
                           Rejeter
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           )}
   
           {/* ── KYC ── */}
           {activeSection === 'kyc' && (
             <div className="admin-section">
               <div className="admin-section__header">
                 <div className="section-label">Vérification</div>
                 <h1 className="admin-section__title">
                   KYC en attente
                 </h1>
               </div>
   
               {kyc.length === 0 ? (
                 <div className="admin-empty">
                   Aucune vérification KYC en attente.
                 </div>
               ) : (
                 <div className="admin-list">
                   {kyc.map((item) => (
                     <div key={item.id} className="admin-row">
                       <div className="admin-row__avatar">
                         {item.name.charAt(0)}
                       </div>
                       <div className="admin-row__main">
                         <div className="admin-row__title">
                           {item.name}
                         </div>
                         <div className="admin-row__meta">
                           <span>{item.email}</span>
                           <span>·</span>
                           <span>{item.docType}</span>
                           <span>·</span>
                           <span>{item.submittedAt}</span>
                         </div>
                       </div>
                       <div className="admin-row__actions">
                         <button
                           className="admin-btn admin-btn--approve"
                           onClick={() => handleApproveKyc(item.id)}
                         >
                           Valider
                         </button>
                         <button
                           className="admin-btn admin-btn--reject"
                           onClick={() => handleRejectKyc(item.id)}
                         >
                           Refuser
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           )}
   
           {/* ── USERS ── */}
           {activeSection === 'users' && (
             <div className="admin-section">
               <div className="admin-section__header">
                 <div className="section-label">Gestion</div>
                 <h1 className="admin-section__title">
                   Utilisateurs
                 </h1>
               </div>
               <div className="admin-empty">
                 Connexion Supabase à brancher pour afficher les utilisateurs.
               </div>
             </div>
           )}
   
         </main>
   
       </div>
     )
   }