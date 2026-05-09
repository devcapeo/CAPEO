/* ============================================
   CAPEO — CATEGORY GRID V2
   Emojis remplacés par SVG fins et élégants.
   Hiérarchie visuelle corrigée.
   Design finance premium.
   ============================================ */

   import { useEffect, useRef } from 'react'
   import { Link } from 'react-router-dom'
   import './CategoryGrid.css'
   
   const CATEGORIES = [
     {
       id: 'immobilier',
       slug: '/actifs?categorie=immobilier',
       label: 'Immobilier',
       desc: 'Appartements, immeubles, locaux commerciaux, terrains, forêts.',
       items: ['Appartements', 'Immeubles de rapport', 'Locaux commerciaux', 'Terrains'],
       icon: (
         <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
           <path d="M2 30h28" stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
           <rect x="6" y="14" width="20" height="16" rx="1"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M1 16L16 4L31 16"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round" strokeLinejoin="round"/>
           <rect x="12" y="20" width="8" height="10" rx="1"
             stroke="currentColor" strokeWidth="1"/>
           <rect x="8" y="18" width="5" height="5" rx="0.5"
             stroke="currentColor" strokeWidth="0.8"/>
           <rect x="19" y="18" width="5" height="5" rx="0.5"
             stroke="currentColor" strokeWidth="0.8"/>
         </svg>
       ),
     },
     {
       id: 'entreprises',
       slug: '/actifs?categorie=entreprises',
       label: 'Entreprises',
       desc: 'Fonds de commerce, cessions de sociétés, SCI, franchises.',
       items: ['Fonds de commerce', 'Cessions de sociétés', 'SCI existantes', 'Franchises'],
       icon: (
         <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
           <rect x="4" y="10" width="24" height="20" rx="1"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M4 18h24" stroke="currentColor" strokeWidth="1"/>
           <path d="M11 10V7a5 5 0 0110 0v3"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
           <circle cx="16" cy="22" r="3"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M13 22h-3M19 22h3"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
         </svg>
       ),
     },
     {
       id: 'objets-rares',
       slug: '/actifs?categorie=objets-rares',
       label: 'Objets rares',
       desc: 'Montres, œuvres d\'art, véhicules de collection, vins, bijoux.',
       items: ['Haute horlogerie', 'Œuvres d\'art', 'Véhicules de collection', 'Vins & spiritueux'],
       icon: (
         <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
           <circle cx="16" cy="16" r="11"
             stroke="currentColor" strokeWidth="1"/>
           <circle cx="16" cy="16" r="6"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M16 5v4M16 23v4M5 16h4M23 16h4"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
           <path d="M16 13v3l2 2"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round" strokeLinejoin="round"/>
         </svg>
       ),
     },
     {
       id: 'atypiques',
       slug: '/actifs?categorie=atypiques',
       label: 'Atypiques',
       desc: 'Droits d\'exploitation, brevets, actifs en port franc, projets.',
       items: ['Port franc', 'Brevets', 'Droits miniers', 'Projets énergétiques'],
       icon: (
         <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
           <circle cx="16" cy="16" r="12"
             stroke="currentColor" strokeWidth="1"/>
           <path d="M4 16h24" stroke="currentColor" strokeWidth="1"/>
           <path d="M16 4c-4 4-6 8-6 12s2 8 6 12"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
           <path d="M16 4c4 4 6 8 6 12s-2 8-6 12"
             stroke="currentColor" strokeWidth="1"
             strokeLinecap="round"/>
           <circle cx="16" cy="16" r="2"
             stroke="currentColor" strokeWidth="1"/>
         </svg>
       ),
     },
   ]
   
   export default function CategoryGrid() {
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
         { threshold: 0.1 }
       )
       const reveals = sectionRef.current?.querySelectorAll('.reveal')
       reveals?.forEach((el) => observer.observe(el))
       return () => observer.disconnect()
     }, [])
   
     return (
       <section className="categories" ref={sectionRef}>
         <div className="container">
   
           {/* En-tête */}
           <div className="categories__header reveal">
             <div className="section-label">Catégories</div>
             <h2 className="categories__title">
               Tous types d'actifs,<br/>
               <em>une seule plateforme.</em>
             </h2>
             <p className="categories__sub">
               De l'immobilier aux objets rares — CAPEO centralise
               les actifs que vous ne trouvez pas ailleurs.
             </p>
           </div>
   
           {/* Grille */}
           <div className="categories__grid">
             {CATEGORIES.map((cat, index) => (
               <Link
                 to={cat.slug}
                 key={cat.id}
                 className={`cat-card reveal reveal-delay-${index + 1}`}
               >
                 {/* Fond décoratif */}
                 <div className="cat-card__glow"></div>
   
                 {/* Icône */}
                 <div className="cat-card__icon">
                   {cat.icon}
                 </div>
   
                 {/* Contenu */}
                 <div className="cat-card__label">{cat.label}</div>
                 <div className="cat-card__desc">{cat.desc}</div>
   
                 {/* Items */}
                 <ul className="cat-card__items">
                   {cat.items.map((item) => (
                     <li key={item}>{item}</li>
                   ))}
                 </ul>
   
                 {/* Flèche */}
                 <div className="cat-card__footer">
                   <span className="cat-card__explore">Explorer</span>
                   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                     <path d="M2 7h10M8 3l4 4-4 4"
                       stroke="currentColor" strokeWidth="1.2"
                       strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
   
               </Link>
             ))}
           </div>
   
           {/* Footer */}
           <div className="categories__footer reveal">
             <Link to="/actifs" className="categories__all">
               Voir tous les actifs disponibles
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                 <path d="M2 7h10M8 3l4 4-4 4"
                   stroke="currentColor" strokeWidth="1.2"
                   strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </Link>
           </div>
   
         </div>
       </section>
     )
   }