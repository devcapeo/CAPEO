/* ============================================
   CAPEO — FEATURED ACTIFS
   Section annonces vedettes sur la Home.
   3 actifs mis en avant avec carte premium.
   Badge vérifié, catégorie, prix, intérêts.
   Données statiques en attendant Supabase.
   ============================================ */

   import { useEffect, useRef } from 'react'
   import { Link } from 'react-router-dom'
   import './FeaturedActifs.css'
   
   const FEATURED = [
     {
       id: '1',
       category: 'Immobilier',
       categorySlug: 'immobilier',
       title: 'Immeuble de rapport — Centre historique',
       location: 'Lyon 2ème · 6 lots · 480 m²',
       price: '1 250 000 €',
       interests: 14,
       verified: true,
       badge: 'Vérifié CAPEO',
       tag: 'Off Market',
     },
     {
       id: '2',
       category: 'Entreprise',
       categorySlug: 'entreprises',
       title: 'Restaurant gastronomique en activité',
       location: 'Paris 8ème · 45 couverts · 12 ans',
       price: '380 000 €',
       interests: 8,
       verified: true,
       badge: 'Vérifié CAPEO',
       tag: null,
     },
     {
       id: '3',
       category: 'Objet rare',
       categorySlug: 'objets-rares',
       title: 'Collection montres haute horlogerie',
       location: '8 pièces · Patek Philippe, AP, Rolex',
       price: '220 000 €',
       interests: 23,
       verified: true,
       badge: 'Vérifié CAPEO',
       tag: 'Port franc Genève',
     },
   ]
   
   export default function FeaturedActifs() {
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
       <section className="featured" ref={sectionRef}>
         <div className="container">
   
           {/* En-tête */}
           <div className="featured__header reveal">
             <div className="section-label">Sélection</div>
             <h2 className="featured__title">
               Actifs en vedette
             </h2>
             <p className="featured__sub">
               Des annonces publiées par des vendeurs vérifiés.
               Les informations présentées sont fournies exclusivement par les vendeurs.
             </p>
           </div>
   
           {/* Grille de cartes */}
           <div className="featured__grid">
             {FEATURED.map((actif, index) => (
               <Link
                 to={`/actifs/${actif.id}`}
                 key={actif.id}
                 className={`actif-card reveal reveal-delay-${index + 1}`}
               >
                 {/* Image placeholder */}
                 <div className="actif-card__img">
                   <div className="actif-card__img-placeholder">
                     {actif.category === 'Immobilier' && (
                       <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                         <rect x="6" y="20" width="36" height="24" rx="2"
                           stroke="currentColor" strokeWidth="1.2"/>
                         <path d="M2 22L24 6L46 22"
                           stroke="currentColor" strokeWidth="1.2"
                           strokeLinecap="round"/>
                         <rect x="18" y="30" width="12" height="14" rx="1"
                           stroke="currentColor" strokeWidth="1.2"/>
                       </svg>
                     )}
                     {actif.category === 'Entreprise' && (
                       <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                         <rect x="8" y="14" width="32" height="28" rx="2"
                           stroke="currentColor" strokeWidth="1.2"/>
                         <path d="M8 24H40"
                           stroke="currentColor" strokeWidth="1.2"/>
                         <circle cx="24" cy="35" r="5"
                           stroke="currentColor" strokeWidth="1.2"/>
                       </svg>
                     )}
                     {actif.category === 'Objet rare' && (
                       <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                         <circle cx="24" cy="24" r="16"
                           stroke="currentColor" strokeWidth="1.2"/>
                         <circle cx="24" cy="24" r="9"
                           stroke="currentColor" strokeWidth="1.2"/>
                         <circle cx="24" cy="24" r="3"
                           fill="currentColor" opacity="0.4"/>
                       </svg>
                     )}
                   </div>
   
                   {/* Badges sur l'image */}
                   <div className="actif-card__category">
                     {actif.category}
                   </div>
                   {actif.verified && (
                     <div className="actif-card__verified">
                       <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                         <path d="M2 5l2 2 4-4"
                           stroke="currentColor"
                           strokeWidth="1.2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                         />
                       </svg>
                       {actif.badge}
                     </div>
                   )}
                   {actif.tag && (
                     <div className="actif-card__tag">{actif.tag}</div>
                   )}
                 </div>
   
                 {/* Corps de la carte */}
                 <div className="actif-card__body">
                   <div className="actif-card__title">{actif.title}</div>
                   <div className="actif-card__location">{actif.location}</div>
                   <div className="actif-card__price">{actif.price}</div>
   
                   <div className="actif-card__footer">
                     <div className="actif-card__interests">
                       <span className="pulse-dot"></span>
                       <strong>{actif.interests}</strong> personnes intéressées
                     </div>
                     <div className="actif-card__cta">
                       Voir l'actif →
                     </div>
                   </div>
                 </div>
   
               </Link>
             ))}
           </div>
   
           {/* Disclaimer légal */}
           <div className="featured__disclaimer reveal">
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
               <path d="M6 1L11 10H1L6 1Z"
                 stroke="currentColor" strokeWidth="1"
                 strokeLinejoin="round"/>
               <path d="M6 4.5V7"
                 stroke="currentColor" strokeWidth="1"
                 strokeLinecap="round"/>
               <circle cx="6" cy="8.5" r="0.5" fill="currentColor"/>
             </svg>
             <p>
               Les informations affichées sont fournies exclusivement par les vendeurs.
               CAPEO ne les vérifie pas et ne formule aucun conseil d'acquisition.
             </p>
           </div>
   
           {/* Lien voir tout */}
           <div className="featured__footer reveal">
             <Link to="/actifs" className="featured__all">
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