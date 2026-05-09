/* ============================================
   CAPEO — ROUTER PRINCIPAL
   ============================================ */

   import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
   import { useEffect } from 'react'
   
   import Header from './components/layout/Header/Header.jsx'
   import Footer from './components/layout/Footer/Footer.jsx'
   
   import Home from './pages/Home/Home.jsx'
   import Actifs from './pages/Actifs/Actifs.jsx'
   import AnnonceDetail from './pages/AnnonceDetail/AnnonceDetail.jsx'
   import OffMarket from './pages/OffMarket/OffMarket.jsx'
   import ProposerActif from './pages/ProposerActif/ProposerActif.jsx'
   import CommentCaMarche from './pages/CommentCaMarche/CommentCaMarche.jsx'
   import Dashboard from './pages/Dashboard/Dashboard.jsx'
   import Login from './pages/Auth/Login.jsx'
   import Register from './pages/Auth/Register.jsx'
   import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
   import NotFound from './pages/NotFound/NotFound.jsx'
   import BusinessRoom from './pages/BusinessRoom/BusinessRoom.jsx'
   
   function ScrollToTop() {
     const { pathname } = useLocation()
     useEffect(() => {
       window.scrollTo(0, 0)
     }, [pathname])
     return null
   }
   
   export default function App() {
     return (
       <BrowserRouter>
         <ScrollToTop />
         <Header />
         <main>
           <Routes>
             <Route path="/"                   element={<Home />} />
             <Route path="/actifs"             element={<Actifs />} />
             <Route path="/actifs/:id"         element={<AnnonceDetail />} />
             <Route path="/off-market"         element={<OffMarket />} />
             <Route path="/proposer-un-actif"  element={<ProposerActif />} />
             <Route path="/comment-ca-marche"  element={<CommentCaMarche />} />
             <Route path="/business-room/:id"  element={<BusinessRoom />} />
             <Route path="/connexion"          element={<Login />} />
             <Route path="/inscription"        element={<Register />} />
             <Route path="/dashboard"          element={<Dashboard />} />
             <Route path="/dashboard/:section" element={<Dashboard />} />
             <Route path="/admin"              element={<AdminDashboard />} />
             <Route path="*"                   element={<NotFound />} />
           </Routes>
         </main>
         <Footer />
       </BrowserRouter>
     )
   }