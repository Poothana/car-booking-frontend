import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CarsList from './components/CarsList'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarsList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
