import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CarsList from './components/CarsList'
import AdminCar from './components/AdminCar'
import AdminCarList from './components/AdminCarList'
import AdminCarEdit from './components/AdminCarEdit'
import AdminSetting from './components/AdminSetting'
import AdminLogin from './components/AdminLogin'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AdminEnquiryList from './components/AdminEnquiryList'
import AdminEnquiryEdit from './components/AdminEnquiryEdit'
import BookingForm from './components/BookingForm'
import Enquiry from './components/Enquiry'
import MobileContactTopBar from './components/MobileContactTopBar'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <MobileContactTopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarsList />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/car" element={<AdminCar />} />
            <Route path="/admin/car/list" element={<AdminCarList />} />
            <Route path="/admin/car/edit/:id" element={<AdminCarEdit />} />
            <Route path="/admin/setting" element={<AdminSetting />} />
            <Route path="/admin/enquiry/list" element={<AdminEnquiryList />} />
            <Route path="/admin/enquiry/edit/:id" element={<AdminEnquiryEdit />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
