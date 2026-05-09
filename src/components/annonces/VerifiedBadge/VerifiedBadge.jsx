/* ============================================
   CAPEO — VERIFIED BADGE
   Badge affiché sur les annonces et profils
   dont le vendeur a soumis un document
   vérifié par CAPEO.
   Props : small (boolean) — version réduite
   ============================================ */

   import './VerifiedBadge.css'

   export default function VerifiedBadge({ small = false }) {
     return (
       <div className={`verified-badge-comp ${small ? 'verified-badge-comp--small' : ''}`}>
         <svg
           width={small ? "8" : "10"}
           height={small ? "8" : "10"}
           viewBox="0 0 10 10"
           fill="none"
         >
           <path
             d="M1.5 5l2.5 2.5 4.5-5"
             stroke="currentColor"
             strokeWidth="1.2"
             strokeLinecap="round"
             strokeLinejoin="round"
           />
         </svg>
         {!small && <span>Vérifié CAPEO</span>}
       </div>
     )
   }