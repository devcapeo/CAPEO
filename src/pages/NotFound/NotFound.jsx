/* ============================================
   CAPEO — PAGE 404
   Page introuvable.
   ============================================ */

   import { Link } from 'react-router-dom'
   import './NotFound.css'
   
   export default function NotFound() {
     return (
       <div className="notfound-page">
   
         <div className="notfound-page__inner">
   
           <div className="notfound-page__code">404</div>
   
           <div className="notfound-page__line"></div>
   
           <h1 className="notfound-page__title">
             Page introuvable
           </h1>
   
           <p className="notfound-page__desc">
             Cette page n'existe pas ou a été déplacée.
             Retournez à l'accueil ou explorez les actifs disponibles.
           </p>
   
           <div className="notfound-page__actions">
             <Link to="/" className="notfound-page__btn-primary">
               Retour à l'accueil
             </Link>
             <Link to="/actifs" className="notfound-page__btn-ghost">
               Explorer les actifs
             </Link>
           </div>
   
           <div className="notfound-page__logo">
             CAP<span>E</span>O
           </div>
   
         </div>
   
       </div>
     )
   }