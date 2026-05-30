import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SiteLogo from './SiteLogo'
import MobileHeaderQuickLinks from './MobileHeaderQuickLinks'
import './Header.css'
import './MainHeaderMobileShared.css'

export default function Header() {
  const { pathname } = useLocation()
  const [siteName, setSiteName] = useState('CarRental')
  const [supportPhone, setSupportPhone] = useState('+91 452 123 4567')
  const [supportEmail, setSupportEmail] = useState('poothanapuvi@gmail.com')

  const showEnquiryCta = pathname !== '/enquiry'
  const headerClass = showEnquiryCta
    ? 'main-header main-header--hide-enquiry-mobile'
    : 'main-header'

  useEffect(() => {
    const fetchBasic = async () => {
      try {
        const apiUrl = import.meta.env.DEV ? '/api/settings/basic' : 'http://127.0.0.1:8000/api/settings/basic'
        const res = await fetch(apiUrl)
        if (!res.ok) return
        const json = await res.json()
        const data = json?.data || {}
        if (data.site_name) setSiteName(String(data.site_name))
        if (data.support_phone) setSupportPhone(String(data.support_phone))
        if (data.support_email) setSupportEmail(String(data.support_email))
      } catch {
        // ignore (keep defaults)
      }
    }
    fetchBasic()
  }, [])

  return (
    <header className={headerClass}>
      <div className="header-content">
        <Link to="/" className="logo-section logo-section--mark" aria-label={`${siteName} — Home`}>
          <SiteLogo alt={siteName} />
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link to="/" className="nav-link">
            <i className="fas fa-home"></i> Home
          </Link>
          <a href="/#services" className="nav-link">
            <i className="fas fa-concierge-bell"></i> Services
          </a>
          <a href="/#car-fleet" className="nav-link">
            <i className="fas fa-car"></i> Car Fleet
          </a>
          <a href="/#why-choose" className="nav-link">
            <i className="fas fa-question-circle"></i> About
          </a>
          <Link to="/tamil-nadu-map" className="nav-link">
            <i className="fas fa-map-marked-alt"></i> TN Map
          </Link>
          <Link to="/popular-destinations" className="nav-link">
            <i className="fas fa-mountain"></i> Destinations
          </Link>
        </nav>

        <div className="nav-cta">
          <div className="phone-number">
            <i className="fas fa-phone-alt"></i>
            <div className="phone-text">
              <span>{supportPhone}</span>
              <span className="phone-email">{supportEmail}</span>
            </div>
          </div>

          {showEnquiryCta && (
            <Link to="/enquiry" className="header-enquire-btn" aria-label="Go to enquiry page">
              Enquire Us
            </Link>
          )}
        </div>

        <MobileHeaderQuickLinks />
      </div>
    </header>
  )
}
