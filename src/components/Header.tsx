import { Link } from 'react-router-dom'
import './Header.css'

type HeaderProps = {
  showEnquiryCta?: boolean
}

export default function Header({ showEnquiryCta = true }: HeaderProps) {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <i className="fas fa-car"></i>
          </div>
          <div className="logo-text">
            <span className="logo-title">CarRental</span>
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
              <span>+91 452 123 4567</span>
              <span className="phone-email">poothanapuvi@gmail.com</span>
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

