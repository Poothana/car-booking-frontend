import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './AdminCar.css'

type Props = {
  /** Which admin section is active */
  active: 'cars' | 'enquiries' | 'settings'
  /** Show "Add Car" shortcut */
  showAddCar?: boolean
}

export default function AdminTopNav({ active, showAddCar = false }: Props) {
  const [siteName, setSiteName] = useState('CarRental')
  const [supportPhone, setSupportPhone] = useState('+91 452 123 4567')
  const [supportEmail, setSupportEmail] = useState('poothanapuvi@gmail.com')

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
        // ignore
      }
    }
    fetchBasic()
  }, [])

  return (
    <header className="admin-nav">
      <div className="nav-content">
        <Link to="/" className="logo-link">
          <div className="logo-circle">Be</div>
          <span className="logo-text">{siteName}</span>
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
              <span>{supportPhone}</span>
              <span className="phone-email">{supportEmail}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

