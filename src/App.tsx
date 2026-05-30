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
import TamilNaduMap from './components/TamilNaduMap'
import PopularDestinations from './components/PopularDestinations'
import PopularDestinationDetail from './components/PopularDestinationDetail'
import SeoLandingPage from './components/SeoLandingPage'
import PublicLayout from './components/PublicLayout'
import RouteSeo from './components/RouteSeo'
import MobileContactTopBar from './components/MobileContactTopBar'
import { SEO_LANDING_PAGES } from './data/seoLandingPages'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <RouteSeo />
      <MobileContactTopBar />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarsList />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/tamil-nadu-map" element={<TamilNaduMap />} />
          <Route path="/popular-destinations" element={<PopularDestinations />} />
          <Route path="/popular-destinations/:slug" element={<PopularDestinationDetail />} />
          {SEO_LANDING_PAGES.map((page) => (
            <Route key={page.slug} path={`/${page.slug}`} element={<SeoLandingPage />} />
          ))}
        </Route>
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
