/* ============================================
   CAPEO — BUSINESS ROOM · INTENTIONS
   Tableau des intentions d'apport déclarées.
   Simulateur de répartition intégré.
   Non contractuel — déclaratif uniquement.
   ============================================ */

   import { useState } from 'react'
   import './RoomIntentions.css'
   
   const INTENTIONS_MOCK = [
     {
       id: '1',
       name: 'Marc D.',
       initials: 'M',
       structure: 'Nom propre',
       amount: 200000,
       status: 'confirmed',
       note: 'Financement personnel',
     },
     {
       id: '2',
       name: 'Sophie L.',
       initials: 'S',
       structure: 'SCI',
       amount: 150000,
       status: 'confirmed',
       note: 'SCI avec associé',
     },
     {
       id: '3',
       name: 'Thomas R.',
       initials: 'T',
       structure: 'SCI',
       amount: 320000,
       status: 'confirmed',
       note: '',
     },
     {
       id: '4',
       name: 'Lena M.',
       initials: 'L',
       structure: 'Nom propre',
       amount: 250000,
       status: 'pending',
       note: 'En attente de confirmation bancaire',
     },
   ]
   
   const STRUCTURES = [
     'Nom propre',
     'SCI',
     'Holding',
     'SARL',
     'Autre',
   ]
   
   const fmt = (n) =>
     n.toLocaleString('fr-FR', {
       style: 'currency',
       currency: 'EUR',
       maximumFractionDigits: 0,
     })
   
   export default function RoomIntentions({
     actifId,
     target = 1250000,
     priceDisplay,
   }) {
     const [intentions, setIntentions] = useState(INTENTIONS_MOCK)
     const [showForm, setShowForm] = useState(false)
     const [form, setForm] = useState({
       structure: 'Nom propre',
       amount: '',
       note: '',
     })
     const [editId, setEditId] = useState(null)
   
     const total = intentions.reduce((s, i) => s + i.amount, 0)
     const pct = Math.min(Math.round((total / target) * 100), 100)
     const remaining = target - total
   
     const handleSubmit = () => {
       if (!form.amount || isNaN(form.amount)) return
   
       if (editId) {
         setIntentions((prev) =>
           prev.map((i) =>
             i.id === editId
               ? { ...i, structure: form.structure, amount: parseInt(form.amount), note: form.note }
               : i
           )
         )
         setEditId(null)
       } else {
         setIntentions((prev) => [
           ...prev,
           {
             id: Date.now().toString(),
             name: 'Vous',
             initials: 'Y',
             structure: form.structure,
             amount: parseInt(form.amount),
             status: 'pending',
             note: form.note,
             isSelf: true,
           },
         ])
       }
   
       setForm({ structure: 'Nom propre', amount: '', note: '' })
       setShowForm(false)
     }
   
     const handleEdit = (intention) => {
       setForm({
         structure: intention.structure,
         amount: intention.amount.toString(),
         note: intention.note,
       })
       setEditId(intention.id)
       setShowForm(true)
     }
   
     const myAmount = parseInt(form.amount) || 0
     const myPct = myAmount ? Math.round((myAmount / target) * 100) : 0
     const notaryFees = myAmount ? Math.round(myAmount * 0.08) : 0
   
     return (
       <div className="broom-intentions">
   
         {/* En-tête */}
         <div className="broom-intentions__header">
           <div>
             <div className="broom-intentions__title">
               Intentions d'apport déclarées
             </div>
             <div className="broom-intentions__subtitle">
               Déclaratif et non contractuel — n'engage aucun versement
             </div>
           </div>
           <button
             className="broom-intentions__add-btn"
             onClick={() => {
               setEditId(null)
               setForm({ structure: 'Nom propre', amount: '', note: '' })
               setShowForm(!showForm)
             }}
           >
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
               <path d="M6 2v8M2 6h8"
                 stroke="currentColor" strokeWidth="1.2"
                 strokeLinecap="round"/>
             </svg>
             {showForm ? 'Annuler' : 'Déclarer mon intention'}
           </button>
         </div>
   
         {/* Récap global */}
         <div className="broom-intentions__recap">
           <div className="broom-intentions__recap-stats">
             <div className="broom-intentions__recap-stat">
               <div className="broom-intentions__recap-value">
                 {fmt(total)}
               </div>
               <div className="broom-intentions__recap-label">
                 Total déclaré
               </div>
             </div>
             <div className="broom-intentions__recap-stat">
               <div className="broom-intentions__recap-value">
                 {priceDisplay}
               </div>
               <div className="broom-intentions__recap-label">
                 Objectif
               </div>
             </div>
             <div className="broom-intentions__recap-stat">
               <div className={`broom-intentions__recap-value ${remaining <= 0 ? 'broom-intentions__recap-value--complete' : ''}`}>
                 {remaining <= 0 ? 'Atteint' : fmt(remaining)}
               </div>
               <div className="broom-intentions__recap-label">
                 Restant
               </div>
             </div>
             <div className="broom-intentions__recap-stat">
               <div className="broom-intentions__recap-value">
                 {intentions.length}
               </div>
               <div className="broom-intentions__recap-label">
                 Participants
               </div>
             </div>
           </div>
   
           {/* Barre */}
           <div className="broom-intentions__recap-bar">
             <div
               className="broom-intentions__recap-fill"
               style={{ width: `${pct}%` }}
             ></div>
           </div>
           <div className="broom-intentions__recap-pct">
             {pct}% de l'objectif déclaré
           </div>
         </div>
   
         {/* Formulaire */}
         {showForm && (
           <div className="broom-intentions__form">
             <div className="broom-intentions__form-title">
               {editId ? 'Modifier mon intention' : 'Déclarer mon intention d\'apport'}
             </div>
   
             <div className="broom-intentions__form-grid">
               <div className="broom-intentions__form-field">
                 <label className="broom-intentions__form-label">
                   Structure d'acquisition
                 </label>
                 <select
                   className="broom-intentions__select"
                   value={form.structure}
                   onChange={(e) =>
                     setForm({ ...form, structure: e.target.value })
                   }
                 >
                   {STRUCTURES.map((s) => (
                     <option key={s} value={s}>{s}</option>
                   ))}
                 </select>
               </div>
   
               <div className="broom-intentions__form-field">
                 <label className="broom-intentions__form-label">
                   Montant envisagé (€)
                 </label>
                 <input
                   type="number"
                   className="broom-intentions__input"
                   placeholder="Ex : 200000"
                   value={form.amount}
                   onChange={(e) =>
                     setForm({ ...form, amount: e.target.value })
                   }
                 />
               </div>
   
               <div className="broom-intentions__form-field broom-intentions__form-field--full">
                 <label className="broom-intentions__form-label">
                   Note (optionnel)
                 </label>
                 <input
                   type="text"
                   className="broom-intentions__input"
                   placeholder="Ex : Financement en cours, SCI avec associé..."
                   value={form.note}
                   onChange={(e) =>
                     setForm({ ...form, note: e.target.value })
                   }
                 />
               </div>
             </div>
   
             {/* Simulateur */}
             {myAmount > 0 && (
               <div className="broom-intentions__simulator">
                 <div className="broom-intentions__simulator-title">
                   Simulation indicative
                 </div>
                 <div className="broom-intentions__simulator-grid">
                   <div className="broom-intentions__simulator-row">
                     <span>Votre apport déclaré</span>
                     <strong>{fmt(myAmount)}</strong>
                   </div>
                   <div className="broom-intentions__simulator-row">
                     <span>Part du projet</span>
                     <strong>{myPct}%</strong>
                   </div>
                   <div className="broom-intentions__simulator-row">
                     <span>Frais notaire estimés (~8%)</span>
                     <strong>{fmt(notaryFees)}</strong>
                   </div>
                   <div className="broom-intentions__simulator-row broom-intentions__simulator-row--total">
                     <span>Total estimé à prévoir</span>
                     <strong>{fmt(myAmount + notaryFees)}</strong>
                   </div>
                 </div>
                 <p className="broom-intentions__simulator-note">
                   Simulation non contractuelle. Consultez un notaire
                   pour les frais réels applicables à votre situation.
                 </p>
               </div>
             )}
   
             <div className="broom-intentions__form-actions">
               <button
                 className="broom-intentions__form-cancel"
                 onClick={() => setShowForm(false)}
               >
                 Annuler
               </button>
               <button
                 className="broom-intentions__form-submit"
                 onClick={handleSubmit}
                 disabled={!form.amount || isNaN(form.amount)}
               >
                 {editId ? 'Modifier' : 'Déclarer mon intention'}
               </button>
             </div>
           </div>
         )}
   
         {/* Tableau */}
         <div className="broom-intentions__table-wrap">
           <table className="broom-intentions__table">
             <thead>
               <tr>
                 <th>Participant</th>
                 <th>Structure</th>
                 <th>Apport déclaré</th>
                 <th>Part %</th>
                 <th>Statut</th>
                 <th>Note</th>
                 <th></th>
               </tr>
             </thead>
             <tbody>
               {intentions.map((intent) => (
                 <tr
                   key={intent.id}
                   className={intent.isSelf ? 'broom-intentions__row--self' : ''}
                 >
                   <td>
                     <div className="broom-intentions__participant">
                       <div className={`broom-intentions__avatar ${intent.isSelf ? 'broom-intentions__avatar--self' : ''}`}>
                         {intent.initials}
                       </div>
                       <span>{intent.name}</span>
                     </div>
                   </td>
                   <td>
                     <span className="broom-intentions__structure">
                       {intent.structure}
                     </span>
                   </td>
                   <td className="broom-intentions__amount">
                     {fmt(intent.amount)}
                   </td>
                   <td className="broom-intentions__pct">
                     {Math.round((intent.amount / target) * 100)}%
                   </td>
                   <td>
                     <span className={`broom-intentions__status broom-intentions__status--${intent.status}`}>
                       {intent.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                     </span>
                   </td>
                   <td className="broom-intentions__note-cell">
                     {intent.note || '—'}
                   </td>
                   <td>
                     {intent.isSelf && (
                       <button
                         className="broom-intentions__edit-btn"
                         onClick={() => handleEdit(intent)}
                       >
                         Modifier
                       </button>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
   
         {/* Disclaimer */}
         <div className="broom-intentions__disclaimer">
           <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
             <path d="M6 1L11 10H1L6 1Z"
               stroke="currentColor" strokeWidth="1"
               strokeLinejoin="round"/>
             <path d="M6 5v3" stroke="currentColor" strokeWidth="1"
               strokeLinecap="round"/>
             <circle cx="6" cy="9" r="0.6" fill="currentColor"/>
           </svg>
           <p>
             Les montants déclarés ci-dessus sont des intentions
             non contractuelles. Ils n'engagent aucun versement.
             CAPEO ne collecte aucun fonds et n'intervient pas
             dans la transaction.
           </p>
         </div>
   
       </div>
     )
   }