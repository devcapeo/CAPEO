import { useState } from 'react'
import './ProfilPatrimoine.css'

const NODES = [
  { id: 'center', label: 'Laurent V.', type: 'person', x: 50, y: 50 },
  { id: 'sci1', label: 'SCI Lyon 2', type: 'sci', value: '850 000€', x: 20, y: 25 },
  { id: 'holding1', label: 'Holding CAPEO', type: 'holding', x: 75, y: 20 },
  { id: 'immo1', label: 'Local Paris 1er', type: 'asset', value: '850 000€', x: 10, y: 65 },
  { id: 'company1', label: 'Valtech Services', type: 'company', x: 80, y: 70 },
]

const TYPE_COLORS = {
  person:  '#B8953F',
  sci:     '#3B82F6',
  holding: '#10B981',
  asset:   '#F59E0B',
  company: '#8B5CF6',
}

const TYPE_LABELS = {
  person:  'Personne',
  sci:     'SCI',
  holding: 'Holding',
  asset:   'Actif',
  company: 'Société',
}

export default function ProfilPatrimoine() {
  const [nodes, setNodes] = useState(NODES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', type: 'asset', value: '' })
  const [selected, setSelected] = useState(null)

  const handleAdd = () => {
    if (!form.label) return
    setNodes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: form.label,
        type: form.type,
        value: form.value || null,
        x: Math.random() * 70 + 10,
        y: Math.random() * 70 + 10,
      },
    ])
    setForm({ label: '', type: 'asset', value: '' })
    setShowForm(false)
  }

  const handleRemove = (id) => {
    if (id === 'center') return
    setNodes((prev) => prev.filter((n) => n.id !== id))
    setSelected(null)
  }

  return (
    <div className="patrimoine">

      <div className="dash-section-header">
        <div>
          <h2 className="dash-section-title">Profil patrimoine</h2>
          <p className="dash-section-sub">
            Visible uniquement par vous — non transmis à CAPEO
          </p>
        </div>
        <div className="patrimoine-actions">
          <button
            className="dash-btn-ghost"
            onClick={() => setShowForm(!showForm)}
          >
            + Ajouter
          </button>
          <button className="dash-btn-ghost">
            Export PDF
          </button>
        </div>
      </div>

      {showForm && (
        <div className="patrimoine-form">
          <input
            className="compte-input"
            placeholder="Nom (ex: SCI Paris, Appartement Lyon...)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <select
            className="compte-input"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input
            className="compte-input"
            placeholder="Valeur estimée (optionnel)"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
          <div className="patrimoine-form-actions">
            <button className="dash-btn-ghost" onClick={() => setShowForm(false)}>
              Annuler
            </button>
            <button className="dash-btn-primary" onClick={handleAdd} disabled={!form.label}>
              Ajouter
            </button>
          </div>
        </div>
      )}

      <div className="patrimoine-canvas">
        <svg viewBox="0 0 100 100" className="patrimoine-svg">
          {nodes.filter(n => n.id !== 'center').map((node) => {
            const center = nodes.find(n => n.id === 'center')
            return (
              <line
                key={`line-${node.id}`}
                x1={center.x} y1={center.y}
                x2={node.x} y2={node.y}
                stroke="#E5E7EB"
                strokeWidth="0.4"
                strokeDasharray="1,1"
              />
            )
          })}

          {nodes.map((node) => (
            <g
              key={node.id}
              onClick={() => setSelected(selected === node.id ? null : node.id)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={node.x} cy={node.y}
                r={node.id === 'center' ? 6 : 4}
                fill={TYPE_COLORS[node.type]}
                opacity={selected === node.id ? 1 : 0.85}
                stroke={selected === node.id ? '#0D1B2A' : 'transparent'}
                strokeWidth="0.5"
              />
              <text
                x={node.x} y={node.y + (node.id === 'center' ? 9 : 7)}
                textAnchor="middle"
                fill="#374151"
                fontSize="3"
                fontFamily="DM Sans, sans-serif"
              >
                {node.label}
              </text>
              {node.value && (
                <text
                  x={node.x} y={node.y + 10.5}
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

        {selected && selected !== 'center' && (
          <div className="patrimoine-detail">
            {(() => {
              const node = nodes.find(n => n.id === selected)
              return (
                <>
                  <div className="patrimoine-detail__type"
                    style={{ color: TYPE_COLORS[node.type] }}>
                    {TYPE_LABELS[node.type]}
                  </div>
                  <div className="patrimoine-detail__name">{node.label}</div>
                  {node.value && (
                    <div className="patrimoine-detail__value">{node.value}</div>
                  )}
                  <button
                    className="patrimoine-detail__delete"
                    onClick={() => handleRemove(node.id)}
                  >
                    Supprimer
                  </button>
                </>
              )
            })()}
          </div>
        )}
      </div>

      <div className="patrimoine-legend">
        {Object.entries(TYPE_LABELS).map(([k, v]) => (
          <div key={k} className="patrimoine-legend-item">
            <div
              className="patrimoine-legend-dot"
              style={{ background: TYPE_COLORS[k] }}
            ></div>
            <span>{v}</span>
          </div>
        ))}
      </div>

      <p className="patrimoine-note">
        Ces informations ne sont jamais transmises à CAPEO ni à des tiers.
      </p>

    </div>
  )
}
