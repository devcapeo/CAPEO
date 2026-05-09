/* ============================================
   CAPEO — BUSINESS ROOM
   Page dédiée à la coordination d'un deal.
   Accès après paiement ou abonnement premium.
   4 onglets : Discussion / Intentions /
   Documents / Résumé du deal.
   ============================================ */

   import { useState, useEffect } from 'react'
   import { useParams, Link } from 'react-router-dom'
   import RoomChat from './components/RoomChat.jsx'
   import RoomIntentions from './components/RoomIntentions.jsx'
   import RoomDocuments from './components/RoomDocuments.jsx'
   import RoomSummary from './components/RoomSummary.jsx'
   import './BusinessRoom.css'
   
   // Mock actif — remplacé par Supabase
   const ACTIF_MOCK = {
     id: '1',
     title: 'Immeuble de rapport — Centre historique',
     category: 'Immobilier',
     location: 'Lyon 2ème · 6 lots · 480 m²',
     price: 1250000,
     priceDisplay: '1 250 000 €',
     status: 'open',
     members: 4,
     declared: 920000,
     target: 1250000,
     seller: {
       name: 'Jean-Marc D.',
       initials: 'J',
       verified: true,
     },
   }
   
   const TABS = [
     {
       id: 'chat',
       label: 'Discussion',
       icon: (
         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
           <rect x="1" y="2" width="12" height="9" rx="1"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M4 11l2 2 2-2"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round" strokeLinejoin="round"/>
           <path d="M4 6h6M4 8h4"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
         </svg>
       ),
     },
     {
       id: 'intentions',
       label: 'Intentions',
       icon: (
         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
           <rect x="1" y="1" width="12" height="12" rx="1"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M4 7h6M4 4h6M4 10h3"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
         </svg>
       ),
     },
     {
       id: 'documents',
       label: 'Documents',
       icon: (
         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
           <rect x="2" y="1" width="10" height="12" rx="1"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M4 5h6M4 7h6M4 9h4"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
         </svg>
       ),
     },
     {
       id: 'summary',
       label: 'Résumé deal',
       icon: (
         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
           <circle cx="7" cy="7" r="6"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M4 7l2 2 4-4"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
       ),
     },
   ]
   
   export default function BusinessRoom() {
     const { id } = useParams()
     const [activeTab, setActiveTab] = useState('chat')
     const [actif] = useState(ACTIF_MOCK)
     const progressPct = Math.round(
       (actif.declared / actif.target) * 100
     )
   
     return (
       <div className="broom-page">
   
         {/* ── HEADER ROOM ── */}
         <div className="broom-header">
           <div className="broom-header__inner">
   
             {/* Retour */}
             <Link
               to={`/actifs/${id}`}
               className="broom-header__back"
             >
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <path d="M9 2L3 7l6 5"
                   stroke="currentColor" strokeWidth="1.2"
                   strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
               Retour à l'actif
             </Link>
   
             {/* Infos actif */}
             <div className="broom-header__actif">
               <div className="broom-header__actif-left">
                 <div className="broom-header__category">
                   {actif.category}
                 </div>
                 <h1 className="broom-header__title">
                   {actif.title}
                 </h1>
                 <div className="broom-header__location">
                   {actif.location}
                 </div>
               </div>
   
               <div className="broom-header__actif-right">
                 <div className="broom-header__price">
                   {actif.priceDisplay}
                 </div>
                 <div className="broom-header__status">
                   <div className="broom-header__status-dot"></div>
                   Room ouverte · {actif.members} participants
                 </div>
               </div>
             </div>
   
             {/* Barre progression */}
             <div className="broom-header__progress">
               <div className="broom-header__progress-labels">
                 <span>
                   {(actif.declared / 1000).toFixed(0)}k€ déclarés
                   sur {(actif.target / 1000).toFixed(0)}k€
                 </span>
                 <span className="broom-header__progress-pct">
                   {progressPct}%
                 </span>
               </div>
               <div className="broom-header__progress-bar">
                 <div
                   className="broom-header__progress-fill"
                   style={{ width: `${progressPct}%` }}
                 ></div>
               </div>
               <div className="broom-header__progress-note">
                 Intentions déclarées non contractuelles ·
                 CAPEO ne collecte aucun fonds
               </div>
             </div>
   
             {/* Participants */}
             <div className="broom-header__participants">
               <div className="broom-header__participants-label">
                 Participants
               </div>
               <div className="broom-header__avatars">
                 {['M', 'S', 'T', 'L'].map((initial, i) => (
                   <div
                     key={i}
                     className="broom-header__avatar"
                     title={`Participant ${i + 1}`}
                   >
                     {initial}
                   </div>
                 ))}
                 <div className="broom-header__avatar broom-header__avatar--seller">
                   {actif.seller.initials}
                 </div>
               </div>
               <div className="broom-header__seller-label">
                 {actif.seller.name}
                 <span>· Vendeur</span>
               </div>
             </div>
   
           </div>
         </div>
   
         {/* ── TABS ── */}
         <div className="broom-tabs">
           <div className="broom-tabs__inner">
             {TABS.map((tab) => (
               <button
                 key={tab.id}
                 className={`broom-tab ${activeTab === tab.id ? 'broom-tab--active' : ''}`}
                 onClick={() => setActiveTab(tab.id)}
               >
                 {tab.icon}
                 <span>{tab.label}</span>
               </button>
             ))}
           </div>
         </div>
   
         {/* ── CONTENU ── */}
         <div className="broom-content">
           <div className="broom-content__inner">
   
             {activeTab === 'chat' && (
               <RoomChat actifId={id} seller={actif.seller} />
             )}
             {activeTab === 'intentions' && (
               <RoomIntentions
                 actifId={id}
                 target={actif.target}
                 priceDisplay={actif.priceDisplay}
               />
             )}
             {activeTab === 'documents' && (
               <RoomDocuments actifId={id} />
             )}
             {activeTab === 'summary' && (
               <RoomSummary actif={actif} />
             )}
   
           </div>
         </div>
   
       </div>
     )
   }