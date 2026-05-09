import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminLogin.css'
import { setAdminAuthed } from './AdminProtectedRoute'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Enter email and password')
      return
    }

    try {
      setLoading(true)
      const apiUrl = import.meta.env.DEV ? '/api/admin/login' : 'http://127.0.0.1:8000/api/admin/login'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || `Login failed (HTTP ${res.status})`)
      }

      setAdminAuthed(true)
      navigate('/admin/car/list')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <header className="admin-login__header">
        <Link to="/" className="admin-login__brand">
          <span className="admin-login__brand-badge">Be</span>
          <span className="admin-login__brand-text">Admin</span>
        </Link>
      </header>

      <main className="admin-login__main">
        <div className="admin-login__card">
          <h1 className="admin-login__title">Admin Login</h1>
          <p className="admin-login__subtitle">Sign in to manage cars and settings</p>

          {error && <div className="admin-login__error">{error}</div>}

          <form onSubmit={handleSubmit} className="admin-login__form" noValidate>
            <label className="admin-login__label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              className="admin-login__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              required
            />

            <label className="admin-login__label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              className="admin-login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <button className="admin-login__btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="admin-login__footer">
            <Link to="/" className="admin-login__link">Back to Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminLogin

