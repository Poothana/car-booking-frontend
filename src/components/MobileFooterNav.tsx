import { Link, NavLink, useLocation } from 'react-router-dom'
import './MobileFooterNav.css'

export default function MobileFooterNav() {
  const { pathname, hash } = useLocation()

  const homeTabActive =
    pathname === '/' && hash !== '#services' && hash !== '#car-fleet'
  const servicesTabActive = pathname === '/' && hash === '#services'
  const fleetTabActive =
    (pathname === '/' && hash === '#car-fleet') || pathname === '/cars'

  return (
    <nav className="mobile-footer-nav" aria-label="Mobile bottom navigation">
      <Link
        to="/"
        className={`mobile-footer-nav__item${homeTabActive ? ' mobile-footer-nav__item--active' : ''}`}
        aria-label="Home"
        aria-current={homeTabActive ? 'page' : undefined}
      >
        <i className="fas fa-home" aria-hidden="true" />
        <span>Home</span>
      </Link>
      <Link
        to="/#services"
        className={`mobile-footer-nav__item${servicesTabActive ? ' mobile-footer-nav__item--active' : ''}`}
        aria-label="Services"
        aria-current={servicesTabActive ? 'page' : undefined}
      >
        <i className="fas fa-concierge-bell" aria-hidden="true" />
        <span>Services</span>
      </Link>
      <Link
        to="/#car-fleet"
        className={`mobile-footer-nav__item${fleetTabActive ? ' mobile-footer-nav__item--active' : ''}`}
        aria-label="Car fleet"
        aria-current={fleetTabActive ? 'page' : undefined}
      >
        <i className="fas fa-car" aria-hidden="true" />
        <span>Car Fleet</span>
      </Link>
      <NavLink
        to="/enquiry"
        className={({ isActive }) =>
          `mobile-footer-nav__item${isActive ? ' mobile-footer-nav__item--active' : ''}`
        }
        aria-label="Account"
      >
        <i className="fas fa-user" aria-hidden="true" />
        <span>Enquiry</span>
      </NavLink>
    </nav>
  )
}
