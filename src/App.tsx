import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import RouteSeo from './components/RouteSeo'
import MobileContactTopBar from './components/MobileContactTopBar'
import { SEO_LANDING_PAGES } from './data/seoLandingPages'
import './App.css'

const Home = lazy(() => import('./components/Home'))
const CarsList = lazy(() => import('./components/CarsList'))
const BookingForm = lazy(() => import('./components/BookingForm'))
const Enquiry = lazy(() => import('./components/Enquiry'))
const TamilNaduMap = lazy(() => import('./components/TamilNaduMap'))
const PopularDestinations = lazy(() => import('./components/PopularDestinations'))
const PopularDestinationDetail = lazy(() => import('./components/PopularDestinationDetail'))
const SeoLandingPage = lazy(() => import('./components/SeoLandingPage'))

const AdminLogin = lazy(() => import('./components/AdminLogin'))
const AdminProtectedRoute = lazy(() => import('./components/AdminProtectedRoute'))
const AdminLayout = lazy(() => import('./components/AdminLayout'))
const AdminCar = lazy(() => import('./components/AdminCar'))
const AdminCarList = lazy(() => import('./components/AdminCarList'))
const AdminCarEdit = lazy(() => import('./components/AdminCarEdit'))
const AdminSetting = lazy(() => import('./components/AdminSetting'))
const AdminEnquiryList = lazy(() => import('./components/AdminEnquiryList'))
const AdminEnquiryEdit = lazy(() => import('./components/AdminEnquiryEdit'))

function App() {
  return (
    <BrowserRouter>
      <RouteSeo />
      <MobileContactTopBar />
      <Suspense fallback={<div className="route-loading" aria-label="Loading page" />}>
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
      </Suspense>
    </BrowserRouter>
  )
}

export default App
