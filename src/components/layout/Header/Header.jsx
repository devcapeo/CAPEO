/* ============================================
   CAPEO — HEADER V2
   Logo CAP(E)O avec E doré.
   Bouton "Rejoindre CAPEO" en CTA.
   Item actif surligné en or dans la nav.
   Burger mobile responsive.
   ============================================ */

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const NAV_LINKS = [
  { to: '/actifs',            label: 'Actifs' },
  { to: '/off-market',        label: 'Off-Market' },
  { to: '/comment-ca-marche', label: 'Comment ça marche' },
  { to: '/proposer-un-actif', label: 'Publier un actif' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
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

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">

        {/* Logo */}
        <Link to="/" className="header__logo">
          CAP<span>E</span>O
        </Link>

        {/* Nav desktop */}
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

        {/* Actions desktop */}
        <div className="header__actions">
          <Link to="/connexion" className="header__login">
            Connexion
          </Link>
          <Link to="/inscription" className="header__cta">
            Rejoindre CAPEO
          </Link>
        </div>

        {/* Burger mobile */}
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

      {/* Menu mobile */}
      <div className={`header__mobile ${menuOpen ? 'header__mobile--open' : ''}`}>
        <nav className="header__mobile-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__mobile-link ${isActive(link.to) ? 'header__mobile-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header__mobile-actions">
          <Link to="/connexion" className="header__mobile-login">
            Connexion
          </Link>
          <Link to="/inscription" className="header__mobile-cta">
            Rejoindre CAPEO
          </Link>
        </div>
      </div>

    </header>
  )
}
