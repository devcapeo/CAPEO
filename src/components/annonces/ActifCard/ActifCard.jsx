/* ============================================
   CAPEO — ACTIF CARD V2
   Avec vraies photos. Plus grande. Plus aérée.
   ============================================ */

   import { useEffect, useRef } from 'react'
   import { Link } from 'react-router-dom'
   import './ActifCard.css'
   
   export default function ActifCard({ actif, index = 0 }) {
     const cardRef = useRef(null)
   
     useEffect(() => {
       const observer = new IntersectionObserver(
         (entries) => {
           entries.forEach((entry) => {
             if (entry.isIntersecting) {
               setTimeout(() => {
                 entry.target.classList.add('visible')
               }, index * 80)
               observer.unobserve(entry.target)
             }
           })
         },
         { threshold: 0.1 }
       )
       if (cardRef.current) observer.observe(cardRef.current)
       return () => observer.disconnect()
     }, [index])
   
     return (
       <Link
         to={`/actifs/${actif.id}`}
         className="actif-card reveal"
         ref={cardRef}
       >
         {/* ── IMAGE ── */}
         <div className="actif-card__img">
           {actif.image ? (
             <img
               src={actif.image}
               alt={actif.title}
               className="actif-card__img-photo"
               loading="lazy"
             />
           ) : (
             <div className={`actif-card__img-bg actif-card__img-bg--${actif.category.toLowerCase().replace(' ', '-')}`}></div>
           )}
   
           {/* Overlay gradient */}
           <div className="actif-card__img-overlay"></div>
   
           {/* Badges sur image */}
           <div className="actif-card__img-top">
             <div className="actif-card__cat-badge">{actif.category}</div>
             {actif.premium && (
               <div className="actif-card__premium-badge">
                 <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                   <path d="M4 1l.8 2.4H7L5.2 5l.8 2.4L4 6l-2 1.4L2.8 5 1 3.4h2.2z"
                     stroke="currentColor" strokeWidth="0.6"
                     strokeLinejoin="round"/>
                 </svg>
                 Premium
               </div>
             )}
           </div>
   
           {/* Tag bas gauche */}
           {actif.tag && (
             <div className="actif-card__tag">{actif.tag}</div>
           )}
   
           {/* Badge vérifié */}
           {actif.verified && (
             <div className="actif-card__verified">
               <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                 <path d="M1.5 4l2 2 3-3"
                   stroke="currentColor" strokeWidth="1.2"
                   strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
               Vérifié
             </div>
           )}
         </div>
   
         {/* ── CORPS ── */}
         <div className="actif-card__body">
           <div className="actif-card__title">{actif.title}</div>
   
           <div className="actif-card__meta">
             <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
               <circle cx="5" cy="4" r="2"
                 stroke="currentColor" strokeWidth="1"/>
               <path d="M5 9C3 7 1.5 5.5 1.5 4a3.5 3.5 0 017 0C8.5 5.5 7 7 5 9z"
                 stroke="currentColor" strokeWidth="1"/>
             </svg>
             {actif.location}
             {actif.details && (
               <>
                 <span className="actif-card__meta-sep">·</span>
                 {actif.details}
               </>
             )}
           </div>
   
           <div className="actif-card__price">{actif.priceDisplay}</div>
   
           <div className="actif-card__footer">
             <div className="actif-card__interests">
               <span className="pulse-dot"></span>
               <strong>{actif.interests}</strong> intéressés
             </div>
             <div className="actif-card__arrow">
               Voir →
             </div>
           </div>
         </div>
       </Link>
     )
   }