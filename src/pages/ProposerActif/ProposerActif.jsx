/* ============================================
   CAPEO — PROPOSER UN BIEN V3
   Immobilier uniquement. V1 gratuite.
   Sans rendement, sans Off Market (AMF safe).
   ============================================ */

import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './ProposerActif.css'

const TYPES_BIEN = [
  'Immeuble de rapport',
  'Résidentiel (appartement, maison, villa)',
  'Commercial (murs, local, bureaux)',
  'Parking / Box',
  'Terrain',
]

const STEPS = [
  { num: 1, label: 'Informations' },
  { num: 2, label: 'Photos' },
  { num: 3, label: 'Localisation' },
  { num: 4, label: 'Vérification' },
]

const CONSEILS = [
  { icon: '01', text: 'Des photos de qualité multiplient les demandes de contact.' },
  { icon: '02', text: 'Une description précise et détaillée rassure les acquéreurs.' },
  { icon: '03', text: 'Répondez rapidement aux messages dans la Business Room.' },
  { icon: '04', text: 'Votre brouillon est sauvegardé automatiquement.' },
]

export default function ProposerActif() {
  const [step, setStep] = useState(1)
  const [lastSaved, setLastSaved] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const emptyForm = {
    title: '', description: '', photos: [],
    type: '', location: '', price: '', priceOnDemand: false,
    docFile: null, docType: 'titre-propriete',
  }

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem('capeo_bien_draft')
      return saved ? { ...emptyForm, ...JSON.parse(saved) } : emptyForm
    } catch {
      return emptyForm
    }
  })

  useEffect(() => {
    const { docFile, photos, ...toSave } = form
    localStorage.setItem('capeo_bien_draft', JSON.stringify(toSave))
    setLastSaved(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
  }, [form])

  const handleField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const isStepValid = (s) => {
    if (s === 1) return form.title.length >= 10 && form.description.length >= 50
    if (s === 2) return form.photos.length > 0
    if (s === 3) return form.type && form.location
    if (s === 4) return form.docFile !== null
    return false
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer?.files || e.target?.files || [])
    const images = files.filter((f) => f.type.startsWith('image/'))
    if (form.photos.length + images.length > 10) {
      alert('Maximum 10 photos autorisées')
      return
    }
    const newPhotos = images.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotos] }))
  }, [form.photos])

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true) }
  const handleDragLeave = () => setDragActive(false)
  const removePhoto = (index) => setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  const handleDocUpload = (e) => { const file = e.target.files[0]; if (file) handleField('docFile', file) }

  const clearDraft = () => {
    localStorage.removeItem('capeo_bien_draft')
    setForm(emptyForm)
    setLastSaved(null)
  }

  const handleSubmit = () => {
    localStorage.removeItem('capeo_bien_draft')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="proposer-page">
        <div className="proposer-success">
          <div className="proposer-success__icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M10 18l5 5 11-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="proposer-success__title">Votre bien a été soumis</h2>
          <p className="proposer-success__desc">
            Notre équipe examine votre document sous 24h. Vous recevrez une
            confirmation dès que votre annonce sera publiée avec le badge Vérifié CAPEO.
          </p>
          <div className="proposer-success__actions">
            <Link to="/actifs" className="proposer-success__btn-primary">Voir les biens</Link>
            <Link to="/dashboard" className="proposer-success__btn-ghost">Mon dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="proposer-page">
      <div className="proposer-page__inner">

        {/* ── EN-TÊTE ── */}
        <div className="proposer-header">
          <div className="proposer-header__eyebrow">Espace vendeur</div>
          <h1 className="proposer-header__title">Proposer un bien</h1>
          <p className="proposer-header__sub">
            Publiez votre bien immobilier auprès des acquéreurs qualifiés
            de CAPEO. Publication gratuite, sans commission.
          </p>
          {lastSaved && (
            <div className="proposer-saved">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sauvegardé à {lastSaved}
              <button className="proposer-saved__clear" onClick={clearDraft}>Effacer</button>
            </div>
          )}
        </div>

        {/* ── STEPPER ── */}
        <div className="proposer-stepper">
          {STEPS.map((s, index) => (
            <div key={s.num} className="proposer-step-wrap">
              <div className={`proposer-step-item ${step === s.num ? 'proposer-step-item--active' : ''} ${step > s.num ? 'proposer-step-item--done' : ''}`}>
                <div className="proposer-step-num">
                  {step > s.num ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : s.num}
                </div>
                <span className="proposer-step-label">{s.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`proposer-step-line ${step > s.num ? 'proposer-step-line--done' : ''}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* ── LAYOUT ── */}
        <div className="proposer-layout">
          <div className="proposer-form-wrap">

            {/* ÉTAPE 1 */}
            {step === 1 && (
              <div className="proposer-card">
                <div className="proposer-card__header">
                  <div className="proposer-card__num">01</div>
                  <div>
                    <div className="proposer-card__title">Informations de base</div>
                    <div className="proposer-card__sub">Décrivez votre bien clairement et précisément</div>
                  </div>
                </div>
                <div className="proposer-fields">
                  <div className="proposer-field">
                    <div className="proposer-field-header">
                      <label className="proposer-label">Titre de l'annonce<span className="proposer-required"> *</span></label>
                      <span className={`proposer-charcount ${form.title.length > 48 ? 'proposer-charcount--warn' : ''}`}>{form.title.length}/60</span>
                    </div>
                    <input type="text" className="proposer-input" placeholder="Ex : Immeuble de rapport — Centre historique Lyon" maxLength={60}
                      value={form.title} onChange={(e) => handleField('title', e.target.value)} />
                    {form.title.length > 0 && form.title.length < 10 && (
                      <div className="proposer-field-hint proposer-field-hint--error">Trop court — décrivez mieux votre bien</div>
                    )}
                  </div>

                  <div className="proposer-field">
                    <div className="proposer-field-header">
                      <label className="proposer-label">Description détaillée<span className="proposer-required"> *</span></label>
                      <span className={`proposer-charcount ${form.description.length < 50 && form.description.length > 0 ? 'proposer-charcount--warn' : ''}`}>{form.description.length} car.</span>
                    </div>
                    <textarea className="proposer-textarea" rows={6}
                      placeholder="Décrivez votre bien en détail : localisation, état, historique, points forts, situation locative..."
                      value={form.description} onChange={(e) => handleField('description', e.target.value)} />
                    {form.description.length > 0 && form.description.length < 50 && (
                      <div className="proposer-field-hint proposer-field-hint--error">Description trop courte — les acquéreurs ont besoin de détails</div>
                    )}
                  </div>

                  <div className="proposer-field-row">
                    <div className="proposer-field">
                      <label className="proposer-label">Prix (€)</label>
                      <input type="number" className="proposer-input" placeholder="Ex : 1250000"
                        value={form.price} disabled={form.priceOnDemand}
                        onChange={(e) => handleField('price', e.target.value)} />
                    </div>
                    <div className="proposer-field proposer-field--center">
                      <label className="proposer-checkbox">
                        <input type="checkbox" checked={form.priceOnDemand} onChange={(e) => handleField('priceOnDemand', e.target.checked)} />
                        <span className="proposer-checkbox__box"></span>
                        Prix sur demande
                      </label>
                    </div>
                  </div>

                  <div className="proposer-field-hint">
                    Les informations saisies sont affichées telles que fournies par
                    le vendeur. CAPEO ne vérifie pas et ne garantit pas ces données.
                  </div>
                </div>

                <div className="proposer-card__actions">
                  <div></div>
                  <button className="proposer-btn-primary" disabled={!isStepValid(1)} onClick={() => setStep(2)}>
                    Continuer
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 */}
            {step === 2 && (
              <div className="proposer-card">
                <div className="proposer-card__header">
                  <div className="proposer-card__num">02</div>
                  <div>
                    <div className="proposer-card__title">Photos du bien</div>
                    <div className="proposer-card__sub">Ajoutez jusqu'à 10 photos pour valoriser votre annonce</div>
                  </div>
                </div>
                <div className={`proposer-dropzone ${dragActive ? 'proposer-dropzone--active' : ''}`}
                  onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleDrop} />
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 20V8M10 14l6-6 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 24v2a2 2 0 002 2h16a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <div className="proposer-dropzone__text">{dragActive ? 'Déposez vos photos ici...' : 'Glissez-déposez ou cliquez pour ajouter des photos'}</div>
                  <div className="proposer-dropzone__hint">JPG, PNG, WEBP · Max 10MB par photo · Maximum 10 photos</div>
                </div>
                {form.photos.length > 0 && (
                  <div className="proposer-photos">
                    {form.photos.map((photo, index) => (
                      <div key={index} className="proposer-photo">
                        <img src={photo.url} alt={photo.name} className="proposer-photo__img" />
                        {index === 0 && <div className="proposer-photo__main">Principale</div>}
                        <button className="proposer-photo__remove" onClick={() => removePhoto(index)}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="proposer-card__actions">
                  <button className="proposer-btn-ghost" onClick={() => setStep(1)}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Retour
                  </button>
                  <button className="proposer-btn-primary" disabled={!isStepValid(2)} onClick={() => setStep(3)}>
                    Continuer
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 */}
            {step === 3 && (
              <div className="proposer-card">
                <div className="proposer-card__header">
                  <div className="proposer-card__num">03</div>
                  <div>
                    <div className="proposer-card__title">Type & localisation</div>
                    <div className="proposer-card__sub">Précisez la nature et l'emplacement du bien</div>
                  </div>
                </div>
                <div className="proposer-fields">
                  <div className="proposer-field">
                    <label className="proposer-label">Type de bien <span className="proposer-required">*</span></label>
                    <div className="proposer-cats">
                      {TYPES_BIEN.map((t) => (
                        <div key={t} className={`proposer-cat ${form.type === t ? 'proposer-cat--active' : ''}`}
                          onClick={() => handleField('type', t)}>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="proposer-field">
                    <label className="proposer-label">Localisation <span className="proposer-required">*</span></label>
                    <input type="text" className="proposer-input" placeholder="Ex : Lyon 2ème, Paris 8ème, Côte d'Azur..."
                      value={form.location} onChange={(e) => handleField('location', e.target.value)} />
                  </div>
                </div>
                <div className="proposer-card__actions">
                  <button className="proposer-btn-ghost" onClick={() => setStep(2)}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Retour
                  </button>
                  <button className="proposer-btn-primary" disabled={!isStepValid(3)} onClick={() => setStep(4)}>
                    Continuer
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 4 */}
            {step === 4 && (
              <div className="proposer-card">
                <div className="proposer-card__header">
                  <div className="proposer-card__num">04</div>
                  <div>
                    <div className="proposer-card__title">Vérification</div>
                    <div className="proposer-card__sub">Uploadez un document pour obtenir le badge Vérifié CAPEO</div>
                  </div>
                </div>
                <div className="proposer-fields">
                  <div className="proposer-field">
                    <label className="proposer-label">Type de document</label>
                    <select className="proposer-select" value={form.docType} onChange={(e) => handleField('docType', e.target.value)}>
                      <option value="titre-propriete">Titre de propriété</option>
                      <option value="mandat">Mandat de vente</option>
                      <option value="taxe">Avis de taxe foncière</option>
                      <option value="autre">Autre document</option>
                    </select>
                  </div>
                  <div className="proposer-field">
                    <label className="proposer-label">Document justificatif<span className="proposer-required"> *</span></label>
                    <div className={`proposer-doc-upload ${form.docFile ? 'proposer-doc-upload--has-file' : ''}`}
                      onClick={() => document.getElementById('doc-input').click()}>
                      {form.docFile ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span>{form.docFile.name}</span>
                          <span className="proposer-doc-upload__change">Changer</span>
                        </>
                      ) : (
                        <>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 15V3M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          <span>Cliquer pour uploader</span>
                          <span className="proposer-doc-upload__hint">PDF, JPG, PNG · Max 10MB</span>
                        </>
                      )}
                      <input id="doc-input" type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleDocUpload} />
                    </div>
                    <div className="proposer-field-hint">
                      Document confidentiel — visible uniquement par l'équipe CAPEO. Non transmis aux acquéreurs.
                    </div>
                  </div>

                  <div className="proposer-recap">
                    <div className="proposer-recap__title">Récapitulatif</div>
                    {[
                      { label: 'Titre', value: form.title || '—' },
                      { label: 'Prix', value: form.priceOnDemand ? 'Sur demande' : form.price ? `${parseInt(form.price).toLocaleString('fr-FR')} €` : '—' },
                      { label: 'Type', value: form.type || '—' },
                      { label: 'Localisation', value: form.location || '—' },
                      { label: 'Photos', value: `${form.photos.length} photo${form.photos.length > 1 ? 's' : ''}` },
                      { label: 'Publication', value: 'Gratuite', highlight: true },
                    ].map((row) => (
                      <div key={row.label} className="proposer-recap__row">
                        <span>{row.label}</span>
                        <strong className={row.highlight ? 'proposer-recap__free' : ''}>{row.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="proposer-card__actions">
                  <button className="proposer-btn-ghost" onClick={() => setStep(3)}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Retour
                  </button>
                  <button className="proposer-btn-primary" disabled={!isStepValid(4)} onClick={handleSubmit}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1"/>
                      <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Publier mon bien
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ── SIDEBAR ── */}
          <div className="proposer-sidebar">
            <div className="proposer-sidebar__block">
              <div className="proposer-sidebar__title">Progression</div>
              <div className="proposer-sidebar__progress">
                {STEPS.map((s) => (
                  <div key={s.num} className="proposer-sidebar__step">
                    <div className={`proposer-sidebar__step-dot ${step > s.num ? 'proposer-sidebar__step-dot--done' : ''} ${step === s.num ? 'proposer-sidebar__step-dot--active' : ''}`}></div>
                    <span className={`proposer-sidebar__step-label ${step === s.num ? 'proposer-sidebar__step-label--active' : ''}`}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="proposer-sidebar__progress-bar">
                <div className="proposer-sidebar__progress-fill" style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}></div>
              </div>
            </div>

            <div className="proposer-sidebar__block">
              <div className="proposer-sidebar__title">Conseils CAPEO</div>
              <div className="proposer-sidebar__conseils">
                {CONSEILS.map((c, i) => (
                  <div key={i} className="proposer-sidebar__conseil">
                    <div className="proposer-sidebar__conseil-icon">{c.icon}</div>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="proposer-sidebar__block proposer-sidebar__block--gold">
              <div className="proposer-sidebar__free-title">Publication gratuite</div>
              <p className="proposer-sidebar__free-desc">
                Aucun frais de publication. Aucune commission sur la transaction.
                CAPEO ne collecte aucun fonds.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
