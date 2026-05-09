/* ============================================
   CAPEO — PAGE ACTIFS V2
   Barre de recherche centrale premium.
   Filtres dépliants. Grille aérée.
   Photos Unsplash. Corrections AMF.
   ============================================ */

   import { useState, useMemo } from 'react'
   import { Link } from 'react-router-dom'
   import ActifCard from '../../components/annonces/ActifCard/ActifCard.jsx'
   import './Actifs.css'
   
   const ACTIFS_DATA = [
     {
       id: '1',
       category: 'Immobilier',
       premium: true,
       title: 'Immeuble de rapport — Centre historique',
       location: 'Lyon 6ème',
       details: '8 appartements · 480 m²',
       price: 1250000,
       priceDisplay: '1 250 000 €',
       interests: 14,
       verified: true,
       tag: 'Off Market',
       image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
     },
     {
       id: '2',
       category: 'Immobilier',
       premium: false,
       title: 'Parking souterrain — Centre-ville',
       location: 'Paris 15ème',
       details: '50 places · Bail commercial',
       price: 850000,
       priceDisplay: '850 000 €',
       interests: 6,
       verified: true,
       tag: null,
       image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
     },
     {
       id: '3',
       category: 'Atypique',
       premium: true,
       title: 'Ferme photovoltaïque — Sud de la France',
       location: 'Gard',
       details: '4 hectares · 2MW',
       price: 3200000,
       priceDisplay: '3 200 000 €',
       interests: 12,
       verified: true,
       tag: 'Off Market',
       image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&q=80',
     },
     {
       id: '4',
       category: 'Entreprise',
       premium: false,
       title: 'Boutique historique — Rue piétonne',
       location: 'Bordeaux',
       details: 'Fonds de commerce · 5 ans d\'ancienneté',
       price: 450000,
       priceDisplay: '450 000 €',
       interests: 22,
       verified: true,
       tag: null,
       image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
     },
     {
       id: '5',
       category: 'Objet rare',
       premium: true,
       title: 'Collection montres haute horlogerie',
       location: 'Genève · Port franc',
       details: '8 pièces · Patek, AP, Rolex',
       price: 220000,
       priceDisplay: '220 000 €',
       interests: 23,
       verified: true,
       tag: 'Port franc',
       image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
     },
     {
       id: '6',
       category: 'Atypique',
       premium: false,
       title: 'Vignoble AOC — Vallée du Rhône',
       location: 'Rhône · 15 hectares',
       details: '80 000 bouteilles/an · Export',
       price: 1800000,
       priceDisplay: '1 800 000 €',
       interests: 18,
       verified: false,
       tag: null,
       image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
     },
     {
       id: '7',
       category: 'Immobilier',
       premium: true,
       title: 'Villa contemporaine vue mer',
       location: 'Côte d\'Azur',
       details: '320 m² · Piscine · 5 chambres',
       price: 2800000,
       priceDisplay: '2 800 000 €',
       interests: 9,
       verified: true,
       tag: 'Off Market',
       image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
     },
     {
       id: '8',
       category: 'Entreprise',
       premium: false,
       title: 'Restaurant gastronomique en activité',
       location: 'Paris 8ème',
       details: '45 couverts · 12 ans d\'ancienneté',
       price: 380000,
       priceDisplay: '380 000 €',
       interests: 8,
       verified: true,
       tag: null,
       image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
     },
   ]
   
   const CATEGORIES = ['Tous', 'Immobilier', 'Entreprise', 'Objet rare', 'Atypique']
   
   const SORT_OPTIONS = [
     { value: 'recent',     label: 'Plus récents' },
     { value: 'price-asc', label: 'Prix croissant' },
     { value: 'price-desc', label: 'Prix décroissant' },
     { value: 'interests', label: 'Plus d\'intérêts' },
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
       offMarket: false,
       premium: false,
     })
   
     const handleFilter = (key, value) => {
       setFilters((prev) => ({ ...prev, [key]: value }))
     }
   
     const resetAll = () => {
       setSearch('')
       setCategory('Tous')
       setSort('recent')
       setFilters({
         priceMin: '',
         priceMax: '',
         verified: false,
         offMarket: false,
         premium: false,
       })
     }
   
     const filtered = useMemo(() => {
       let result = ACTIFS_DATA.filter((a) => {
         if (category !== 'Tous' && a.category !== category) return false
         if (filters.priceMin && a.price < parseInt(filters.priceMin)) return false
         if (filters.priceMax && a.price > parseInt(filters.priceMax)) return false
         if (filters.verified && !a.verified) return false
         if (filters.offMarket && a.tag !== 'Off Market') return false
         if (filters.premium && !a.premium) return false
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
   
     const premium = filtered.filter((a) => a.premium)
     const standard = filtered.filter((a) => !a.premium)
   
     return (
       <div className="actifs-page">
   
         {/* ── EN-TÊTE ── */}
         <div className="actifs-page__header">
           <div className="actifs-page__header-inner">
             <div className="section-label">Place de marché</div>
             <h1 className="actifs-page__title">
               Tous les actifs
             </h1>
             <p className="actifs-page__sub">
               Explorez l'ensemble des actifs publiés sur CAPEO
               par des vendeurs vérifiés.
             </p>
   
             {/* Barre de recherche centrale */}
             <div className="actifs-search">
               <div className="actifs-search__bar">
                 <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                   <circle cx="8" cy="8" r="6"
                     stroke="currentColor" strokeWidth="1.2"/>
                   <path d="M13 13l3 3"
                     stroke="currentColor" strokeWidth="1.2"
                     strokeLinecap="round"/>
                 </svg>
                 <input
                   type="text"
                   className="actifs-search__input"
                   placeholder="Rechercher par mot-clé, localisation, type d'actif..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                 />
                 {search && (
                   <button
                     className="actifs-search__clear"
                     onClick={() => setSearch('')}
                   >
                     <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                       <path d="M2 2l10 10M12 2L2 12"
                         stroke="currentColor" strokeWidth="1.2"
                         strokeLinecap="round"/>
                     </svg>
                   </button>
                 )}
               </div>
               <button
                 className={`actifs-search__filter-btn ${showFilters ? 'actifs-search__filter-btn--active' : ''}`}
                 onClick={() => setShowFilters(!showFilters)}
               >
                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                   <path d="M1 3h12M3 7h8M5 11h4"
                     stroke="currentColor" strokeWidth="1.2"
                     strokeLinecap="round"/>
                 </svg>
                 Filtres
                 {(filters.verified || filters.offMarket || filters.premium || filters.priceMin || filters.priceMax) && (
                   <span className="actifs-search__filter-dot"></span>
                 )}
               </button>
             </div>
   
             {/* Filtres dépliants */}
             {showFilters && (
               <div className="actifs-filters">
                 <div className="actifs-filters__grid">
                   <div className="actifs-filters__field">
                     <label className="actifs-filters__label">Prix minimum</label>
                     <input
                       type="number"
                       className="actifs-filters__input"
                       placeholder="Ex: 100000"
                       value={filters.priceMin}
                       onChange={(e) => handleFilter('priceMin', e.target.value)}
                     />
                   </div>
                   <div className="actifs-filters__field">
                     <label className="actifs-filters__label">Prix maximum</label>
                     <input
                       type="number"
                       className="actifs-filters__input"
                       placeholder="Ex: 2000000"
                       value={filters.priceMax}
                       onChange={(e) => handleFilter('priceMax', e.target.value)}
                     />
                   </div>
                   <div className="actifs-filters__checks">
                     {[
                       { key: 'verified',  label: 'Vérifiés CAPEO' },
                       { key: 'offMarket', label: 'Off Market uniquement' },
                       { key: 'premium',   label: 'Premium uniquement' },
                     ].map((f) => (
                       <label key={f.key} className="actifs-filters__check">
                         <input
                           type="checkbox"
                           checked={filters[f.key]}
                           onChange={(e) => handleFilter(f.key, e.target.checked)}
                         />
                         <span className="actifs-filters__check-box"></span>
                         {f.label}
                       </label>
                     ))}
                   </div>
                 </div>
                 <div className="actifs-filters__footer">
                   <span className="actifs-filters__count">
                     {filtered.length} actif{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                   </span>
                   <button
                     className="actifs-filters__reset"
                     onClick={resetAll}
                   >
                     Réinitialiser
                   </button>
                 </div>
               </div>
             )}
   
           </div>
         </div>
   
         {/* ── CATÉGORIES ── */}
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
               <select
                 className="actifs-sort__select"
                 value={sort}
                 onChange={(e) => setSort(e.target.value)}
               >
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
   
             {/* Actifs Premium */}
             {premium.length > 0 && (
               <div className="actifs-section">
                 <div className="actifs-section__header">
                   <div>
                     <h2 className="actifs-section__title">
                       Actifs Premium
                       <span className="actifs-section__badge">
                         <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                           <path d="M5 1l1 3h3L6.5 6l1 3L5 7.5 2.5 9l1-3L1 4h3z"
                             stroke="currentColor" strokeWidth="0.8"
                             strokeLinejoin="round"/>
                         </svg>
                         CAPEO+
                       </span>
                     </h2>
                     <p className="actifs-section__sub">
                       Actifs sélectionnés — informations fournies par les vendeurs
                     </p>
                   </div>
                 </div>
                 <div className="actifs-grid">
                   {premium.map((actif, index) => (
                     <ActifCard key={actif.id} actif={actif} index={index} />
                   ))}
                 </div>
               </div>
             )}
   
             {/* Tous les actifs */}
             {standard.length > 0 && (
               <div className="actifs-section">
                 <div className="actifs-section__header">
                   <div>
                     <h2 className="actifs-section__title">
                       Tous les actifs disponibles
                     </h2>
                     <p className="actifs-section__sub">
                       {standard.length} actif{standard.length > 1 ? 's' : ''} publié{standard.length > 1 ? 's' : ''} par des vendeurs vérifiés
                     </p>
                   </div>
                 </div>
                 <div className="actifs-grid">
                   {standard.map((actif, index) => (
                     <ActifCard key={actif.id} actif={actif} index={index} />
                   ))}
                 </div>
               </div>
             )}
   
             {/* Empty state */}
             {filtered.length === 0 && (
               <div className="actifs-empty">
                 <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                   <circle cx="18" cy="18" r="12"
                     stroke="currentColor" strokeWidth="1"/>
                   <path d="M27 27l8 8"
                     stroke="currentColor" strokeWidth="1"
                     strokeLinecap="round"/>
                 </svg>
                 <div className="actifs-empty__title">
                   Aucun actif trouvé
                 </div>
                 <div className="actifs-empty__desc">
                   Modifiez vos critères de recherche.
                 </div>
                 <button
                   className="actifs-empty__btn"
                   onClick={resetAll}
                 >
                   Réinitialiser les filtres
                 </button>
               </div>
             )}
   
           </div>
         </div>
   
       </div>
     )
   }