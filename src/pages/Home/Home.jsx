/* ============================================
   CAPEO — PAGE HOME
   Assemble toutes les sections de la landing.
   Chaque section est un composant indépendant.
   ============================================ */

   import HeroSection from '../../components/home/HeroSection/HeroSection.jsx'
   import CategoryGrid from '../../components/home/CategoryGrid/CategoryGrid.jsx'
   import HowItWorks from '../../components/home/HowItWorks/HowItWorks.jsx'
   import FeaturedActifs from '../../components/home/FeaturedActifs/FeaturedActifs.jsx'
   import CTASection from '../../components/home/CTASection/CTASection.jsx'
   import './Home.css'
   
   export default function Home() {
     return (
       <div className="home">
         <HeroSection />
         <CategoryGrid />
         <FeaturedActifs />
         <HowItWorks />
         <CTASection />
       </div>
     )
   }