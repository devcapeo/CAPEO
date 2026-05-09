/* ============================================
   CAPEO — DASHBOARD NAV
   Navigation latérale du dashboard.
   Affiche le profil utilisateur + sections.
   Props : user, sections, active, onNav
   ============================================ */

   import './DashboardNav.css'

   export default function DashboardNav({ user, sections, active, onNav }) {
     return (
       <div className="dash-nav">
   
         {/* Profil */}
         <div className="dash-nav__profile">
           <div className="dash-nav__avatar">
             {user.name.charAt(0)}
           </div>
           <div className="dash-nav__profile-info">
             <div className="dash-nav__name">{user.name}</div>
             <div className="dash-nav__email">{user.email}</div>
           </div>
           {user.isPremium && (
             <div className="dash-nav__premium">
               <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                 <path d="M5 1l1 3h3L6.5 6l1 3L5 7.5 2.5 9l1-3L1 4h3z"
                   stroke="currentColor" strokeWidth="0.8"
                   strokeLinejoin="round"/>
               </svg>
             </div>
           )}
         </div>
   
         {/* Navigation */}
         <nav className="dash-nav__menu">
           {sections.map((section) => (
             <button
               key={section.id}
               className={`dash-nav__item ${active === section.id ? 'dash-nav__item--active' : ''}`}
               onClick={() => onNav(section.id)}
             >
               <span>{section.label}</span>
               {active === section.id && (
                 <div className="dash-nav__item-dot"></div>
               )}
             </button>
           ))}
         </nav>
   
         {/* Footer nav */}
         <div className="dash-nav__footer">
           <div className="dash-nav__member">
             Membre depuis {user.memberSince}
           </div>
         </div>
   
       </div>
     )
   }