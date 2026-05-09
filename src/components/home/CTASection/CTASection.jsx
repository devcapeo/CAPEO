/* ============================================
   CAPEO — CTA SECTION
   Dernière section de la Home.
   Accroche finale + deux boutons d'action.
   Vendeur et acquéreur adressés séparément.
   ============================================ */

   import { useEffect, useRef } from 'react'
   import { Link } from 'react-router-dom'
   import './CTASection.css'
   
   export default function CTASection() {
     const sectionRef = useRef(null)
   
     useEffect(() => {
       const observer = new IntersectionObserver(
         (entries) => {
           entries.forEach((entry) => {
             if (entry.isIntersecting) {
               entry.target.classList.add('visible')
               observer.unobserve(entry.target)
             }
           })
         },
         { threshold: 0.15 }
       )
       const reveals = sectionRef.current?.querySelectorAll('.reveal')
       reveals?.forEach((el) => observer.observe(el))
       return () => observer.disconnect()
     }, [])
   
     return (
       <section className="cta-section" ref={sectionRef}>
   
         {/* Orbe de fond */}
         <div className="cta-section__orb"></div>
   
         <div className="container">
   
           {/* Accroche */}
           <div className="cta-section__header reveal">
             <div className="section-label">Rejoindre CAPEO</div>
             <h2 className="cta-section__title">
               Le marché des actifs<br/>
               <em>vous attend.</em>
             </h2>
             <p className="cta-section__sub">
               Vendeurs — publiez gratuitement et atteignez
               des acquéreurs qualifiés. Acquéreurs — accédez
               à des actifs invisibles ailleurs et organisez
               votre acquisition à plusieurs.
             </p>
           </div>
   
           {/* Deux cartes d'action */}
           <div className="cta-section__cards">
   
             {/* Carte Vendeur */}
             <div className="cta-card cta-card--seller reveal reveal-delay-1">
               <div className="cta-card__label">Vous êtes vendeur</div>
               <h3 className="cta-card__title">
                 Publiez votre actif.<br/>Gratuitement.
               </h3>
               <ul className="cta-card__list">
                 <li>Publication 100% gratuite</li>
                 <li>Badge Vérifié CAPEO</li>
                 <li>Accès aux acquéreurs qualifiés</li>
                 <li>Zéro commission sur la transaction</li>
               </ul>
               <Link
                 to="/proposer-un-actif"
                 className="cta-card__btn cta-card__btn--primary"
               >
                 Proposer un actif
               </Link>
             </div>
   
             {/* Carte Acquéreur */}
             <div className="cta-card cta-card--buyer reveal reveal-delay-2">
               <div className="cta-card__label">Vous êtes acquéreur</div>
               <h3 className="cta-card__title">
                 Accédez aux actifs.<br/>Rejoignez une room.
               </h3>
               <ul className="cta-card__list">
                 <li>Accès aux annonces publiques gratuit</li>
                 <li>Rooms de coordination privées</li>
                 <li>Off Market exclusif en premium</li>
                 <li>Organisez votre acquisition à plusieurs</li>
               </ul>
               <Link
                 to="/inscription"
                 className="cta-card__btn cta-card__btn--ghost"
               >
                 Créer un compte
               </Link>
             </div>
   
           </div>
   
           {/* Ligne de confiance */}
           <div className="cta-section__trust reveal">
             <div className="cta-section__trust-item">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <path d="M7 1l1.5 4.5H13l-3.75 2.75 1.5 4.5L7 10l-3.75 2.75 1.5-4.5L1 5.5h4.5z"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinejoin="round"/>
               </svg>
               Vendeurs vérifiés
             </div>
             <div className="cta-section__trust-divider"></div>
             <div className="cta-section__trust-item">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <path d="M7 1L9 5h4L9.5 7.5l1.5 4.5L7 9.5 3 12l1.5-4.5L1 5h4z"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinejoin="round"/>
               </svg>
               Zéro commission
             </div>
             <div className="cta-section__trust-divider"></div>
             <div className="cta-section__trust-item">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <rect x="2" y="5" width="10" height="8" rx="1"
                   stroke="currentColor" strokeWidth="1"/>
                 <path d="M5 5V3.5a2 2 0 014 0V5"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinecap="round"/>
               </svg>
               Rooms 100% privées
             </div>
             <div className="cta-section__trust-divider"></div>
             <div className="cta-section__trust-item">
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <circle cx="7" cy="7" r="6"
                   stroke="currentColor" strokeWidth="1"/>
                 <path d="M4 7l2 2 4-4"
                   stroke="currentColor" strokeWidth="1"
                   strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
               Transactions hors plateforme
             </div>
           </div>
   
         </div>
       </section>
     )
   }