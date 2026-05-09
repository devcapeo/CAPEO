/* ============================================
   CAPEO — PAGE OFF MARKET
   Actifs exclusifs non listés ailleurs.
   Accès réservé aux abonnés premium.
   Les non-abonnés voient les titres mais
   pas les détails — cadenas visible.
   ============================================ */

   import { useState, useEffect, useRef } from 'react'
   import { Link } from 'react-router-dom'
   import './OffMarket.css'
   
   const OFFMARKET_MOCK = [
     {
       id: 'om1',
       category: 'Immobilier',
       title: 'Hôtel particulier — Île Saint-Louis',
       location: 'Paris 4ème',
       price: 'Prix sur demande',
       teaser: 'Bien d\'exception non listé. 8 pièces, 420m², terrasse privative.',
       interests: 7,
       locked: true,
     },
     {
       id: 'om2',
       category: 'Objet rare',
       title: 'Collection tableaux maîtres — Port franc Genève',
       location: 'Genève · Port franc',
       price: 'Prix sur demande',
       teaser: '4 œuvres majeures stockées en port franc. Certificats d\'authenticité.',
       interests: 12,
       locked: true,
     },
     {
       id: 'om3',
       category: 'Entreprise',
       title: 'Groupe hôtelier — Côte d\'Azur',
       location: 'Alpes-Maritimes',
       price: 'Prix sur demande',
       teaser: '3 établissements 4 étoiles. Cession discrète hors agence.',
       interests: 5,
       locked: true,
     },
     {
       id: 'om4',
       category: 'Immobilier',
       title: 'Vignoble AOC — Saint-Émilion',
       location: 'Gironde · 18 hectares',
       price: 'Prix sur demande',
       teaser: 'Domaine viticole en production. Château XVIIIème inclus.',
       interests: 9,
       locked: true,
     },
   ]
   
   // Simulation — false = non abonné, true = abonné premium
   const IS_PREMIUM = false
   
   export default function OffMarket() {
     const sectionRef = useRef(null)
     const [isPremium] = useState(IS_PREMIUM)
   
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
         { threshold: 0.1 }
       )
       const reveals = sectionRef.current?.querySelectorAll('.reveal')
       reveals?.forEach((el) => observer.observe(el))
       return () => observer.disconnect()
     }, [])
   
     return (
       <div className="offmarket-page" ref={sectionRef}>
   
         {/* ── EN-TÊTE ── */}
         <div className="offmarket-page__header">
           <div className="container">
             <div className="offmarket-page__header-inner">
               <div>
                 <div className="section-label">Exclusif</div>
                 <h1 className="offmarket-page__title reveal">
                   Off Market
                 </h1>
                 <p className="offmarket-page__sub reveal">
                   Des actifs qui ne sont nulle part ailleurs.
                   Disponibles uniquement pour les membres premium.
                 </p>
               </div>
               <div className="offmarket-page__lock-icon reveal">
                 <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                   <rect x="6" y="14" width="20" height="16" rx="2"
                     stroke="currentColor" strokeWidth="1.2"/>
                   <path d="M10 14V10a6 6 0 0112 0v4"
                     stroke="currentColor" strokeWidth="1.2"
                     strokeLinecap="round"/>
                   <circle cx="16" cy="22" r="2.5"
                     fill="currentColor" opacity="0.6"/>
                 </svg>
               </div>
             </div>
           </div>
         </div>
   
         <div className="container">
   
           {/* ── BANNER PREMIUM si non abonné ── */}
           {!isPremium && (
             <div className="offmarket-banner reveal">
               <div className="offmarket-banner__content">
                 <div className="offmarket-banner__icon">
                   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                     <path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6z"
                       stroke="currentColor" strokeWidth="1.2"
                       strokeLinejoin="round"/>
                   </svg>
                 </div>
                 <div>
                   <div className="offmarket-banner__title">
                     Accès Premium requis
                   </div>
                   <p className="offmarket-banner__desc">
                     Les actifs off market sont réservés aux membres premium.
                     Abonnez-vous pour accéder aux détails et rejoindre les rooms.
                   </p>
                 </div>
               </div>
               <Link to="/inscription" className="offmarket-banner__btn">
                 Devenir Premium — 19,90€/mois
               </Link>
             </div>
           )}
   
           {/* ── GRILLE ── */}
           <div className="offmarket-grid">
             {OFFMARKET_MOCK.map((actif, index) => (
               <div
                 key={actif.id}
                 className={`offmarket-card reveal reveal-delay-${index + 1}`}
               >
                 {/* Image */}
                 <div className="offmarket-card__img">
                   <div className={`offmarket-card__img-bg offmarket-card__img-bg--${index % 2 === 0 ? 'a' : 'b'}`}></div>
   
                   {/* Cadenas si non premium */}
                   {!isPremium && actif.locked && (
                     <div className="offmarket-card__lock">
                       <div className="offmarket-card__lock-icon">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                           <rect x="4" y="11" width="16" height="12" rx="2"
                             stroke="currentColor" strokeWidth="1.2"/>
                           <path d="M8 11V7a4 4 0 018 0v4"
                             stroke="currentColor" strokeWidth="1.2"
                             strokeLinecap="round"/>
                           <circle cx="12" cy="17" r="2"
                             fill="currentColor" opacity="0.6"/>
                         </svg>
                       </div>
                       <div className="offmarket-card__lock-text">
                         Premium uniquement
                       </div>
                     </div>
                   )}
   
                   <div className="offmarket-card__badges">
                     <div className="offmarket-card__cat">
                       {actif.category}
                     </div>
                     <div className="offmarket-card__exclusive">
                       Off Market
                     </div>
                   </div>
                 </div>
   
                 {/* Corps */}
                 <div className="offmarket-card__body">
                   <div className="offmarket-card__title">
                     {actif.title}
                   </div>
   
                   <div className="offmarket-card__location">
                     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                       <circle cx="5" cy="4" r="2"
                         stroke="currentColor" strokeWidth="1"/>
                       <path d="M5 9C3 7 1.5 5.5 1.5 4a3.5 3.5 0 017 0C8.5 5.5 7 7 5 9z"
                         stroke="currentColor" strokeWidth="1"/>
                     </svg>
                     {actif.location}
                   </div>
   
                   {/* Teaser flou si non premium */}
                   <div className={`offmarket-card__teaser ${!isPremium ? 'offmarket-card__teaser--blurred' : ''}`}>
                     {actif.teaser}
                   </div>
   
                   <div className="offmarket-card__price">
                     {isPremium ? actif.price : '••••••••••'}
                   </div>
   
                   <div className="offmarket-card__footer">
                     <div className="offmarket-card__interests">
                       <span className="pulse-dot"></span>
                       <strong>{actif.interests}</strong> intéressés
                     </div>
   
                     {isPremium ? (
                       <Link
                         to={`/actifs/${actif.id}`}
                         className="offmarket-card__cta"
                       >
                         Voir l'actif →
                       </Link>
                     ) : (
                       <Link
                         to="/inscription"
                         className="offmarket-card__cta offmarket-card__cta--locked"
                       >
                         <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                           <rect x="2" y="5" width="6" height="5" rx="1"
                             stroke="currentColor" strokeWidth="1"/>
                           <path d="M3.5 5V3.5a1.5 1.5 0 013 0V5"
                             stroke="currentColor" strokeWidth="1"
                             strokeLinecap="round"/>
                         </svg>
                         Accès Premium
                       </Link>
                     )}
                   </div>
                 </div>
   
               </div>
             ))}
           </div>
   
           {/* ── CTA ABONNEMENT ── */}
           {!isPremium && (
             <div className="offmarket-cta reveal">
               <div className="offmarket-cta__content">
                 <h2 className="offmarket-cta__title">
                   Accédez à tous les actifs<br/>
                   <em>hors marché.</em>
                 </h2>
                 <p className="offmarket-cta__desc">
                   19,90€/mois. Rooms illimitées, alertes personnalisées,
                   profil patrimoine privé et accès complet au off market.
                 </p>
                 <Link to="/inscription" className="offmarket-cta__btn">
                   Démarrer Premium
                 </Link>
               </div>
             </div>
           )}
   
         </div>
       </div>
     )
   }