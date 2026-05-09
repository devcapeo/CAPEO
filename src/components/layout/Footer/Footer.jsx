/* ============================================
   CAPEO — FOOTER
   Pied de page présent sur toutes les pages.
   Contient : logo, liens, disclaimer légal,
   copyright et mention CAPEO = Capital & Opportunities.
   ============================================ */

   import { Link } from 'react-router-dom'
   import './Footer.css'
   
   export default function Footer() {
     const year = new Date().getFullYear()
   
     return (
       <footer className="footer">
         <div className="footer__inner">
   
           {/* ── HAUT DU FOOTER ── */}
           <div className="footer__top">
   
             {/* Logo + baseline */}
             <div className="footer__brand">
               <div className="footer__logo">
                 CAP<span>E</span>O
               </div>
               <div className="footer__meaning">
                 Capital &amp; Opportunities
               </div>
               <p className="footer__tagline">
                 Les actifs d'exception, enfin accessibles.
               </p>
             </div>
   
             {/* Colonne Plateforme */}
             <div className="footer__col">
               <div className="footer__col-title">Plateforme</div>
               <Link to="/actifs"            className="footer__link">Actifs</Link>
               <Link to="/off-market"        className="footer__link">Off Market</Link>
               <Link to="/proposer-un-actif" className="footer__link">Proposer un actif</Link>
               <Link to="/comment-ca-marche" className="footer__link">Comment ça marche</Link>
             </div>
   
             {/* Colonne Compte */}
             <div className="footer__col">
               <div className="footer__col-title">Compte</div>
               <Link to="/inscription"  className="footer__link">Créer un compte</Link>
               <Link to="/connexion"    className="footer__link">Connexion</Link>
               <Link to="/dashboard"    className="footer__link">Dashboard</Link>
               <Link to="/dashboard/rooms" className="footer__link">Mes rooms</Link>
             </div>
   
             {/* Colonne Légal */}
             <div className="footer__col">
               <div className="footer__col-title">Légal</div>
               <Link to="/cgu"           className="footer__link">CGU</Link>
               <Link to="/cgv"           className="footer__link">CGV</Link>
               <Link to="/confidentialite" className="footer__link">Confidentialité</Link>
               <Link to="/mentions-legales" className="footer__link">Mentions légales</Link>
             </div>
   
           </div>
   
           {/* ── DISCLAIMER LÉGAL ── */}
           <div className="footer__disclaimer">
             <div className="footer__disclaimer-icon">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <path d="M7 1L13 12H1L7 1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
                 <path d="M7 5.5V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                 <circle cx="7" cy="10" r="0.6" fill="currentColor"/>
               </svg>
             </div>
             <p>
               <strong>Information légale —</strong> CAPEO est une plateforme technique de mise en relation entre vendeurs et acquéreurs potentiels. CAPEO n'intervient à aucun moment dans les transactions, ne fournit aucun conseil en acquisition, ne vérifie pas l'exactitude des informations publiées par les vendeurs, et ne garantit aucun résultat. Les informations affichées sur chaque annonce sont fournies exclusivement par le vendeur. Les utilisateurs sont seuls responsables de leurs décisions.
             </p>
           </div>
   
           {/* ── BAS DU FOOTER ── */}
           <div className="footer__bottom">
             <div className="footer__copyright">
               © {year} CAPEO — Capital &amp; Opportunities. Tous droits réservés.
             </div>
             <div className="footer__bottom-links">
               <Link to="/cgu"              className="footer__bottom-link">CGU</Link>
               <Link to="/confidentialite"  className="footer__bottom-link">Confidentialité</Link>
               <Link to="/mentions-legales" className="footer__bottom-link">Mentions légales</Link>
             </div>
           </div>
   
         </div>
       </footer>
     )
   }