/* ============================================
   CAPEO — HOME SCROLLYTELLING
   Lenis (scroll fluide) + GSAP ScrollTrigger.
   Narration en 6 actes.
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
import HomeCTA from '../../components/home/HomeCTA/HomeCTA.jsx'

import './Home.css'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Scroll fluide Lenis
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    // Synchroniser Lenis avec GSAP ScrollTrigger
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
