import { Link, useLocation } from 'react-router-dom'
import SiteLogo from './SiteLogo'
import MobileHeaderQuickLinks from './MobileHeaderQuickLinks'
import { SITE_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from '../lib/siteConfig'
import './Header.css'
import './MainHeaderMobileShared.css'

export default function Header() {
  const { pathname } = useLocation()

  const showEnquiryCta = pathname !== '/enquiry'
  const headerClass = showEnquiryCta
    ? 'main-header main-header--hide-enquiry-mobile'
    : 'main-header'

  return (
    <header className={headerClass}>
      <div className="header-content">
        <Link to="/" className="logo-section logo-section--mark" aria-label={`${SITE_NAME} — Home`}>
          <SiteLogo alt={SITE_NAME} />
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
              <span>{SUPPORT_PHONE}</span>
              <span className="phone-email">{SUPPORT_EMAIL}</span>
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
