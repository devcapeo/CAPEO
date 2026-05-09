/* ============================================
   CAPEO — ACTIF DISCLAIMER
   Bloc légal affiché sur chaque annonce.
   Rappelle que CAPEO ne vérifie pas les
   informations publiées par les vendeurs.
   ============================================ */

   import './ActifDisclaimer.css'

   export default function ActifDisclaimer() {
     return (
       <div className="actif-disclaimer">
   
         <div className="actif-disclaimer__icon">
           <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
             <path d="M8 1L15 13H1L8 1Z"
               stroke="currentColor" strokeWidth="1"
               strokeLinejoin="round"/>
             <path d="M8 6v4"
               stroke="currentColor" strokeWidth="1"
               strokeLinecap="round"/>
             <circle cx="8" cy="11.5" r="0.7"
               fill="currentColor"/>
           </svg>
         </div>
   
         <div className="actif-disclaimer__content">
           <div className="actif-disclaimer__title">
             Information légale importante
           </div>
           <p className="actif-disclaimer__text">
             Les informations présentées sur cette annonce sont fournies
             exclusivement par le vendeur. <strong>CAPEO ne les vérifie pas</strong>,
             ne les valide pas et ne formule aucun conseil d'acquisition.
             Les indicateurs de rendement ou de valeur sont des estimations
             du vendeur, non contractuelles. Les utilisateurs sont seuls
             responsables de leurs décisions d'acquisition.
             La transaction se formalise hors plateforme, entre les parties.
           </p>
         </div>
   
       </div>
     )
   }