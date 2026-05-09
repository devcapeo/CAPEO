/* ============================================
   CAPEO — MES DEALS
   Historique des deals conclus via CAPEO.
   Un deal = une transaction facilitée
   par une Business Room.
   ============================================ */

   import { useState } from 'react'
   import { Link } from 'react-router-dom'
   import './MesDeals.css'
   
   const DEALS_MOCK = [
     {
       id: '1',
       actifTitle: 'Local commercial — Rue de la Paix',
       actifId: '3',
       category: 'Immobilier',
       location: 'Paris 1er',
       totalPrice: '850 000 €',
       myApport: '170 000 €',
       myPct: 20,
       structure: 'SCI',
       coAcquereurs: 4,
       date: '15 Jan 2025',
       status: 'concluded',
     },
   ]
   
   export default function MesDeals() {
     const [deals] = useState(DEALS_MOCK)
   
     return (
       <div className="mes-deals">
   
         <div className="dash-section__header">
           <div>
             <div className="section-label">Historique</div>
             <h2 className="dash-section__title">Mes deals</h2>
           </div>
         </div>
   
         {deals.length === 0 ? (
           <div className="dash-empty">
             <div className="dash-empty__icon">
               <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                 <circle cx="16" cy="16" r="13"
                   stroke="currentColor" strokeWidth="1"/>
                 <path d="M10 16l4 4 8-8"
                   stroke="currentColor" strokeWidth="1.2"
                   strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </div>
             <div className="dash-empty__title">Aucun deal conclu</div>
             <div className="dash-empty__desc">
               Vos deals conclus via CAPEO apparaîtront ici.
             </div>
             <Link to="/actifs" className="dash-empty__btn">
               Explorer les actifs
             </Link>
           </div>
         ) : (
           <div className="mes-deals__list">
             {deals.map((deal) => (
               <div key={deal.id} className="deal-row">
   
                 <div className="deal-row__header">
                   <div className="deal-row__main">
                     <div className="deal-row__title">{deal.actifTitle}</div>
                     <div className="deal-row__meta">
                       <span>{deal.category}</span>
                       <span>·</span>
                       <span>{deal.location}</span>
                       <span>·</span>
                       <span>Conclu le {deal.date}</span>
                     </div>
                   </div>
                   <div className="deal-row__badge">
                     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                       <path d="M2 5l2 2 4-4"
                         stroke="currentColor" strokeWidth="1.2"
                         strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                     Deal conclu
                   </div>
                 </div>
   
                 <div className="deal-row__stats">
                   <div className="deal-row__stat">
                     <span className="deal-row__stat-label">Prix total</span>
                     <span className="deal-row__stat-value">
                       {deal.totalPrice}
                     </span>
                   </div>
                   <div className="deal-row__stat">
                     <span className="deal-row__stat-label">Mon apport</span>
                     <span className="deal-row__stat-value deal-row__stat-value--gold">
                       {deal.myApport}
                     </span>
                   </div>
                   <div className="deal-row__stat">
                     <span className="deal-row__stat-label">Ma part</span>
                     <span className="deal-row__stat-value">
                       {deal.myPct}%
                     </span>
                   </div>
                   <div className="deal-row__stat">
                     <span className="deal-row__stat-label">Structure</span>
                     <span className="deal-row__stat-value">
                       {deal.structure}
                     </span>
                   </div>
                   <div className="deal-row__stat">
                     <span className="deal-row__stat-label">Co-acquéreurs</span>
                     <span className="deal-row__stat-value">
                       {deal.coAcquereurs}
                     </span>
                   </div>
                 </div>
   
               </div>
             ))}
           </div>
         )}
   
       </div>
     )
   }