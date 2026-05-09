/* ============================================
   CAPEO — MES ROOMS
   Liste des rooms auxquelles l'utilisateur
   participe ou a participé.
   Statuts : active, concluded, closed.
   ============================================ */

   import { useState } from 'react'
   import { Link } from 'react-router-dom'
   import './MesRooms.css'
   
   const ROOMS_MOCK = [
     {
       id: '1',
       actifTitle: 'Immeuble de rapport — Centre historique',
       actifId: '1',
       category: 'Immobilier',
       location: 'Lyon 2ème',
       price: '1 250 000 €',
       status: 'active',
       members: 4,
       declared: 920000,
       target: 1250000,
       role: 'vendeur',
       lastActivity: 'Il y a 2h',
       unread: 3,
     },
     {
       id: '2',
       actifTitle: 'Restaurant gastronomique en activité',
       actifId: '2',
       category: 'Entreprise',
       location: 'Paris 8ème',
       price: '380 000 €',
       status: 'active',
       members: 3,
       declared: 280000,
       target: 380000,
       role: 'acquéreur',
       lastActivity: 'Hier',
       unread: 0,
     },
     {
       id: '3',
       actifTitle: 'Local commercial — Rue de la Paix',
       actifId: '3',
       category: 'Immobilier',
       location: 'Paris 1er',
       price: '850 000 €',
       status: 'concluded',
       members: 5,
       declared: 850000,
       target: 850000,
       role: 'acquéreur',
       lastActivity: '15 Jan 2025',
       unread: 0,
     },
   ]
   
   const STATUS_CONFIG = {
     active:    { label: 'Active',    color: 'green' },
     concluded: { label: 'Conclue',   color: 'gold' },
     closed:    { label: 'Fermée',    color: 'gray' },
   }
   
   export default function MesRooms() {
     const [filter, setFilter] = useState('all')
   
     const filtered = ROOMS_MOCK.filter((r) => {
       if (filter === 'all') return true
       if (filter === 'active') return r.status === 'active'
       if (filter === 'concluded') return r.status === 'concluded'
       return true
     })
   
     return (
       <div className="mes-rooms">
   
         <div className="dash-section__header">
           <div>
             <div className="section-label">Activité</div>
             <h2 className="dash-section__title">Mes rooms</h2>
           </div>
         </div>
   
         {/* Filtres */}
         <div className="mes-rooms__filters">
           {['all', 'active', 'concluded'].map((f) => (
             <button
               key={f}
               className={`mes-rooms__filter ${filter === f ? 'mes-rooms__filter--active' : ''}`}
               onClick={() => setFilter(f)}
             >
               {f === 'all' ? 'Toutes' : f === 'active' ? 'Actives' : 'Conclues'}
             </button>
           ))}
         </div>
   
         {/* Liste */}
         <div className="mes-rooms__list">
           {filtered.map((room) => {
             const status = STATUS_CONFIG[room.status]
             const pct = Math.round((room.declared / room.target) * 100)
   
             return (
               <div key={room.id} className="room-row">
   
                 {/* En-tête */}
                 <div className="room-row__header">
                   <div className="room-row__main">
                     <div className="room-row__title">
                       {room.actifTitle}
                     </div>
                     <div className="room-row__meta">
                       <span>{room.category}</span>
                       <span>·</span>
                       <span>{room.location}</span>
                       <span>·</span>
                       <span>{room.price}</span>
                     </div>
                   </div>
                   <div className="room-row__badges">
                     <div className={`room-row__status room-row__status--${status.color}`}>
                       {status.label}
                     </div>
                     <div className="room-row__role">
                       {room.role}
                     </div>
                     {room.unread > 0 && (
                       <div className="room-row__unread">
                         {room.unread}
                       </div>
                     )}
                   </div>
                 </div>
   
                 {/* Barre de progression */}
                 <div className="room-row__progress">
                   <div className="room-row__progress-labels">
                     <span>{(room.declared / 1000).toFixed(0)}k€ déclarés</span>
                     <span>{pct}%</span>
                   </div>
                   <div className="room-row__progress-bar">
                     <div
                       className="room-row__progress-fill"
                       style={{ width: `${Math.min(pct, 100)}%` }}
                     ></div>
                   </div>
                 </div>
   
                 {/* Footer */}
                 <div className="room-row__footer">
                   <div className="room-row__info">
                     <span>
                       <strong>{room.members}</strong> participants
                     </span>
                     <span>·</span>
                     <span>{room.lastActivity}</span>
                   </div>
                   {room.status === 'active' && (
                     <Link
                       to={`/actifs/${room.actifId}`}
                       className="room-row__cta"
                     >
                       Ouvrir la room →
                     </Link>
                   )}
                 </div>
   
               </div>
             )
           })}
         </div>
   
       </div>
     )
   }