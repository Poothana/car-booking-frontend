import { Link, NavLink } from 'react-router-dom'
import SiteLogo from './SiteLogo'
import { SITE_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from '../lib/siteConfig'
import './AdminCar.css'

type Props = {
  /** Which admin section is active */
  active: 'cars' | 'enquiries' | 'settings'
  /** Show "Add Car" shortcut */
  showAddCar?: boolean
}

export default function AdminTopNav({ active, showAddCar = false }: Props) {
  return (
    <header className="admin-nav">
      <div className="nav-content">
        <Link to="/" className="logo-link" aria-label={`${SITE_NAME} — Home`}>
          <SiteLogo alt={SITE_NAME} className="site-logo-img--compact" />
        </Link>

        <nav className="main-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/admin/car/list" className={`nav-link ${active === 'cars' ? 'active' : ''}`}>Admin Cars</NavLink>
          <NavLink to="/admin/enquiry/list" className={`nav-link ${active === 'enquiries' ? 'active' : ''}`}>Enquiries</NavLink>
          <NavLink to="/admin/setting" className={`nav-link ${active === 'settings' ? 'active' : ''}`}>Settings</NavLink>
          {showAddCar ? (
            <NavLink to="/admin/car" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Add Car</NavLink>
          ) : null}
        </nav>

        <div className="nav-cta">
          <div className="phone-number">
            <i className="fas fa-phone-alt"></i>
            <div className="phone-text">
              <span>{SUPPORT_PHONE}</span>
              <span className="phone-email">{SUPPORT_EMAIL}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
