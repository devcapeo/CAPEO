/* ============================================
   CAPEO — ACTIF FILTERS
   Filtres latéraux de la marketplace.
   ============================================ */

   import './ActifFilters.css'

   export default function ActifFilters({ filters, onFilter, onReset }) {
     return (
       <div className="actif-filters">
   
         <div className="actif-filters__header">
           <div className="actif-filters__title">Filtres</div>
           <button className="actif-filters__reset" onClick={onReset}>
             Réinitialiser
           </button>
         </div>
   
         {/* Prix minimum */}
         <div className="actif-filters__group">
           <div className="actif-filters__label">Prix minimum</div>
           <input
             type="number"
             className="actif-filters__input"
             placeholder="Ex: 100000"
             value={filters.priceMin}
             onChange={(e) => onFilter('priceMin', e.target.value)}
           />
         </div>
   
         {/* Prix maximum */}
         <div className="actif-filters__group">
           <div className="actif-filters__label">Prix maximum</div>
           <input
             type="number"
             className="actif-filters__input"
             placeholder="Ex: 1000000"
             value={filters.priceMax}
             onChange={(e) => onFilter('priceMax', e.target.value)}
           />
         </div>
   
         {/* Vérifiés uniquement */}
         <div className="actif-filters__group">
           <label className="actif-filters__checkbox">
             <input
               type="checkbox"
               checked={filters.verified}
               onChange={(e) => onFilter('verified', e.target.checked)}
             />
             <span className="actif-filters__checkbox-box"></span>
             Vérifiés CAPEO uniquement
           </label>
         </div>
   
         {/* Off Market uniquement */}
         <div className="actif-filters__group">
           <label className="actif-filters__checkbox">
             <input
               type="checkbox"
               checked={filters.offMarket}
               onChange={(e) => onFilter('offMarket', e.target.checked)}
             />
             <span className="actif-filters__checkbox-box"></span>
             Off Market uniquement
           </label>
         </div>
   
       </div>
     )
   }