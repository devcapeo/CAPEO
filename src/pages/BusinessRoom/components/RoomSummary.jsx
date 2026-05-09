/* ============================================
   CAPEO — BUSINESS ROOM · RÉSUMÉ DEAL
   Récapitulatif structuré du deal en cours.
   Statut, participants, intentions, prochaines
   étapes. Export PDF prévu en V2.
   ============================================ */

   import './RoomSummary.css'

   const NEXT_STEPS = [
     {
       id: '1',
       label: 'Vérification des documents juridiques',
       desc: 'Titre de propriété, baux, diagnostics — à vérifier par vos soins ou via un notaire.',
       done: true,
     },
     {
       id: '2',
       label: 'Confirmation des intentions d\'apport',
       desc: 'Tous les participants confirment leur montant et leur structure d\'acquisition.',
       done: true,
     },
     {
       id: '3',
       label: 'Constitution de la SCI ou structure choisie',
       desc: 'Rédaction des statuts, ouverture de compte — à réaliser hors CAPEO avec un notaire ou avocat.',
       done: false,
     },
     {
       id: '4',
       label: 'Signature du compromis de vente',
       desc: 'Rendez-vous chez le notaire pour signer le compromis entre le vendeur et les acquéreurs.',
       done: false,
     },
     {
       id: '5',
       label: 'Acte authentique de vente',
       desc: 'Signature définitive et transfert de propriété. La transaction se conclut hors CAPEO.',
       done: false,
     },
   ]
   
   export default function RoomSummary({ actif }) {
     const progressPct = Math.round(
       (actif.declared / actif.target) * 100
     )
   
     const doneSteps = NEXT_STEPS.filter((s) => s.done).length
     const totalSteps = NEXT_STEPS.length
     const dealProgress = Math.round((doneSteps / totalSteps) * 100)
   
     return (
       <div className="broom-summary">
   
         {/* En-tête */}
         <div className="broom-summary__header">
           <div className="broom-summary__title">
             Résumé du deal
           </div>
           <div className="broom-summary__subtitle">
             Vue d'ensemble de la coordination en cours
           </div>
         </div>
   
         {/* Statut global */}
         <div className="broom-summary__status-grid">
   
           <div className="broom-summary__status-card">
             <div className="broom-summary__status-label">
               Statut de la room
             </div>
             <div className="broom-summary__status-value broom-summary__status-value--active">
               <div className="broom-summary__status-dot"></div>
               Room ouverte
             </div>
           </div>
   
           <div className="broom-summary__status-card">
             <div className="broom-summary__status-label">
               Participants
             </div>
             <div className="broom-summary__status-value">
               {actif.members} acquéreurs + 1 vendeur
             </div>
           </div>
   
           <div className="broom-summary__status-card">
             <div className="broom-summary__status-label">
               Avancement deal
             </div>
             <div className="broom-summary__status-value">
               {doneSteps}/{totalSteps} étapes complétées
             </div>
           </div>
   
           <div className="broom-summary__status-card">
             <div className="broom-summary__status-label">
               CAPEO intervient ?
             </div>
             <div className="broom-summary__status-value broom-summary__status-value--no">
               Non — transaction hors plateforme
             </div>
           </div>
   
         </div>
   
         {/* Actif */}
         <div className="broom-summary__block">
           <div className="broom-summary__block-title">
             L'actif
           </div>
           <div className="broom-summary__actif">
             <div className="broom-summary__actif-info">
               <div className="broom-summary__actif-cat">
                 {actif.category}
               </div>
               <div className="broom-summary__actif-title">
                 {actif.title}
               </div>
               <div className="broom-summary__actif-location">
                 {actif.location}
               </div>
             </div>
             <div className="broom-summary__actif-price">
               {actif.priceDisplay}
             </div>
           </div>
   
           {/* Barre financement */}
           <div className="broom-summary__financing">
             <div className="broom-summary__financing-labels">
               <span>
                 {(actif.declared / 1000).toFixed(0)}k€ déclarés
               </span>
               <span>{progressPct}% de l'objectif</span>
             </div>
             <div className="broom-summary__financing-bar">
               <div
                 className="broom-summary__financing-fill"
                 style={{ width: `${progressPct}%` }}
               ></div>
             </div>
             <div className="broom-summary__financing-note">
               Intentions non contractuelles · CAPEO ne collecte aucun fonds
             </div>
           </div>
         </div>
   
         {/* Participants */}
         <div className="broom-summary__block">
           <div className="broom-summary__block-title">
             Participants et intentions
           </div>
           <div className="broom-summary__participants">
             {[
               { initials: 'J', name: 'Jean-Marc D.', role: 'Vendeur', amount: null, structure: null },
               { initials: 'M', name: 'Marc D.', role: 'Acquéreur', amount: '200 000€', structure: 'Nom propre' },
               { initials: 'S', name: 'Sophie L.', role: 'Acquéreur', amount: '150 000€', structure: 'SCI' },
               { initials: 'T', name: 'Thomas R.', role: 'Acquéreur', amount: '320 000€', structure: 'SCI' },
               { initials: 'L', name: 'Lena M.', role: 'Acquéreur', amount: '250 000€', structure: 'Nom propre' },
             ].map((p, i) => (
               <div key={i} className="broom-summary__participant">
                 <div className={`broom-summary__participant-avatar ${p.role === 'Vendeur' ? 'broom-summary__participant-avatar--vendeur' : ''}`}>
                   {p.initials}
                 </div>
                 <div className="broom-summary__participant-info">
                   <div className="broom-summary__participant-name">
                     {p.name}
                   </div>
                   <div className={`broom-summary__participant-role ${p.role === 'Vendeur' ? 'broom-summary__participant-role--vendeur' : ''}`}>
                     {p.role}
                   </div>
                 </div>
                 {p.amount && (
                   <div className="broom-summary__participant-right">
                     <div className="broom-summary__participant-amount">
                       {p.amount}
                     </div>
                     <div className="broom-summary__participant-structure">
                       {p.structure}
                     </div>
                   </div>
                 )}
               </div>
             ))}
           </div>
         </div>
   
         {/* Prochaines étapes */}
         <div className="broom-summary__block">
           <div className="broom-summary__block-header">
             <div className="broom-summary__block-title">
               Prochaines étapes
             </div>
             <div className="broom-summary__steps-progress">
               <div className="broom-summary__steps-bar">
                 <div
                   className="broom-summary__steps-fill"
                   style={{ width: `${dealProgress}%` }}
                 ></div>
               </div>
               <span>{dealProgress}%</span>
             </div>
           </div>
   
           <div className="broom-summary__steps">
             {NEXT_STEPS.map((step, index) => (
               <div
                 key={step.id}
                 className={`broom-summary__step ${step.done ? 'broom-summary__step--done' : ''}`}
               >
                 <div className="broom-summary__step-check">
                   {step.done ? (
                     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                       <path d="M2 5l2 2 4-4"
                         stroke="currentColor" strokeWidth="1.5"
                         strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   ) : (
                     <span>{index + 1}</span>
                   )}
                 </div>
                 <div className="broom-summary__step-content">
                   <div className="broom-summary__step-label">
                     {step.label}
                   </div>
                   <div className="broom-summary__step-desc">
                     {step.desc}
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
   
         {/* Disclaimer */}
         <div className="broom-summary__disclaimer">
           <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
             <path d="M7 1L13 12H1L7 1Z"
               stroke="currentColor" strokeWidth="1"
               strokeLinejoin="round"/>
             <path d="M7 6v3"
               stroke="currentColor" strokeWidth="1"
               strokeLinecap="round"/>
             <circle cx="7" cy="10.5" r="0.7"
               fill="currentColor"/>
           </svg>
           <p>
             Ce résumé est fourni à titre indicatif pour faciliter
             la coordination entre les participants.
             <strong> CAPEO ne participe pas à la transaction,
             ne collecte aucun fonds et n'est pas responsable
             des décisions prises par les parties.</strong>
             La transaction se formalise intégralement hors
             plateforme, entre les parties et leur notaire.
           </p>
         </div>
   
       </div>
     )
   }