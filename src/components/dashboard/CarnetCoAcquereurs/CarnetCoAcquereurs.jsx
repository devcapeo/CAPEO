/* ============================================
   CAPEO — CARNET CO-ACQUÉREURS
   Contacts sauvegardés depuis les rooms.
   Permet de recontacter directement
   sans repasser par une room payante.
   ============================================ */

   import { useState } from 'react'
   import './CarnetCoAcquereurs.css'
   
   const CONTACTS_MOCK = [
     {
       id: '1',
       name: 'Marc D.',
       initials: 'M',
       role: 'Acquéreur',
       location: 'Paris',
       budget: '150k — 300k€',
       structures: ['Nom propre', 'SCI'],
       deals: 2,
       metIn: 'Room — Local Paris 1er',
       verified: true,
       note: 'Sérieux, réactif. SCI avec associé.',
     },
     {
       id: '2',
       name: 'Sophie L.',
       initials: 'S',
       role: 'Acquéreur',
       location: 'Lyon',
       budget: '100k — 200k€',
       structures: ['SCI'],
       deals: 1,
       metIn: 'Room — Local Paris 1er',
       verified: true,
       note: '',
     },
   ]
   
   export default function CarnetCoAcquereurs() {
     const [contacts] = useState(CONTACTS_MOCK)
     const [selected, setSelected] = useState(null)
   
     return (
       <div className="carnet">
   
         <div className="dash-section__header">
           <div>
             <div className="section-label">Réseau</div>
             <h2 className="dash-section__title">Co-acquéreurs</h2>
             <p className="carnet__sub">
               Contacts rencontrés dans vos rooms. Recontactez-les
               directement pour de futurs deals.
             </p>
           </div>
         </div>
   
         {contacts.length === 0 ? (
           <div className="dash-empty">
             <div className="dash-empty__title">Aucun contact</div>
             <div className="dash-empty__desc">
               Les co-acquéreurs croisés dans vos rooms
               apparaîtront ici.
             </div>
           </div>
         ) : (
           <div className="carnet__grid">
             {contacts.map((contact) => (
               <div
                 key={contact.id}
                 className={`carnet-card ${selected === contact.id ? 'carnet-card--selected' : ''}`}
                 onClick={() => setSelected(
                   selected === contact.id ? null : contact.id
                 )}
               >
                 <div className="carnet-card__header">
                   <div className="carnet-card__avatar">
                     {contact.initials}
                   </div>
                   <div className="carnet-card__info">
                     <div className="carnet-card__name">
                       {contact.name}
                     </div>
                     <div className="carnet-card__location">
                       {contact.location}
                     </div>
                   </div>
                   {contact.verified && (
                     <div className="carnet-card__verified">
                       <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                         <path d="M1 4l2 2 4-3"
                           stroke="currentColor" strokeWidth="1.2"
                           strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </div>
                   )}
                 </div>
   
                 <div className="carnet-card__stats">
                   <div className="carnet-card__stat">
                     <span>{contact.budget}</span>
                     <span className="carnet-card__stat-label">Budget</span>
                   </div>
                   <div className="carnet-card__stat">
                     <span>{contact.deals}</span>
                     <span className="carnet-card__stat-label">Deals</span>
                   </div>
                 </div>
   
                 <div className="carnet-card__structures">
                   {contact.structures.map((s) => (
                     <span key={s} className="carnet-card__structure">
                       {s}
                     </span>
                   ))}
                 </div>
   
                 <div className="carnet-card__met">
                   Rencontré via : {contact.metIn}
                 </div>
   
                 {selected === contact.id && (
                   <div className="carnet-card__expanded">
                     {contact.note && (
                       <div className="carnet-card__note">
                         <div className="carnet-card__note-label">
                           Note personnelle
                         </div>
                         <div className="carnet-card__note-text">
                           {contact.note}
                         </div>
                       </div>
                     )}
                     <button className="carnet-card__contact-btn">
                       <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                         <path d="M2 3h8v7H2z"
                           stroke="currentColor" strokeWidth="1"
                           strokeLinejoin="round"/>
                         <path d="M2 3l4 4 4-4"
                           stroke="currentColor" strokeWidth="1"
                           strokeLinecap="round"/>
                       </svg>
                       Envoyer un message
                     </button>
                   </div>
                 )}
   
               </div>
             ))}
           </div>
         )}
   
       </div>
     )
   }