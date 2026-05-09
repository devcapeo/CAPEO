/* ============================================
   CAPEO — PROFIL PATRIMOINE
   Visualisation privée de la structure
   patrimoniale de l'utilisateur.
   Araignée interactive + export PDF.
   Visible uniquement par l'utilisateur.
   ============================================ */

   import { useState } from 'react'
   import './ProfilPatrimoine.css'
   
   const NODES_MOCK = [
     {
       id: 'center',
       label: 'Laurent V.',
       type: 'person',
       value: null,
       x: 50, y: 50,
     },
     {
       id: 'sci1',
       label: 'SCI Lyon 2',
       type: 'sci',
       value: '850 000€',
       x: 20, y: 25,
     },
     {
       id: 'holding1',
       label: 'Holding CAPEO',
       type: 'holding',
       value: null,
       x: 75, y: 20,
     },
     {
       id: 'immo1',
       label: 'Local Paris 1er',
       type: 'asset',
       value: '850 000€',
       x: 10, y: 65,
     },
     {
       id: 'entreprise1',
       label: 'Valtech Services',
       type: 'company',
       value: null,
       x: 80, y: 70,
     },
   ]
   
   const TYPE_COLORS = {
     person:  '#C9A84C',
     sci:     '#3A6BC4',
     holding: '#2ECC71',
     asset:   '#B8953F',
     company: '#9B59B6',
   }
   
   const TYPE_LABELS = {
     person:  'Personne',
     sci:     'SCI',
     holding: 'Holding',
     asset:   'Actif',
     company: 'Société',
   }
   
   export default function ProfilPatrimoine() {
     const [nodes, setNodes] = useState(NODES_MOCK)
     const [showForm, setShowForm] = useState(false)
     const [form, setForm] = useState({
       label: '', type: 'asset', value: ''
     })
     const [selectedNode, setSelectedNode] = useState(null)
   
     const handleAddNode = () => {
       if (!form.label) return
       const newNode = {
         id: Date.now().toString(),
         label: form.label,
         type: form.type,
         value: form.value || null,
         x: Math.random() * 70 + 10,
         y: Math.random() * 70 + 10,
       }
       setNodes((prev) => [...prev, newNode])
       setForm({ label: '', type: 'asset', value: '' })
       setShowForm(false)
     }
   
     const handleRemoveNode = (id) => {
       if (id === 'center') return
       setNodes((prev) => prev.filter((n) => n.id !== id))
       setSelectedNode(null)
     }
   
     return (
       <div className="profil-patrimoine">
   
         <div className="dash-section__header">
           <div>
             <div className="section-label">Premium</div>
             <h2 className="dash-section__title">Profil patrimoine</h2>
             <p className="profil-patrimoine__sub">
               Visible uniquement par vous. Non transmis à CAPEO.
             </p>
           </div>
           <div className="profil-patrimoine__actions">
             <button
               className="profil-patrimoine__btn-add"
               onClick={() => setShowForm(!showForm)}
             >
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                 <path d="M6 2v8M2 6h8"
                   stroke="currentColor" strokeWidth="1.2"
                   strokeLinecap="round"/>
               </svg>
               Ajouter
             </button>
             <button className="profil-patrimoine__btn-export">
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                 <path d="M6 7V1M4 5l2 2 2-2"
                   stroke="currentColor" strokeWidth="1.2"
                   strokeLinecap="round" strokeLinejoin="round"/>
                 <path d="M2 9v1a1 1 0 001 1h6a1 1 0 001-1V9"
                   stroke="currentColor" strokeWidth="1.2"
                   strokeLinecap="round"/>
               </svg>
               Export PDF
             </button>
           </div>
         </div>
   
         {/* Formulaire ajout */}
         {showForm && (
           <div className="profil-patrimoine__form">
             <input
               className="profil-patrimoine__input"
               placeholder="Nom (ex: SCI Paris, Appartement Lyon...)"
               value={form.label}
               onChange={(e) => setForm({ ...form, label: e.target.value })}
             />
             <select
               className="profil-patrimoine__select"
               value={form.type}
               onChange={(e) => setForm({ ...form, type: e.target.value })}
             >
               {Object.entries(TYPE_LABELS).map(([k, v]) => (
                 <option key={k} value={k}>{v}</option>
               ))}
             </select>
             <input
               className="profil-patrimoine__input"
               placeholder="Valeur estimée (optionnel)"
               value={form.value}
               onChange={(e) => setForm({ ...form, value: e.target.value })}
             />
             <div className="profil-patrimoine__form-actions">
               <button
                 className="profil-patrimoine__btn-cancel"
                 onClick={() => setShowForm(false)}
               >
                 Annuler
               </button>
               <button
                 className="profil-patrimoine__btn-submit"
                 onClick={handleAddNode}
                 disabled={!form.label}
               >
                 Ajouter
               </button>
             </div>
           </div>
         )}
   
         {/* Visualisation araignée */}
         <div className="profil-patrimoine__canvas">
           <svg
             viewBox="0 0 100 100"
             className="profil-patrimoine__svg"
             preserveAspectRatio="xMidYMid meet"
           >
             {/* Lignes de connexion vers le centre */}
             {nodes.filter(n => n.id !== 'center').map((node) => {
               const center = nodes.find(n => n.id === 'center')
               return (
                 <line
                   key={`line-${node.id}`}
                   x1={center.x} y1={center.y}
                   x2={node.x} y2={node.y}
                   stroke="rgba(255,255,255,0.08)"
                   strokeWidth="0.3"
                   strokeDasharray="1,1"
                 />
               )
             })}
   
             {/* Noeuds */}
             {nodes.map((node) => (
               <g
                 key={node.id}
                 onClick={() => setSelectedNode(
                   selectedNode === node.id ? null : node.id
                 )}
                 style={{ cursor: 'pointer' }}
               >
                 <circle
                   cx={node.x}
                   cy={node.y}
                   r={node.id === 'center' ? 6 : 4}
                   fill={TYPE_COLORS[node.type]}
                   opacity={selectedNode === node.id ? 1 : 0.8}
                   stroke={selectedNode === node.id ? 'white' : 'transparent'}
                   strokeWidth="0.5"
                 />
                 <text
                   x={node.x}
                   y={node.y + (node.id === 'center' ? 9 : 7)}
                   textAnchor="middle"
                   fill="rgba(255,255,255,0.7)"
                   fontSize="3"
                   fontFamily="DM Sans, sans-serif"
                 >
                   {node.label}
                 </text>
                 {node.value && (
                   <text
                     x={node.x}
                     y={node.y + 10.5}
                     textAnchor="middle"
                     fill={TYPE_COLORS[node.type]}
                     fontSize="2.5"
                     fontFamily="JetBrains Mono, monospace"
                   >
                     {node.value}
                   </text>
                 )}
               </g>
             ))}
           </svg>
   
           {/* Panel détail noeud sélectionné */}
           {selectedNode && selectedNode !== 'center' && (
             <div className="profil-patrimoine__node-detail">
               {(() => {
                 const node = nodes.find(n => n.id === selectedNode)
                 return (
                   <>
                     <div className="profil-patrimoine__node-type"
                       style={{ color: TYPE_COLORS[node.type] }}
                     >
                       {TYPE_LABELS[node.type]}
                     </div>
                     <div className="profil-patrimoine__node-name">
                       {node.label}
                     </div>
                     {node.value && (
                       <div className="profil-patrimoine__node-value">
                         {node.value}
                       </div>
                     )}
                     <button
                       className="profil-patrimoine__node-delete"
                       onClick={() => handleRemoveNode(node.id)}
                     >
                       Supprimer
                     </button>
                   </>
                 )
               })()}
             </div>
           )}
         </div>
   
         {/* Légende */}
         <div className="profil-patrimoine__legend">
           {Object.entries(TYPE_LABELS).map(([k, v]) => (
             <div key={k} className="profil-patrimoine__legend-item">
               <div
                 className="profil-patrimoine__legend-dot"
                 style={{ background: TYPE_COLORS[k] }}
               ></div>
               <span>{v}</span>
             </div>
           ))}
         </div>
   
         <p className="profil-patrimoine__note">
           Ces informations sont stockées localement et ne sont
           jamais transmises à CAPEO ni à des tiers.
         </p>
   
       </div>
     )
   }