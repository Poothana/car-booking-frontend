import { Link, useLocation } from 'react-router-dom'

/** Mobile-only pill shortcuts (Destinations + TN map). Styles: `MainHeaderMobileShared.css` */
export default function MobileHeaderQuickLinks() {
  const { pathname } = useLocation()

  return (
    <div className="header-mobile-quick" aria-label="Quick links">
      <Link
        to="/popular-destinations"
        className={`header-mobile-quick__btn${pathname.startsWith('/popular-destinations') ? ' is-active' : ''}`}
        aria-label="Popular destinations"
        title="Popular destinations"
      >
        <i className="fas fa-mountain" aria-hidden="true" />
      </Link>
      <span className="header-mobile-quick__sep" aria-hidden="true" />
      <Link
        to="/tamil-nadu-map"
        className={`header-mobile-quick__btn${pathname === '/tamil-nadu-map' ? ' is-active' : ''}`}
        aria-label="Tamil Nadu map"
        title="Tamil Nadu map"
      >
        <i className="fas fa-map-marked-alt" aria-hidden="true" />
      </Link>
    </div>
  )
}
