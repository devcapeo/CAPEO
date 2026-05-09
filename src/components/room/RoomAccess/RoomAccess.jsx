/* ============================================
   CAPEO — ROOM ACCESS
   Mur de paiement avant d'entrer dans la room.
   Deux options : room à l'acte (15€)
   ou abonnement premium (19,90€/mois).
   Props : onAccess — callback après paiement
   ============================================ */

   import { useState } from 'react'
   import './RoomAccess.css'
   
   export default function RoomAccess({ onAccess }) {
     const [selected, setSelected] = useState('acte')
     const [loading, setLoading] = useState(false)
   
     const handleAccess = () => {
       setLoading(true)
       // Simulation paiement — remplacé par Stripe plus tard
       setTimeout(() => {
         setLoading(false)
         onAccess()
       }, 1200)
     }
   
     return (
       <div className="room-access">
   
         {/* En-tête */}
         <div className="room-access__header">
           <div className="room-access__lock">
             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
               <rect x="4" y="9" width="12" height="9" rx="1"
                 stroke="currentColor" strokeWidth="1.2"/>
               <path d="M7 9V6.5a3 3 0 016 0V9"
                 stroke="currentColor" strokeWidth="1.2"
                 strokeLinecap="round"/>
               <circle cx="10" cy="14" r="1.5"
                 fill="currentColor" opacity="0.6"/>
             </svg>
           </div>
           <div className="room-access__title">
             Accéder à la room privée
           </div>
           <p className="room-access__sub">
             Rejoignez la discussion entre acquéreurs qualifiés
             autour de cet actif.
           </p>
         </div>
   
         {/* Options */}
         <div className="room-access__options">
   
           {/* Option 1 — Room à l'acte */}
           <div
             className={`room-access__option ${selected === 'acte' ? 'room-access__option--selected' : ''}`}
             onClick={() => setSelected('acte')}
           >
             <div className="room-access__option-radio">
               {selected === 'acte' && (
                 <div className="room-access__option-radio-dot"></div>
               )}
             </div>
             <div className="room-access__option-content">
               <div className="room-access__option-title">
                 Accès ponctuel
               </div>
               <div className="room-access__option-desc">
                 Cette room uniquement · Sans engagement
               </div>
             </div>
             <div className="room-access__option-price">
               15€
             </div>
           </div>
   
           {/* Option 2 — Abonnement */}
           <div
             className={`room-access__option room-access__option--premium ${selected === 'premium' ? 'room-access__option--selected' : ''}`}
             onClick={() => setSelected('premium')}
           >
             <div className="room-access__option-badge">
               Recommandé
             </div>
             <div className="room-access__option-radio">
               {selected === 'premium' && (
                 <div className="room-access__option-radio-dot"></div>
               )}
             </div>
             <div className="room-access__option-content">
               <div className="room-access__option-title">
                 Premium
               </div>
               <div className="room-access__option-desc">
                 Rooms illimitées · Off Market · Alertes · Profil patrimoine
               </div>
             </div>
             <div className="room-access__option-price">
               19,90€
               <span>/mois</span>
             </div>
           </div>
   
         </div>
   
         {/* Ce qu'on obtient */}
         <div className="room-access__features">
           <div className="room-access__feature">
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
               <path d="M2 6l2.5 2.5 5.5-5"
                 stroke="currentColor" strokeWidth="1.2"
                 strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             Discussion privée avec le vendeur
           </div>
           <div className="room-access__feature">
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
               <path d="M2 6l2.5 2.5 5.5-5"
                 stroke="currentColor" strokeWidth="1.2"
                 strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             Tableau d'intentions des co-acquéreurs
           </div>
           <div className="room-access__feature">
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
               <path d="M2 6l2.5 2.5 5.5-5"
                 stroke="currentColor" strokeWidth="1.2"
                 strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             Simulateur de répartition
           </div>
           <div className="room-access__feature">
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
               <path d="M2 6l2.5 2.5 5.5-5"
                 stroke="currentColor" strokeWidth="1.2"
                 strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             Upload de documents privés
           </div>
         </div>
   
         {/* CTA */}
         <button
           className="room-access__btn"
           onClick={handleAccess}
           disabled={loading}
         >
           {loading ? (
             <span className="spinner"></span>
           ) : (
             <>
               {selected === 'acte' ? 'Accéder pour 15€' : 'Démarrer Premium — 19,90€/mois'}
             </>
           )}
         </button>
   
         {/* Note légale */}
         <p className="room-access__legal">
           Les montants déclarés dans la room sont non contractuels.
           CAPEO ne collecte aucun fonds et n'intervient pas dans la transaction.
         </p>
   
       </div>
     )
   }