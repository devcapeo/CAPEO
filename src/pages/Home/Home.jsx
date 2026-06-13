/* ============================================
   CAPEO — HOME SCROLLYTELLING
   Lenis (scroll fluide) + GSAP ScrollTrigger.
   ============================================ */

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import HomeHero from '../../components/home/HomeHero/HomeHero.jsx'
import HomeProblem from '../../components/home/HomeProblem/HomeProblem.jsx'
import HomeSolution from '../../components/home/HomeSolution/HomeSolution.jsx'
import HomeCategories from '../../components/home/HomeCategories/HomeCategories.jsx'
import HomeProcess from '../../components/home/HomeProcess/HomeProcess.jsx'

import './Home.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div className="home">
      <HomeHero />
      <HomeProblem />
      <HomeSolution />
      <HomeCategories />
      <HomeProcess />
      <HomeCTA />
    </div>
  )
}

/* ── HomeCTA inline (temporaire, pour contourner le bug de dossier) ── */
import { Link } from 'react-router-dom'

function HomeCTA() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hcta__panel', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hcta" ref={ref}>
      <div className="container hcta__grid">

        <div className="hcta__panel hcta__panel--seller">
          <div className="hcta__label">Vendeurs</div>
          <h3 className="hcta__title">
            Publiez votre bien<br/>
            <em>gratuitement.</em>
          </h3>
          <p className="hcta__desc">
            Décrochez le badge Vérifié CAPEO après vérification KYC.
            Touchez une audience d'acquéreurs qualifiés. Aucune
            commission sur la transaction.
          </p>
          <Link to="/proposer-un-actif" className="hcta__btn hcta__btn--primary">
            Publier un bien →
          </Link>
        </div>

        <div className="hcta__panel hcta__panel--buyer">
          <div className="hcta__label">Acquéreurs</div>
          <h3 className="hcta__title">
            Rejoignez les<br/>
            <em>Business Rooms.</em>
          </h3>
          <p className="hcta__desc">
            Découvrez des biens d'exception et co-acquérez avec
            d'autres acquéreurs qualifiés, en toute discrétion.
            L'accès est gratuit pendant notre phase de lancement.
          </p>
          <Link to="/inscription" className="hcta__btn hcta__btn--ghost">
            Devenir acquéreur →
          </Link>
        </div>

      </div>
    </section>
  )
}
