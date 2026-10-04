import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Inside from './pages/Inside'
import Structure from './pages/Structure'
import HowItWorks from './pages/HowItWorks'
import Seed from './pages/Seed'
import Time from './pages/Time'
import Harvest from './pages/Harvest'
import Rental from './pages/Rental'

import BottomNav from './components/BottomNav'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inside" element={<Inside />} />
        <Route path="/structure" element={<Structure />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/seed" element={<Seed />} />
        <Route path="/time" element={<Time />} />
        <Route path="/harvest" element={<Harvest />} />
        <Route path="/rental" element={<Rental />} />
      </Routes>

      <BottomNav />
    </>
  )
}

export default App