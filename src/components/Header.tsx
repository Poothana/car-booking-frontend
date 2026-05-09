import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

type HeaderProps = {
  showEnquiryCta?: boolean
}

export default function Header({ showEnquiryCta = true }: HeaderProps) {
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
        // ignore (keep defaults)
      }
    }
    fetchBasic()
  }, [])

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <i className="fas fa-car"></i>
          </div>
          <div className="logo-text">
            <span className="logo-title">{siteName}</span>
            <span className="tamil">கார் வாடகை</span>
          </div>
        </div>

        <nav className="main-nav">
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
            <Link to="/enquiry" className="book-now-btn" aria-label="Go to enquiry page">
              Enquire Us
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

