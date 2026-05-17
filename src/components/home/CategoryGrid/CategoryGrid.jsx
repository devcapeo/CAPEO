/* ============================================
   CAPEO — CATEGORY GRID V3
   Icônes dans carrés dorés avec bordure.
   Séparateurs verticaux entre catégories.
   Hover : fond légèrement éclairé.
   ============================================ */

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './CategoryGrid.css'

const CATEGORIES = [
  {
    id: 'immobilier',
    slug: '/actifs?categorie=Immobilier',
    label: 'Immobilier',
    desc: 'Biens d\'exception, résidentiels et commerciaux',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="10" width="16" height="11" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1 11L11 3L21 11"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="8" y="14" width="6" height="7" rx="0.5"
          stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'entreprises',
    slug: '/actifs?categorie=Entreprise',
    label: 'Entreprises',
    desc: 'Sociétés à céder, parts sociales',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="7" width="18" height="14" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 7V5a4 4 0 018 0v2"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"/>
        <circle cx="11" cy="14" r="2.5"
          stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'objets-rares',
    slug: '/actifs?categorie=Objet rare',
    label: 'Objets rares',
    desc: 'Horlogerie, art, collections privées',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2L13.5 8H20L14.5 11.5L16.5 18L11 14.5L5.5 18L7.5 11.5L2 8H8.5L11 2Z"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'atypiques',
    slug: '/actifs?categorie=Atypique',
    label: 'Atypiques',
    desc: 'Domaines, vignobles, châteaux, îles',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="10" width="8" height="10" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
        <rect x="12" y="6" width="8" height="14" rx="1"
          stroke="currentColor" strokeWidth="1.2"/>
        <path d="M5 10V6M16 6V2"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"/>
        <path d="M3 6h4M14 2h4"
          stroke="currentColor" strokeWidth="1.2"
          strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function CategoryGrid() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    reveals?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="categories" ref={sectionRef}>
      <div className="container">

        <h2 className="categories__title reveal">
          Une sélection rare,<br/>par catégorie.
        </h2>

        <div className="categories__grid">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={cat.id}
              to={cat.slug}
              className={`cat-item reveal reveal-delay-${index + 1}`}
            >
              {/* Séparateur vertical gauche sauf premier */}
              {index > 0 && <div className="cat-item__sep"></div>}

              <div className="cat-item__inner">
                {/* Icône dans carré doré */}
                <div className="cat-item__icon-wrap">
                  {cat.icon}
                </div>

                <div className="cat-item__label">{cat.label}</div>
                <div className="cat-item__desc">{cat.desc}</div>

                <div className="cat-item__explore">
                  Explorer →
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
