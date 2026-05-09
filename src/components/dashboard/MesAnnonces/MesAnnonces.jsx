/* ============================================
   CAPEO — MES ANNONCES
   Liste des annonces publiées par le vendeur.
   Statuts : active, pending, sold, archived.
   ============================================ */

   import { useState } from 'react'
   import { Link } from 'react-router-dom'
   import './MesAnnonces.css'
   
   const ANNONCES_MOCK = [
     {
       id: '1',
       title: 'Immeuble de rapport — Centre historique',
       category: 'Immobilier',
       price: '1 250 000 €',
       status: 'active',
       views: 142,
       contacts: 14,
       rooms: 1,
       verified: true,
       createdAt: '12 Jan 2025',
     },
     {
       id: '2',
       title: 'Local commercial — Rue de la République',
       category: 'Immobilier',
       price: '320 000 €',
       status: 'pending',
       views: 0,
       contacts: 0,
       rooms: 0,
       verified: false,
       createdAt: '28 Jan 2025',
     },
   ]
   
   const STATUS_LABELS = {
     active:   { label: 'Active',      color: 'green' },
     pending:  { label: 'En attente',  color: 'gold' },
     sold:     { label: 'Vendu',       color: 'blue' },
     archived: { label: 'Archivée',    color: 'gray' },
   }
   
   export default function MesAnnonces() {
     const [annonces] = useState(ANNONCES_MOCK)
   
     return (
       <div className="mes-annonces">
   
         <div className="dash-section__header">
           <div>
             <div className="section-label">Vendeur</div>
             <h2 className="dash-section__title">Mes annonces</h2>
           </div>
           <Link to="/proposer-un-actif" className="dash-section__btn">
             <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
               <path d="M7 2v10M2 7h10"
                 stroke="currentColor" strokeWidth="1.2"
                 strokeLinecap="round"/>
             </svg>
             Nouvelle annonce
           </Link>
         </div>
   
         {annonces.length === 0 ? (
           <div className="dash-empty">
             <div className="dash-empty__icon">
               <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                 <rect x="4" y="4" width="24" height="24" rx="2"
                   stroke="currentColor" strokeWidth="1"/>
                 <path d="M10 16h12M16 10v12"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinecap="round"/>
               </svg>
             </div>
             <div className="dash-empty__title">Aucune annonce</div>
             <div className="dash-empty__desc">
               Publiez votre premier actif gratuitement.
             </div>
             <Link to="/proposer-un-actif" className="dash-empty__btn">
               Publier un actif
             </Link>
           </div>
         ) : (
           <div className="mes-annonces__list">
             {annonces.map((annonce) => {
               const status = STATUS_LABELS[annonce.status]
               return (
                 <div key={annonce.id} className="annonce-row">
   
                   <div className="annonce-row__main">
                     <div className="annonce-row__title">
                       {annonce.title}
                     </div>
                     <div className="annonce-row__meta">
                       <span>{annonce.category}</span>
                       <span>·</span>
                       <span>{annonce.price}</span>
                       <span>·</span>
                       <span>Publié le {annonce.createdAt}</span>
                     </div>
                   </div>
   
                   <div className="annonce-row__stats">
                     <div className="annonce-row__stat">
                       <strong>{annonce.views}</strong>
                       <span>vues</span>
                     </div>
                     <div className="annonce-row__stat">
                       <strong>{annonce.contacts}</strong>
                       <span>contacts</span>
                     </div>
                     <div className="annonce-row__stat">
                       <strong>{annonce.rooms}</strong>
                       <span>rooms</span>
                     </div>
                   </div>
   
                   <div className="annonce-row__right">
                     <div className={`annonce-row__status annonce-row__status--${status.color}`}>
                       {status.label}
                     </div>
                     {annonce.verified ? (
                       <div className="annonce-row__verified">
                         <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                           <path d="M1 4l2 2 4-3"
                             stroke="currentColor" strokeWidth="1.2"
                             strokeLinecap="round" strokeLinejoin="round"/>
                         </svg>
                         Vérifié
                       </div>
                     ) : (
                       <div className="annonce-row__unverified">
                         En vérification
                       </div>
                     )}
                     <Link
                       to={`/actifs/${annonce.id}`}
                       className="annonce-row__link"
                     >
                       Voir →
                     </Link>
                   </div>
   
                 </div>
               )
             })}
           </div>
         )}
   
       </div>
     )
   }