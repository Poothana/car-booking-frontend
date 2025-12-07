import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CarsList from './components/CarsList'
import AdminCar from './components/AdminCar'
import AdminCarList from './components/AdminCarList'
import AdminCarEdit from './components/AdminCarEdit'
import BookingForm from './components/BookingForm'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarsList />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/admin/car" element={<AdminCar />} />
        <Route path="/admin/car/list" element={<AdminCarList />} />
        <Route path="/admin/car/edit/:id" element={<AdminCarEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
