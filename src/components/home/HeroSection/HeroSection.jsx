/* ============================================
   CAPEO — HERO SECTION V2
   Hero splitté : gauche = accroche,
   droite = carte actif flottante animée.
   Design finance premium 2030.
   ============================================ */

   import { useEffect, useRef } from 'react'
   import { Link } from 'react-router-dom'
   import './HeroSection.css'
   
   export default function HeroSection() {
     const heroRef = useRef(null)
   
     useEffect(() => {
       const handleScroll = () => {
         if (!heroRef.current) return
         const scrollY = window.scrollY
         const card = heroRef.current.querySelector('.hero__card')
         if (card) card.style.transform =
           `translateY(${-scrollY * 0.08}px) rotate(2deg)`
       }
       window.addEventListener('scroll', handleScroll, { passive: true })
       return () => window.removeEventListener('scroll', handleScroll)
     }, [])
   
     return (
       <section className="hero" ref={heroRef}>
   
         {/* ── FONDS ── */}
         <div className="hero__bg"></div>
         <div className="hero__grid"></div>
         <div className="hero__orb hero__orb--1"></div>
         <div className="hero__orb hero__orb--2"></div>
         <div className="hero__orb hero__orb--3"></div>
   
         <div className="hero__inner container">
   
           {/* ── GAUCHE — ACCROCHE ── */}
           <div className="hero__left">
   
             <div className="hero__eyebrow">
               <span className="hero__eyebrow-dot"></span>
               Place de marché d'actifs premium
             </div>
   
             <h1 className="hero__title">
               Les actifs<br/>
               d'exception,<br/>
               <em>enfin accessibles.</em>
             </h1>
   
             <p className="hero__sub">
               CAPEO connecte vendeurs et acquéreurs autour
               d'actifs réels. Publiez gratuitement.
               Rejoignez une room. Acquisitions à plusieurs.
             </p>
   
             <div className="hero__actions">
               <Link to="/actifs" className="hero__btn-primary">
                 Explorer les actifs
               </Link>
               <Link to="/comment-ca-marche" className="hero__btn-ghost">
                 Comment ça marche
               </Link>
             </div>
   
             {/* Stats */}
             <div className="hero__stats">
               <div className="hero__stat">
                 <div className="hero__stat-value">0%</div>
                 <div className="hero__stat-label">Commission</div>
               </div>
               <div className="hero__stat-sep"></div>
               <div className="hero__stat">
                 <div className="hero__stat-value">Gratuit</div>
                 <div className="hero__stat-label">Vendeurs</div>
               </div>
               <div className="hero__stat-sep"></div>
               <div className="hero__stat">
                 <div className="hero__stat-value">100%</div>
                 <div className="hero__stat-label">Privé</div>
               </div>
             </div>
   
           </div>
   
           {/* ── DROITE — CARTE FLOTTANTE ── */}
           <div className="hero__right">
   
             {/* Carte principale */}
             <div className="hero__card">
   
               <div className="hero__card-top">
                 <div className="hero__card-badge">
                   <span className="hero__card-badge-dot"></span>
                   Vérifié CAPEO
                 </div>
                 <div className="hero__card-tag">Off Market</div>
               </div>
   
               <div className="hero__card-img">
                 <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                   <rect x="8" y="24" width="48" height="34" rx="2"
                     stroke="currentColor" strokeWidth="1"/>
                   <path d="M2 26L32 6L62 26"
                     stroke="currentColor" strokeWidth="1"
                     strokeLinecap="round"/>
                   <rect x="22" y="38" width="20" height="20" rx="1"
                     stroke="currentColor" strokeWidth="1"/>
                   <rect x="14" y="32" width="8" height="8" rx="1"
                     stroke="currentColor" strokeWidth="0.8"/>
                   <rect x="42" y="32" width="8" height="8" rx="1"
                     stroke="currentColor" strokeWidth="0.8"/>
                 </svg>
               </div>
   
               <div className="hero__card-body">
                 <div className="hero__card-cat">Immobilier · Lyon</div>
                 <div className="hero__card-title">
                   Immeuble de rapport<br/>Centre historique
                 </div>
                 <div className="hero__card-price">1 250 000 €</div>
   
                 <div className="hero__card-progress">
                   <div className="hero__card-progress-labels">
                     <span>Intentions déclarées</span>
                     <span>74%</span>
                   </div>
                   <div className="hero__card-progress-bar">
                     <div className="hero__card-progress-fill"></div>
                   </div>
                 </div>
   
                 <div className="hero__card-footer">
                   <div className="hero__card-users">
                     <div className="hero__card-avatars">
                       <div className="hero__card-avatar">M</div>
                       <div className="hero__card-avatar">S</div>
                       <div className="hero__card-avatar">T</div>
                     </div>
                     <span>14 intéressés</span>
                   </div>
                   <div className="hero__card-cta">Voir →</div>
                 </div>
               </div>
   
             </div>
   
             {/* Carte secondaire flottante */}
             <div className="hero__card-mini">
               <div className="hero__card-mini-icon">💎</div>
               <div>
                 <div className="hero__card-mini-title">
                   Collection montres
                 </div>
                 <div className="hero__card-mini-price">220 000 €</div>
               </div>
               <div className="hero__card-mini-badge">
                 <span className="hero__card-badge-dot"></span>
                 Room ouverte
               </div>
             </div>
   
             {/* Indicateur room active */}
             <div className="hero__room-indicator">
               <div className="hero__room-indicator-dot"></div>
               <span>3 rooms actives en ce moment</span>
             </div>
   
           </div>
   
         </div>
   
         {/* Scroll indicator */}
         <div className="hero__scroll">
           <span>Défiler</span>
           <div className="hero__scroll-line"></div>
         </div>
   
       </section>
     )
   }