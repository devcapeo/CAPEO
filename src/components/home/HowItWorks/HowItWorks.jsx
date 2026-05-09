/* ============================================
   CAPEO — HOW IT WORKS
   Section "Comment ça marche" sur la Home.
   4 étapes : Publication → Visibilité →
   Room → Transaction.
   Ligne de progression entre les étapes.
   ============================================ */

   import { useEffect, useRef } from 'react'
   import { Link } from 'react-router-dom'
   import './HowItWorks.css'
   
   const STEPS = [
     {
       num: '01',
       title: 'Publication',
       desc: 'Le vendeur publie son actif gratuitement — photos, description, prix, documents. Il uploade une pièce justificative pour obtenir le badge Vérifié CAPEO.',
       icon: (
         <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
           <rect x="4" y="4" width="20" height="20" rx="2"
             stroke="currentColor" strokeWidth="1.2"/>
           <path d="M9 14h10M9 9h6M9 19h8"
             stroke="currentColor" strokeWidth="1.2"
             strokeLinecap="round"/>
         </svg>
       ),
     },
     {
       num: '02',
       title: 'Visibilité',
       desc: 'L\'annonce est diffusée auprès d\'acquéreurs qualifiés. Les abonnés premium reçoivent une alerte personnalisée si l\'actif correspond à leur profil.',
       icon: (
         <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
           <circle cx="14" cy="14" r="10"
             stroke="currentColor" strokeWidth="1.2"/>
           <circle cx="14" cy="14" r="4"
             stroke="currentColor" strokeWidth="1.2"/>
           <path d="M14 4v4M14 20v4M4 14h4M20 14h4"
             stroke="currentColor" strokeWidth="1.2"
             strokeLinecap="round"/>
         </svg>
       ),
     },
     {
       num: '03',
       title: 'La Room',
       desc: 'Les acquéreurs intéressés rejoignent une room privée autour de l\'actif. Ils discutent, déclarent leurs intentions d\'apport et choisissent leur structure d\'acquisition.',
       icon: (
         <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
           <rect x="3" y="6" width="22" height="16" rx="2"
             stroke="currentColor" strokeWidth="1.2"/>
           <path d="M8 22l2-4M20 22l-2-4"
             stroke="currentColor" strokeWidth="1.2"
             strokeLinecap="round"/>
           <circle cx="10" cy="13" r="2"
             stroke="currentColor" strokeWidth="1.2"/>
           <circle cx="18" cy="13" r="2"
             stroke="currentColor" strokeWidth="1.2"/>
           <path d="M12 13h4"
             stroke="currentColor" strokeWidth="1.2"
             strokeLinecap="round"/>
         </svg>
       ),
     },
     {
       num: '04',
       title: 'Transaction',
       desc: 'Vendeur et acquéreurs organisent librement la suite hors plateforme — devant notaire, en SCI ou en indivision. CAPEO ne participe pas à la transaction.',
       icon: (
         <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
           <path d="M6 14l5 5 11-11"
             stroke="currentColor" strokeWidth="1.2"
             strokeLinecap="round" strokeLinejoin="round"/>
           <circle cx="14" cy="14" r="10"
             stroke="currentColor" strokeWidth="1.2"/>
         </svg>
       ),
     },
   ]
   
   export default function HowItWorks() {
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
       <section className="how" ref={sectionRef}>
         <div className="container">
   
           {/* En-tête */}
           <div className="how__header reveal">
             <div className="section-label">Processus</div>
             <h2 className="how__title">
               Comment fonctionne<br/>
               <em>CAPEO</em>
             </h2>
             <p className="how__sub">
               Une mécanique simple et transparente.
               CAPEO facilite la rencontre — la transaction reste entre vous.
             </p>
           </div>
   
           {/* Étapes */}
           <div className="how__steps">
             {STEPS.map((step, index) => (
               <div
                 key={step.num}
                 className={`how__step reveal reveal-delay-${index + 1}`}
               >
                 {/* Numéro + icône */}
                 <div className="how__step-top">
                   <div className="how__step-num">{step.num}</div>
                   <div className="how__step-icon">{step.icon}</div>
                 </div>
   
                 {/* Contenu */}
                 <div className="how__step-title">{step.title}</div>
                 <div className="how__step-desc">{step.desc}</div>
   
                 {/* Flèche entre étapes sauf la dernière */}
                 {index < STEPS.length - 1 && (
                   <div className="how__step-arrow">
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                       <path d="M3 8h10M9 4l4 4-4 4"
                         stroke="currentColor" strokeWidth="1.2"
                         strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </div>
                 )}
               </div>
             ))}
           </div>
   
           {/* Note légale */}
           <div className="how__legal reveal">
             <div className="how__legal-dot"></div>
             <p>
               CAPEO est une plateforme de mise en relation.
               Aucun flux financier ne transite par CAPEO.
               La transaction se formalise hors plateforme, entre les parties.
             </p>
           </div>
   
           {/* CTA */}
           <div className="how__cta reveal">
             <Link to="/comment-ca-marche" className="how__cta-link">
               En savoir plus sur le fonctionnement
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