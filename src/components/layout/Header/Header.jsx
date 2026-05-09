/* ============================================
   CAPEO — HEADER
   Navigation principale présente sur toutes
   les pages. Fixe en haut, glassmorphisme.
   Contient : logo, nav, CTA "Proposer un actif"
   et lien connexion/dashboard selon auth.
   ============================================ */

   import { useState, useEffect } from 'react'
   import { Link, useLocation } from 'react-router-dom'
   import './Header.css'
   
   export default function Header() {
     const [scrolled, setScrolled] = useState(false)
     const [menuOpen, setMenuOpen] = useState(false)
     const location = useLocation()
   
     // Détecte le scroll pour renforcer le fond du header
     useEffect(() => {
       const handleScroll = () => setScrolled(window.scrollY > 40)
       window.addEventListener('scroll', handleScroll)
       return () => window.removeEventListener('scroll', handleScroll)
     }, [])
   
     // Ferme le menu mobile à chaque changement de page
     useEffect(() => {
       setMenuOpen(false)
     }, [location])
   
     // Vérifie si un lien est actif
     const isActive = (path) => location.pathname === path
   
     return (
       <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
         <div className="header__inner">
   
           {/* ── LOGO ── */}
           <Link to="/" className="header__logo">
             CAP<span>E</span>O
           </Link>
   
           {/* ── NAVIGATION DESKTOP ── */}
           <nav className="header__nav">
             <Link
               to="/actifs"
               className={`header__link ${isActive('/actifs') ? 'header__link--active' : ''}`}
             >
               Actifs
             </Link>
             <Link
               to="/off-market"
               className={`header__link ${isActive('/off-market') ? 'header__link--active' : ''}`}
             >
               Off Market
               <span className="header__lock">🔒</span>
             </Link>
             <Link
               to="/comment-ca-marche"
               className={`header__link ${isActive('/comment-ca-marche') ? 'header__link--active' : ''}`}
             >
               Comment ça marche
             </Link>
           </nav>
   
           {/* ── ACTIONS DESKTOP ── */}
           <div className="header__actions">
             <Link to="/connexion" className="header__link">
               Connexion
             </Link>
             <Link to="/proposer-un-actif" className="header__cta">
               Proposer un actif
             </Link>
           </div>
   
           {/* ── BURGER MOBILE ── */}
           <button
             className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
             onClick={() => setMenuOpen(!menuOpen)}
             aria-label="Menu"
           >
             <span></span>
             <span></span>
             <span></span>
           </button>
   
         </div>
   
         {/* ── MENU MOBILE ── */}
         <div className={`header__mobile ${menuOpen ? 'header__mobile--open' : ''}`}>
           <Link to="/actifs"            className="header__mobile-link">Actifs</Link>
           <Link to="/off-market"        className="header__mobile-link">Off Market 🔒</Link>
           <Link to="/comment-ca-marche" className="header__mobile-link">Comment ça marche</Link>
           <Link to="/connexion"         className="header__mobile-link">Connexion</Link>
           <Link to="/proposer-un-actif" className="header__mobile-cta">Proposer un actif</Link>
         </div>
   
       </header>
     )
   }