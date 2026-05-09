/* ============================================
   CAPEO — BUSINESS ROOM · DOCUMENTS
   Espace de partage de documents privés.
   Upload par vendeur et acquéreurs.
   Visible uniquement par les membres de la room.
   ============================================ */

   import { useState } from 'react'
   import './RoomDocuments.css'
   
   const DOCS_MOCK = [
     {
       id: '1',
       name: 'Titre de propriété — Immeuble Lyon 2',
       type: 'pdf',
       size: '2.4 MB',
       uploadedBy: 'Jean-Marc D.',
       role: 'vendeur',
       date: '12 Jan 2025',
       category: 'Juridique',
     },
     {
       id: '2',
       name: 'Relevés de charges 2024',
       type: 'pdf',
       size: '890 KB',
       uploadedBy: 'Jean-Marc D.',
       role: 'vendeur',
       date: '14 Jan 2025',
       category: 'Financier',
     },
     {
       id: '3',
       name: 'Baux locataires — 5 lots',
       type: 'pdf',
       size: '1.8 MB',
       uploadedBy: 'Jean-Marc D.',
       role: 'vendeur',
       date: '14 Jan 2025',
       category: 'Juridique',
     },
     {
       id: '4',
       name: 'Simulation financement SCI — Sophie',
       type: 'pdf',
       size: '340 KB',
       uploadedBy: 'Sophie L.',
       role: 'acquéreur',
       date: '16 Jan 2025',
       category: 'Financement',
     },
   ]
   
   const CATEGORIES = ['Tous', 'Juridique', 'Financier', 'Financement', 'Autre']
   
   const TYPE_ICONS = {
     pdf: (
       <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
         <rect x="2" y="1" width="14" height="16" rx="1"
           stroke="currentColor" strokeWidth="1"/>
         <path d="M5 6h8M5 9h8M5 12h5"
           stroke="currentColor" strokeWidth="1"
           strokeLinecap="round"/>
       </svg>
     ),
     img: (
       <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
         <rect x="2" y="2" width="14" height="14" rx="1"
           stroke="currentColor" strokeWidth="1"/>
         <circle cx="6.5" cy="6.5" r="1.5"
           stroke="currentColor" strokeWidth="1"/>
         <path d="M2 13l4-4 3 3 2-2 5 5"
           stroke="currentColor" strokeWidth="1"
           strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
     ),
     default: (
       <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
         <rect x="2" y="1" width="14" height="16" rx="1"
           stroke="currentColor" strokeWidth="1"/>
         <path d="M5 6h8M5 9h8M5 12h5"
           stroke="currentColor" strokeWidth="1"
           strokeLinecap="round"/>
       </svg>
     ),
   }
   
   export default function RoomDocuments({ actifId }) {
     const [docs, setDocs] = useState(DOCS_MOCK)
     const [filter, setFilter] = useState('Tous')
     const [uploading, setUploading] = useState(false)
   
     const filtered = docs.filter(
       (d) => filter === 'Tous' || d.category === filter
     )
   
     const handleUpload = (e) => {
       const file = e.target.files[0]
       if (!file) return
       setUploading(true)
   
       setTimeout(() => {
         const newDoc = {
           id: Date.now().toString(),
           name: file.name,
           type: file.name.endsWith('.pdf') ? 'pdf' : 'img',
           size: `${(file.size / 1024).toFixed(0)} KB`,
           uploadedBy: 'Vous',
           role: 'acquéreur',
           date: new Date().toLocaleDateString('fr-FR', {
             day: '2-digit',
             month: 'short',
             year: 'numeric',
           }),
           category: 'Autre',
           isSelf: true,
         }
         setDocs((prev) => [newDoc, ...prev])
         setUploading(false)
       }, 1000)
     }
   
     const handleDelete = (id) => {
       setDocs((prev) => prev.filter((d) => d.id !== id))
     }
   
     return (
       <div className="broom-docs">
   
         {/* En-tête */}
         <div className="broom-docs__header">
           <div>
             <div className="broom-docs__title">Documents partagés</div>
             <div className="broom-docs__subtitle">
               Visibles uniquement par les membres de cette room
             </div>
           </div>
   
           <label className="broom-docs__upload-btn">
             {uploading ? (
               <span className="spinner"></span>
             ) : (
               <>
                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                   <path d="M7 9V2M4 5l3-3 3 3"
                     stroke="currentColor" strokeWidth="1.2"
                     strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M2 11v1a1 1 0 001 1h8a1 1 0 001-1v-1"
                     stroke="currentColor" strokeWidth="1.2"
                     strokeLinecap="round"/>
                 </svg>
                 Uploader un document
               </>
             )}
             <input
               type="file"
               accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
               style={{ display: 'none' }}
               onChange={handleUpload}
               disabled={uploading}
             />
           </label>
         </div>
   
         {/* Filtres catégories */}
         <div className="broom-docs__filters">
           {CATEGORIES.map((cat) => (
             <button
               key={cat}
               className={`broom-docs__filter ${filter === cat ? 'broom-docs__filter--active' : ''}`}
               onClick={() => setFilter(cat)}
             >
               {cat}
             </button>
           ))}
         </div>
   
         {/* Liste documents */}
         {filtered.length === 0 ? (
           <div className="broom-docs__empty">
             <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
               <rect x="4" y="2" width="24" height="28" rx="2"
                 stroke="currentColor" strokeWidth="1"/>
               <path d="M10 12h12M10 17h12M10 22h8"
                 stroke="currentColor" strokeWidth="1"
                 strokeLinecap="round"/>
             </svg>
             <div>Aucun document dans cette catégorie</div>
           </div>
         ) : (
           <div className="broom-docs__list">
             {filtered.map((doc) => (
               <div
                 key={doc.id}
                 className={`broom-doc ${doc.isSelf ? 'broom-doc--self' : ''}`}
               >
                 {/* Icône type */}
                 <div className={`broom-doc__icon broom-doc__icon--${doc.role}`}>
                   {TYPE_ICONS[doc.type] || TYPE_ICONS.default}
                 </div>
   
                 {/* Infos */}
                 <div className="broom-doc__info">
                   <div className="broom-doc__name">{doc.name}</div>
                   <div className="broom-doc__meta">
                     <span>{doc.size}</span>
                     <span>·</span>
                     <span>Par {doc.uploadedBy}</span>
                     <span className={`broom-doc__role broom-doc__role--${doc.role}`}>
                       {doc.role}
                     </span>
                     <span>·</span>
                     <span>{doc.date}</span>
                   </div>
                 </div>
   
                 {/* Badge catégorie */}
                 <div className="broom-doc__category">
                   {doc.category}
                 </div>
   
                 {/* Actions */}
                 <div className="broom-doc__actions">
                   <button className="broom-doc__action broom-doc__action--download">
                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                       <path d="M6 2v6M3 6l3 3 3-3"
                         stroke="currentColor" strokeWidth="1.2"
                         strokeLinecap="round" strokeLinejoin="round"/>
                       <path d="M1 10h10"
                         stroke="currentColor" strokeWidth="1.2"
                         strokeLinecap="round"/>
                     </svg>
                   </button>
                   {doc.isSelf && (
                     <button
                       className="broom-doc__action broom-doc__action--delete"
                       onClick={() => handleDelete(doc.id)}
                     >
                       <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                         <path d="M2 3h8M5 3V2h2v1M4 3v7h4V3"
                           stroke="currentColor" strokeWidth="1"
                           strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     </button>
                   )}
                 </div>
   
               </div>
             ))}
           </div>
         )}
   
         {/* Note légale */}
         <div className="broom-docs__note">
           <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
             <circle cx="6" cy="6" r="5"
               stroke="currentColor" strokeWidth="1"/>
             <path d="M6 5v4" stroke="currentColor" strokeWidth="1"
               strokeLinecap="round"/>
             <circle cx="6" cy="3.5" r="0.6" fill="currentColor"/>
           </svg>
           <p>
             Les documents partagés dans cette room sont
             accessibles uniquement aux participants.
             CAPEO ne les examine pas et n'en garantit pas le contenu.
             Effectuez votre propre vérification avant toute décision.
           </p>
         </div>
   
       </div>
     )
   }