/* ============================================
   CAPEO — MON COMPTE
   Paramètres utilisateur.
   Abonnement, KYC, préférences, alertes.
   Props : user (objet)
   ============================================ */

   import { useState } from 'react'
   import './MonCompte.css'
   
   export default function MonCompte({ user }) {
     const [alerts, setAlerts] = useState({
       newActif:    true,
       roomActivity: true,
       offMarket:   true,
       newsletter:  false,
     })
   
     const toggleAlert = (key) => {
       setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))
     }
   
     return (
       <div className="mon-compte">
   
         <div className="dash-section__header">
           <div>
             <div className="section-label">Paramètres</div>
             <h2 className="dash-section__title">Mon compte</h2>
           </div>
         </div>
   
         {/* Abonnement */}
         <div className="mon-compte__block">
           <div className="mon-compte__block-title">Abonnement</div>
           <div className="mon-compte__plan">
             <div className="mon-compte__plan-info">
               <div className="mon-compte__plan-name">
                 {user.isPremium ? 'CAPEO Premium' : 'Compte gratuit'}
               </div>
               <div className="mon-compte__plan-desc">
                 {user.isPremium
                   ? 'Rooms illimitées · Off Market · Alertes · Profil patrimoine'
                   : 'Accès aux annonces publiques uniquement'
                 }
               </div>
             </div>
             {user.isPremium ? (
               <div className="mon-compte__plan-badge">
                 <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                   <path d="M5 1l1 3h3L6.5 6l1 3L5 7.5 2.5 9l1-3L1 4h3z"
                     stroke="currentColor" strokeWidth="0.8"
                     strokeLinejoin="round"/>
                 </svg>
                 Premium actif
               </div>
             ) : (
               <button className="mon-compte__upgrade-btn">
                 Passer Premium — 19,90€/mois
               </button>
             )}
           </div>
           {user.isPremium && (
             <div className="mon-compte__plan-actions">
               <button className="mon-compte__link-btn">
                 Gérer l'abonnement
               </button>
               <button className="mon-compte__link-btn mon-compte__link-btn--danger">
                 Annuler
               </button>
             </div>
           )}
         </div>
   
         {/* KYC */}
         <div className="mon-compte__block">
           <div className="mon-compte__block-title">Vérification d'identité</div>
           <div className="mon-compte__kyc">
             <div className="mon-compte__kyc-status mon-compte__kyc-status--verified">
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                 <path d="M2 6l2.5 2.5 5.5-5"
                   stroke="currentColor" strokeWidth="1.2"
                   strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
               Identité vérifiée
             </div>
             <div className="mon-compte__kyc-desc">
               Votre document d'identité a été vérifié par l'équipe CAPEO.
               Votre badge Vérifié est actif sur toutes vos annonces.
             </div>
           </div>
         </div>
   
         {/* Alertes */}
         <div className="mon-compte__block">
           <div className="mon-compte__block-title">Alertes et notifications</div>
           <div className="mon-compte__alerts">
             {[
               { key: 'newActif',     label: 'Nouvel actif correspondant à mon profil' },
               { key: 'roomActivity', label: 'Activité dans mes rooms' },
               { key: 'offMarket',    label: 'Nouveaux actifs Off Market' },
               { key: 'newsletter',   label: 'Newsletter CAPEO' },
             ].map((alert) => (
               <div key={alert.key} className="mon-compte__alert-row">
                 <span className="mon-compte__alert-label">
                   {alert.label}
                 </span>
                 <button
                   className={`mon-compte__toggle ${alerts[alert.key] ? 'mon-compte__toggle--on' : ''}`}
                   onClick={() => toggleAlert(alert.key)}
                 >
                   <div className="mon-compte__toggle-dot"></div>
                 </button>
               </div>
             ))}
           </div>
         </div>
   
         {/* Profil investisseur */}
         <div className="mon-compte__block">
           <div className="mon-compte__block-title">Profil acquéreur</div>
           <div className="mon-compte__profile-grid">
             <div className="mon-compte__profile-field">
               <label className="mon-compte__profile-label">
                 Budget d'investissement
               </label>
               <input
                 type="text"
                 className="mon-compte__profile-input"
                 defaultValue="100 000€ — 500 000€"
               />
             </div>
             <div className="mon-compte__profile-field">
               <label className="mon-compte__profile-label">
                 Localisation préférée
               </label>
               <input
                 type="text"
                 className="mon-compte__profile-input"
                 defaultValue="Paris, Lyon, Côte d'Azur"
               />
             </div>
             <div className="mon-compte__profile-field">
               <label className="mon-compte__profile-label">
                 Catégories d'actifs
               </label>
               <input
                 type="text"
                 className="mon-compte__profile-input"
                 defaultValue="Immobilier, Entreprise"
               />
             </div>
           </div>
           <button className="mon-compte__save-btn">
             Enregistrer les préférences
           </button>
         </div>
   
         {/* Danger zone */}
         <div className="mon-compte__block mon-compte__block--danger">
           <div className="mon-compte__block-title mon-compte__block-title--danger">
             Zone critique
           </div>
           <div className="mon-compte__danger-actions">
             <button className="mon-compte__danger-btn">
               Supprimer mon compte
             </button>
           </div>
         </div>
   
       </div>
     )
   }