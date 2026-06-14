/* ============================================
   CAPEO — PAGE ACTIFS V3
   Immobilier uniquement. Animations GSAP.
   Cohérent avec la home.
   ============================================ */

import { useState, useMemo, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ActifCard from '../../components/annonces/ActifCard/ActifCard.jsx'
import './Actifs.css'

gsap.registerPlugin(ScrollTrigger)

const ACTIFS_DATA = [
  {
    id: '1',
    category: 'Immeubles de rapport',
    title: 'Immeuble de rapport — Centre historique',
    location: 'Lyon 6ème',
    details: '8 appartements · 480 m²',
    price: 1250000,
    priceDisplay: '1 250 000 €',
    interests: 14,
    verified: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  },
  {
    id: '2',
    category: 'Commercial',
    title: 'Parking souterrain — Centre-ville',
    location: 'Paris 15ème',
    details: '50 places · Bail commercial',
    price: 850000,
    priceDisplay: '850 000 €',
    interests: 6,
    verified: true,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  },
  {
    id: '3',
    category: 'Résidentiel',
    title: 'Villa contemporaine vue mer',
    location: 'Côte d\'Azur',
    details: '320 m² · Piscine · 5 chambres',
    price: 2800000,
    priceDisplay: '2 800 000 €',
    interests: 9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  },
  {
    id: '4',
    category: 'Commercial',
    title: 'Murs commerciaux — Rue piétonne',
    location: 'Bordeaux',
    details: 'Local 180 m² · Bail en cours',
    price: 450000,
    priceDisplay: '450 000 €',
    interests: 22,
    verified: true,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  },
  {
    id: '5',
    category: 'Immeubles de rapport',
    title: 'Petit collectif locatif rénové',
    location: 'Nantes',
    details: '5 lots · 320 m² · Loué',
    price: 980000,
    priceDisplay: '980 000 €',
    interests: 11,
    verified: true,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  },
  {
    id: '6',
    category: 'Résidentiel',
    title: 'Appartement haussmannien d\'exception',
    location: 'Paris 8ème',
    details: '210 m² · 4 chambres · Étage élevé',
    price: 3400000,
    priceDisplay: '3 400 000 €',
    interests: 18,
    verified: false,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  },
  {
    id: '7',
    category: 'Commercial',
    title: 'Immeuble de bureaux — Quartier d\'affaires',
    location: 'Lille',
    details: '1 200 m² · Multi-locataires',
    price: 2100000,
    priceDisplay: '2 100 000 €',
    interests: 8,
    verified: true,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    id: '8',
    category: 'Immeubles de rapport',
    title: 'Immeuble mixte commerce + habitation',
    location: 'Marseille',
    details: '6 lots · Commerce en pied d\'immeuble',
    price: 1450000,
    priceDisplay: '1 450 000 €',
    interests: 15,
    verified: true,
    image: 'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=800&q=80',
  },
]

const CATEGORIES = ['Tous', 'Immeubles de rapport', 'Résidentiel', 'Commercial']

const SORT_OPTIONS = [
  { value: 'recent',     label: 'Plus récents' },
  { value: 'price-asc',  label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'interests',  label: 'Plus d\'intérêts' },
]

export default function Actifs() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [sort, setSort] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    verified: false,
  })
  const pageRef = useRef(null)

  const handleFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const resetAll = () => {
    setSearch('')
    setCategory('Tous')
    setSort('recent')
    setFilters({ priceMin: '', priceMax: '', verified: false })
  }

  const filtered = useMemo(() => {
    let result = ACTIFS_DATA.filter((a) => {
      if (category !== 'Tous' && a.category !== category) return false
      if (filters.priceMin && a.price < parseInt(filters.priceMin)) return false
      if (filters.priceMax && a.price > parseInt(filters.priceMax)) return false
      if (filters.verified && !a.verified) return false
      if (search) {
        const s = search.toLowerCase()
        return (
          a.title.toLowerCase().includes(s) ||
          a.location.toLowerCase().includes(s) ||
          a.category.toLowerCase().includes(s)
        )
      }
      return true
    })
    if (sort === 'price-asc')  result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'interests')  result = [...result].sort((a, b) => b.interests - a.interests)
    return result
  }, [search, category, sort, filters])

  // Animations entrée
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.actifs-head-el', {
        opacity: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.12,
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  // Re-anime les cartes à chaque changement de filtre
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.actif-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [filtered])

  const hasActiveFilters = filters.verified || filters.priceMin || filters.priceMax

  return (
    <div className="actifs-page" ref={pageRef}>

      {/* ── EN-TÊTE ── */}
      <div className="actifs-page__header">
        <div className="actifs-page__header-inner">
          <div className="actifs-head-el actifs-page__eyebrow">La place de marché</div>
          <h1 className="actifs-head-el actifs-page__title">
            Biens en <em>co-acquisition</em>
          </h1>
          <p className="actifs-head-el actifs-page__sub">
            Explorez les biens immobiliers publiés sur CAPEO
            par des vendeurs vérifiés, à acquérir à plusieurs.
          </p>

          {/* Barre de recherche */}
          <div className="actifs-head-el actifs-search">
            <div className="actifs-search__bar">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="actifs-search__input"
                placeholder="Rechercher par mot-clé, ville, type de bien..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="actifs-search__clear" onClick={() => setSearch('')}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
            <button
              className={`actifs-search__filter-btn ${showFilters ? 'actifs-search__filter-btn--active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Filtres
              {hasActiveFilters && <span className="actifs-search__filter-dot"></span>}
            </button>
          </div>

          {/* Filtres dépliants */}
          {showFilters && (
            <div className="actifs-filters">
              <div className="actifs-filters__grid">
                <div className="actifs-filters__field">
                  <label className="actifs-filters__label">Prix minimum</label>
                  <input
                    type="number" className="actifs-filters__input" placeholder="Ex : 500 000"
                    value={filters.priceMin}
                    onChange={(e) => handleFilter('priceMin', e.target.value)}
                  />
                </div>
                <div className="actifs-filters__field">
                  <label className="actifs-filters__label">Prix maximum</label>
                  <input
                    type="number" className="actifs-filters__input" placeholder="Ex : 2 000 000"
                    value={filters.priceMax}
                    onChange={(e) => handleFilter('priceMax', e.target.value)}
                  />
                </div>
                <div className="actifs-filters__checks">
                  <label className="actifs-filters__check">
                    <input
                      type="checkbox" checked={filters.verified}
                      onChange={(e) => handleFilter('verified', e.target.checked)}
                    />
                    <span className="actifs-filters__check-box"></span>
                    Vendeurs vérifiés CAPEO
                  </label>
                </div>
              </div>
              <div className="actifs-filters__footer">
                <span className="actifs-filters__count">
                  {filtered.length} bien{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                </span>
                <button className="actifs-filters__reset" onClick={resetAll}>Réinitialiser</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BARRE CATÉGORIES ── */}
      <div className="actifs-cats-bar">
        <div className="actifs-cats-bar__inner">
          <div className="actifs-cats">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`actifs-cat ${category === cat ? 'actifs-cat--active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="actifs-sort">
            <select className="actifs-sort__select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="actifs-content">
        <div className="actifs-content__inner">
          {filtered.length > 0 ? (
            <div className="actifs-grid">
              {filtered.map((actif, index) => (
                <ActifCard key={actif.id} actif={actif} index={index} />
              ))}
            </div>
          ) : (
            <div className="actifs-empty">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="18" cy="18" r="12" stroke="currentColor" strokeWidth="1"/>
                <path d="M27 27l8 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <div className="actifs-empty__title">Aucun bien trouvé</div>
              <div className="actifs-empty__desc">Modifiez vos critères de recherche.</div>
              <button className="actifs-empty__btn" onClick={resetAll}>Réinitialiser les filtres</button>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
