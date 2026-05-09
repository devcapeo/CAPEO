/* ============================================
   CAPEO — PAGE COMMENT ÇA MARCHE
   Explication complète du fonctionnement.
   Processus vendeur + acquéreur.
   FAQ + disclaimer légal.
   ============================================ */

   import { useState, useEffect, useRef } from 'react'
   import { Link } from 'react-router-dom'
   import './CommentCaMarche.css'
   
   const STEPS_SELLER = [
     {
       num: '01',
       title: 'Publiez gratuitement',
       desc: 'Créez votre annonce en quelques minutes. Photos, description, prix. Entièrement gratuit, sans commission.',
     },
     {
       num: '02',
       title: 'Uploadez un document',
       desc: 'Titre de propriété, Kbis, certificat d\'authenticité. Notre équipe vérifie sous 24h et vous attribue le badge Vérifié CAPEO.',
     },
     {
       num: '03',
       title: 'Accédez aux acquéreurs',
       desc: 'Votre actif est visible auprès d\'acquéreurs qualifiés et vérifiés. Vous recevez leurs messages directement dans la room.',
     },
     {
       num: '04',
       title: 'Finalisez hors plateforme',
       desc: 'La transaction se formalise entre vous et les acquéreurs, devant notaire ou par tout autre moyen légal. CAPEO n\'intervient pas.',
     },
   ]
   
   const STEPS_BUYER = [
     {
       num: '01',
       title: 'Explorez les actifs',
       desc: 'Consultez librement toutes les annonces. Filtrez par catégorie, prix, localisation. Accès gratuit sans inscription.',
     },
     {
       num: '02',
       title: 'Rejoignez une room',
       desc: 'Vous payez 15€ pour accéder à la room privée autour d\'un actif, ou souscrivez au Premium pour un accès illimité.',
     },
     {
       num: '03',
       title: 'Coordonnez-vous',
       desc: 'Discutez avec le vendeur et les autres acquéreurs. Déclarez votre intention d\'apport. Choisissez votre structure (SCI, nom propre...).',
     },
     {
       num: '04',
       title: 'Passez à l\'acte',
       desc: 'Une fois le groupe constitué, organisez la transaction hors plateforme avec votre notaire. CAPEO vous a mis en contact.',
     },
   ]
   
   const FAQ = [
     {
       q: 'CAPEO prend-il une commission sur les transactions ?',
       a: 'Non. CAPEO ne prend aucune commission sur les transactions. Vous payez uniquement pour la visibilité (vendeur) ou l\'accès aux rooms et aux fonctionnalités premium (acquéreur).',
     },
     {
       q: 'Les montants déclarés dans la room sont-ils contractuels ?',
       a: 'Non. Les intentions d\'apport déclarées dans la room sont purement déclaratives et non contractuelles. Elles n\'engagent aucun versement. La transaction se formalise hors CAPEO, devant notaire.',
     },
     {
       q: 'Comment CAPEO vérifie-t-il les vendeurs ?',
       a: 'Chaque vendeur uploade un document justificatif (titre de propriété, Kbis, certificat d\'authenticité...). Notre équipe le vérifie manuellement sous 24h. Le badge Vérifié CAPEO est attribué après validation.',
     },
     {
       q: 'Que se passe-t-il si un actif ne correspond pas à la description ?',
       a: 'CAPEO fournit un espace de mise en relation mais ne garantit pas l\'exactitude des informations publiées par les vendeurs. En cas d\'annonce frauduleuse prouvée, l\'accès à la room vous est remboursé. Nous vous recommandons de toujours effectuer une due diligence avant toute acquisition.',
     },
     {
       q: 'Qu\'est-ce que le Off Market ?',
       a: 'Le Off Market regroupe des actifs exclusifs non listés sur d\'autres plateformes. Biens immobiliers avant mise sur le marché, cessions discrètes, œuvres en port franc. Accessible uniquement aux abonnés Premium.',
     },
     {
       q: 'CAPEO est-il régulé par l\'AMF ?',
       a: 'CAPEO est une plateforme de mise en relation technique au sens du règlement européen 2019/1150. Aucun flux financier ne transite par CAPEO. Nous ne sommes pas un prestataire de services de financement participatif (PSFP) et n\'agissons pas comme intermédiaire financier.',
     },
   ]
   
   export default function CommentCaMarche() {
     const [openFaq, setOpenFaq] = useState(null)
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
       <div className="ccm-page" ref={sectionRef}>
   
         {/* ── HERO ── */}
         <div className="ccm-hero">
           <div className="container">
             <div className="section-label reveal">Fonctionnement</div>
             <h1 className="ccm-hero__title reveal">
               Comment fonctionne<br/>
               <em>CAPEO</em>
             </h1>
             <p className="ccm-hero__sub reveal">
               Une mécanique simple et transparente.
               CAPEO facilite la rencontre entre vendeurs et acquéreurs.
               La transaction reste entre vous.
             </p>
           </div>
         </div>
   
         {/* ── VENDEUR ── */}
         <div className="ccm-section">
           <div className="container">
             <div className="ccm-section__header reveal">
               <div className="ccm-section__role ccm-section__role--seller">
                 Vendeur
               </div>
               <h2 className="ccm-section__title">
                 Publiez votre actif.<br/>
                 <em>Gratuitement.</em>
               </h2>
               <p className="ccm-section__sub">
                 Aucune commission. Aucun frais caché.
                 Vous payez uniquement si vous choisissez de booster
                 la visibilité de votre annonce.
               </p>
             </div>
   
             <div className="ccm-steps">
               {STEPS_SELLER.map((step, index) => (
                 <div
                   key={step.num}
                   className={`ccm-step reveal reveal-delay-${index + 1}`}
                 >
                   <div className="ccm-step__num">{step.num}</div>
                   <div className="ccm-step__content">
                     <div className="ccm-step__title">{step.title}</div>
                     <div className="ccm-step__desc">{step.desc}</div>
                   </div>
                   {index < STEPS_SELLER.length - 1 && (
                     <div className="ccm-step__arrow">
                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                         <path d="M4 8h8M9 5l3 3-3 3"
                           stroke="currentColor" strokeWidth="1.2"
                           strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </div>
                   )}
                 </div>
               ))}
             </div>
   
             <div className="ccm-section__cta reveal">
               <Link to="/proposer-un-actif" className="ccm-btn-primary">
                 Proposer un actif
               </Link>
             </div>
           </div>
         </div>
   
         {/* ── ACQUÉREUR ── */}
         <div className="ccm-section ccm-section--buyer">
           <div className="container">
             <div className="ccm-section__header reveal">
               <div className="ccm-section__role ccm-section__role--buyer">
                 Acquéreur
               </div>
               <h2 className="ccm-section__title">
                 Trouvez votre actif.<br/>
                 <em>Organisez-vous à plusieurs.</em>
               </h2>
               <p className="ccm-section__sub">
                 Accédez à des actifs que vous ne trouvez pas ailleurs.
                 Coordinateur-vous avec d'autres acquéreurs pour accéder
                 à des biens plus importants.
               </p>
             </div>
   
             <div className="ccm-steps">
               {STEPS_BUYER.map((step, index) => (
                 <div
                   key={step.num}
                   className={`ccm-step reveal reveal-delay-${index + 1}`}
                 >
                   <div className="ccm-step__num">{step.num}</div>
                   <div className="ccm-step__content">
                     <div className="ccm-step__title">{step.title}</div>
                     <div className="ccm-step__desc">{step.desc}</div>
                   </div>
                   {index < STEPS_BUYER.length - 1 && (
                     <div className="ccm-step__arrow">
                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                         <path d="M4 8h8M9 5l3 3-3 3"
                           stroke="currentColor" strokeWidth="1.2"
                           strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </div>
                   )}
                 </div>
               ))}
             </div>
   
             <div className="ccm-section__cta reveal">
               <Link to="/actifs" className="ccm-btn-primary">
                 Explorer les actifs
               </Link>
               <Link to="/inscription" className="ccm-btn-ghost">
                 Créer un compte
               </Link>
             </div>
           </div>
         </div>
   
         {/* ── LÉGAL ── */}
         <div className="ccm-legal">
           <div className="container">
             <div className="ccm-legal__inner reveal">
               <div className="ccm-legal__icon">
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                   <path d="M10 2L18 16H2L10 2Z"
                     stroke="currentColor" strokeWidth="1.2"
                     strokeLinejoin="round"/>
                   <path d="M10 8v4"
                     stroke="currentColor" strokeWidth="1.2"
                     strokeLinecap="round"/>
                   <circle cx="10" cy="14" r="0.8"
                     fill="currentColor"/>
                 </svg>
               </div>
               <div>
                 <div className="ccm-legal__title">
                   Cadre légal CAPEO
                 </div>
                 <p className="ccm-legal__text">
                   CAPEO est une plateforme technique de mise en relation
                   au sens du règlement européen 2019/1150.
                   Aucun flux financier ne transite par CAPEO.
                   Les intentions déclarées dans les rooms sont non contractuelles.
                   CAPEO ne fournit aucun conseil en acquisition et ne garantit
                   aucune information publiée par les vendeurs.
                   La transaction se formalise intégralement hors plateforme,
                   entre les parties.
                 </p>
               </div>
             </div>
           </div>
         </div>
   
         {/* ── FAQ ── */}
         <div className="ccm-faq">
           <div className="container">
             <div className="ccm-faq__header reveal">
               <div className="section-label">FAQ</div>
               <h2 className="ccm-faq__title">
                 Questions fréquentes
               </h2>
             </div>
   
             <div className="ccm-faq__list">
               {FAQ.map((item, index) => (
                 <div
                   key={index}
                   className={`ccm-faq__item reveal reveal-delay-${(index % 3) + 1} ${openFaq === index ? 'ccm-faq__item--open' : ''}`}
                 >
                   <button
                     className="ccm-faq__question"
                     onClick={() => setOpenFaq(openFaq === index ? null : index)}
                   >
                     <span>{item.q}</span>
                     <svg
                       width="16" height="16" viewBox="0 0 16 16" fill="none"
                       className="ccm-faq__chevron"
                     >
                       <path d="M4 6l4 4 4-4"
                         stroke="currentColor" strokeWidth="1.2"
                         strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </button>
                   {openFaq === index && (
                     <div className="ccm-faq__answer">
                       {item.a}
                     </div>
                   )}
                 </div>
               ))}
             </div>
   
           </div>
         </div>
   
         {/* ── CTA FINAL ── */}
         <div className="ccm-cta">
           <div className="container">
             <div className="ccm-cta__inner reveal">
               <h2 className="ccm-cta__title">
                 Prêt à rejoindre CAPEO ?
               </h2>
               <p className="ccm-cta__sub">
                 Vendeurs — publiez gratuitement.
                 Acquéreurs — accédez aux actifs d'exception.
               </p>
               <div className="ccm-cta__actions">
                 <Link to="/inscription" className="ccm-btn-primary">
                   Créer un compte
                 </Link>
                 <Link to="/actifs" className="ccm-btn-ghost">
                   Explorer les actifs
                 </Link>
               </div>
             </div>
           </div>
         </div>
   
       </div>
     )
   }