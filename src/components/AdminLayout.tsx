import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import SiteLogo from './SiteLogo'
import './AdminLayout.css'
import { setAdminAuthed } from './AdminProtectedRoute'

export default function AdminLayout() {
  const navigate = useNavigate()

  const logout = () => {
    setAdminAuthed(false)
    navigate('/admin')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" aria-label="Admin sidebar">
        <Link to="/" className="admin-sidebar__brand" aria-label="Mathi Cabs — Home">
          <SiteLogo alt="Mathi Cabs" className="site-logo-img--sidebar" />
          <span className="admin-sidebar__text">Admin</span>
        </Link>

        <nav className="admin-sidebar__nav">
          <NavLink to="/admin/car/list" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}>
            <i className="fas fa-car" aria-hidden="true"></i>
            Cars
          </NavLink>
          <NavLink to="/admin/enquiry/list" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}>
            <i className="fas fa-envelope" aria-hidden="true"></i>
            Enquiry List
          </NavLink>
          <NavLink to="/admin/setting" className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}>
            <i className="fas fa-cog" aria-hidden="true"></i>
            Settings
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <button type="button" className="admin-sidebar__logout" onClick={logout}>
            <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  )
}

