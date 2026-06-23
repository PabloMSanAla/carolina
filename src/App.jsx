import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Galeria from './pages/Galeria'
import SobreMi from './pages/SobreMi'
import Encargos from './pages/Encargos'
import Contacto from './pages/Contacto'
import ObraDetail from './pages/ObraDetail'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/sobre" element={<SobreMi />} />
            <Route path="/encargos" element={<Encargos />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/obras/:slug" element={<ObraDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
