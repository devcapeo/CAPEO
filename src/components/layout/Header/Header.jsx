/* ============================================
   CAPEO — HEADER V5
   Transparent au sommet sur la HOME uniquement.
   Opaque partout ailleurs.
   ============================================ */

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const NAV_LINKS = [
  { to: '/actifs',            label: 'Actifs' },
  { to: '/comment-ca-marche', label: 'Comment ça marche' },
  { to: '/proposer-un-actif', label: 'Publier un actif' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // La home est la seule page avec un header transparent au sommet
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (to) => location.pathname === to

  // Opaque si : pas la home, OU scrollé, OU menu ouvert
  const solid = !isHome || scrolled

  return (
    <header className={`header ${solid ? 'header--scrolled' : ''} ${menuOpen ? 'header--menu-open' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo">
          CAP<span>E</span>O
        </Link>

        <nav className="header__nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__link ${isActive(link.to) ? 'header__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <Link to="/connexion" className="header__login">Connexion</Link>
          <Link to="/inscription" className="header__cta">Rejoindre CAPEO</Link>
        </div>

        <button
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`header__mobile ${menuOpen ? 'header__mobile--open' : ''}`}>
        <nav className="header__mobile-nav">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__mobile-link ${isActive(link.to) ? 'header__mobile-link--active' : ''}`}
              style={{ transitionDelay: menuOpen ? `${0.1 + i * 0.06}s` : '0s' }}
            >
              <span className="header__mobile-link-num">0{i + 1}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header__mobile-actions">
          <Link to="/connexion" className="header__mobile-login">Connexion</Link>
          <Link to="/inscription" className="header__mobile-cta">Rejoindre CAPEO</Link>
        </div>
      </div>
    </header>
  )
}
