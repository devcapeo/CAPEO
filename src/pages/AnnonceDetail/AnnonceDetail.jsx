/* ============================================
   CAPEO — PAGE ANNONCE DETAIL V2
   Carrousel photos pleine largeur.
   Layout 2/3 + 1/3.
   Corrections AMF complètes.
   Sidebar : room + acquéreurs intéressés.
   ============================================ */

   import { useState } from 'react'
   import { useParams, Link } from 'react-router-dom'
   import ActifDisclaimer from '../../components/annonces/ActifDisclaimer/ActifDisclaimer.jsx'
   import VerifiedBadge from '../../components/annonces/VerifiedBadge/VerifiedBadge.jsx'
   import RoomAccess from '../../components/room/RoomAccess/RoomAccess.jsx'
   import './AnnonceDetail.css'
   
   const ACTIFS_DATA = {
     '1': {
       id: '1',
       category: 'Immobilier',
       title: 'Immeuble de rapport — Centre historique',
       location: 'Lyon 2ème',
       details: '8 appartements · 480 m² · Construit en 1890',
       price: 1250000,
       priceDisplay: '1 250 000 €',
       interests: 14,
       verified: true,
       tag: 'Off Market',
       description: `Immeuble haussmannien de caractère situé en plein cœur du 2ème arrondissement de Lyon, à deux pas de la Place des Terreaux. Le bien comprend 8 appartements dont 1 local commercial en rez-de-chaussée. Entièrement rénové en 2019, l'immeuble bénéficie d'une excellente situation locative. Toutes les parties communes ont été refaites à neuf. Idéal pour une acquisition collective en SCI.`,
       images: [
         'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80',
         'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80',
         'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80',
       ],
       specs: [
         { label: 'Surface totale',    value: '480 m²' },
         { label: 'Nombre de lots',    value: '8' },
         { label: 'Année construction', value: '1890' },
         { label: 'Dernière rénovation', value: '2019' },
         { label: 'DPE',               value: 'C' },
         { label: 'Régime fiscal',     value: 'LMNP possible' },
       ],
       seller: {
         name: 'Jean-Marc D.',
         verified: true,
         memberSince: '2024',
         deals: 3,
       },
       indicateurs: [
         {
           label: 'Rendement brut estimé',
           value: '5,2%',
           warning: true,
         },
         {
           label: 'Charges annuelles déclarées',
           value: '17 800 €',
           warning: true,
         },
         {
           label: 'Loyers annuels déclarés',
           value: '65 000 €',
           warning: true,
         },
       ],
       roomStatus: 'open',
       roomMembers: 4,
       roomDeclared: 920000,
     },
   }
   
   export default function AnnonceDetail() {
     const { id } = useParams()
     const [imgIndex, setImgIndex] = useState(0)
     const [hasRoomAccess, setHasRoomAccess] = useState(false)
   
     const actif = ACTIFS_DATA[id] || ACTIFS_DATA['1']
     const progressPct = Math.round(
       (actif.roomDeclared / actif.price) * 100
     )
   
     const prevImg = () =>
       setImgIndex((i) => (i === 0 ? actif.images.length - 1 : i - 1))
     const nextImg = () =>
       setImgIndex((i) => (i + 1) % actif.images.length)
   
     return (
       <div className="detail-page">
   
         {/* ── CARROUSEL PLEINE LARGEUR ── */}
         <div className="detail-carousel">
           <img
             src={actif.images[imgIndex]}
             alt={actif.title}
             className="detail-carousel__img"
           />
   
           {/* Overlay sombre bas */}
           <div className="detail-carousel__overlay"></div>
   
           {/* Bouton retour */}
           <Link to="/actifs" className="detail-carousel__back">
             <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
               <path d="M9 2L3 7l6 5"
                 stroke="currentColor" strokeWidth="1.2"
                 strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             Retour aux actifs
           </Link>
   
           {/* Navigation */}
           {actif.images.length > 1 && (
             <>
               <button
                 className="detail-carousel__nav detail-carousel__nav--prev"
                 onClick={prevImg}
               >
                 ‹
               </button>
               <button
                 className="detail-carousel__nav detail-carousel__nav--next"
                 onClick={nextImg}
               >
                 ›
               </button>
             </>
           )}
   
           {/* Dots */}
           <div className="detail-carousel__dots">
             {actif.images.map((_, i) => (
               <button
                 key={i}
                 className={`detail-carousel__dot ${i === imgIndex ? 'detail-carousel__dot--active' : ''}`}
                 onClick={() => setImgIndex(i)}
               />
             ))}
           </div>
   
           {/* Badges sur l'image */}
           <div className="detail-carousel__badges">
             <div className="detail-carousel__cat">{actif.category}</div>
             {actif.verified && <VerifiedBadge />}
             {actif.tag && (
               <div className="detail-carousel__tag">{actif.tag}</div>
             )}
           </div>
   
         </div>
   
         {/* ── LAYOUT PRINCIPAL ── */}
         <div className="detail-layout">
           <div className="detail-layout__inner">
   
             {/* ── COLONNE GAUCHE ── */}
             <div className="detail-left">
   
               {/* Titre + prix */}
               <div className="detail-hero">
                 <h1 className="detail-hero__title">{actif.title}</h1>
                 <div className="detail-hero__meta">
                   <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                     <circle cx="6" cy="5" r="2.5"
                       stroke="currentColor" strokeWidth="1"/>
                     <path d="M6 11C4 9 2 7 2 5a4 4 0 018 0c0 2-2 4-4 6z"
                       stroke="currentColor" strokeWidth="1"/>
                   </svg>
                   {actif.location} · {actif.details}
                 </div>
                 <div className="detail-hero__price">
                   {actif.priceDisplay}
                 </div>
               </div>
   
               {/* Description */}
               <div className="detail-block">
                 <div className="detail-block__title">Description</div>
                 <p className="detail-block__text">{actif.description}</p>
               </div>
   
               {/* Caractéristiques */}
               <div className="detail-block">
                 <div className="detail-block__title">Caractéristiques</div>
                 <div className="detail-specs">
                   {actif.specs.map((spec) => (
                     <div key={spec.label} className="detail-spec">
                       <div className="detail-spec__label">{spec.label}</div>
                       <div className="detail-spec__value">{spec.value}</div>
                     </div>
                   ))}
                 </div>
               </div>
   
               {/* Indicateurs vendeur */}
               <div className="detail-block">
                 <div className="detail-block__title">
                   Indicateurs vendeur
                   <span className="detail-block__title-note">
                     — fournis par le vendeur, non vérifiés par CAPEO
                   </span>
                 </div>
                 <div className="detail-indicators">
                   {actif.indicateurs.map((ind) => (
                     <div key={ind.label} className="detail-indicator">
                       <div className="detail-indicator__label">
                         {ind.label}
                       </div>
                       <div className="detail-indicator__value">
                         {ind.value}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
   
               {/* Disclaimer */}
               <ActifDisclaimer />
   
             </div>
   
             {/* ── COLONNE DROITE ── */}
             <div className="detail-right">
   
               {/* Vendeur */}
               <div className="detail-seller">
                 <div className="detail-seller__header">
                   <div className="detail-seller__avatar">
                     {actif.seller.name.charAt(0)}
                   </div>
                   <div className="detail-seller__info">
                     <div className="detail-seller__name">
                       {actif.seller.name}
                     </div>
                     <div className="detail-seller__since">
                       Membre depuis {actif.seller.memberSince}
                     </div>
                   </div>
                   {actif.seller.verified && <VerifiedBadge small />}
                 </div>
                 <div className="detail-seller__stats">
                   <div className="detail-seller__stat">
                     <strong>{actif.seller.deals}</strong>
                     <span>deals</span>
                   </div>
                   <div className="detail-seller__stat">
                     <strong>{actif.interests}</strong>
                     <span>intéressés</span>
                   </div>
                 </div>
               </div>
   
               {/* Bloc room */}
               <div className="detail-room-block">
   
                 <div className="detail-room-status">
                   <div className="detail-room-status__dot"></div>
                   <span>
                     Business Room ouverte · {actif.roomMembers} participants
                   </span>
                 </div>
   
                 {/* Barre intentions */}
                 <div className="detail-room-progress">
                   <div className="detail-room-progress__labels">
                     <span>
                       {(actif.roomDeclared / 1000).toFixed(0)}k€ déclarés
                     </span>
                     <span>{progressPct}%</span>
                   </div>
                   <div className="detail-room-progress__bar">
                     <div
                       className="detail-room-progress__fill"
                       style={{ width: `${progressPct}%` }}
                     ></div>
                   </div>
                   <div className="detail-room-progress__note">
                     Intentions non contractuelles · CAPEO ne collecte aucun fonds
                   </div>
                 </div>
   
                 {/* Accès room */}
                 {!hasRoomAccess ? (
                   <RoomAccess onAccess={() => setHasRoomAccess(true)} />
                 ) : (
                   <div className="detail-room-unlocked">
                     <div className="detail-room-unlocked__icon">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                         <path d="M9 12l2 2 4-4"
                           stroke="currentColor" strokeWidth="1.5"
                           strokeLinecap="round" strokeLinejoin="round"/>
                         <circle cx="12" cy="12" r="10"
                           stroke="currentColor" strokeWidth="1.2"/>
                       </svg>
                     </div>
                     <div className="detail-room-unlocked__title">
                       Accès confirmé
                     </div>
                     <p className="detail-room-unlocked__desc">
                       Vous avez accès à la Business Room de cet actif.
                     </p>
                     <Link
                       to={`/business-room/${actif.id}`}
                       className="detail-room-unlocked__btn"
                     >
                       Accéder à la Business Room →
                     </Link>
                   </div>
                 )}
   
               </div>
   
             </div>
   
           </div>
         </div>
   
       </div>
     )
   }