import { Navigate, Outlet } from 'react-router-dom'

const AUTH_KEY = 'admin_auth_v1'

export function setAdminAuthed(v: boolean) {
  if (v) localStorage.setItem(AUTH_KEY, '1')
  else localStorage.removeItem(AUTH_KEY)
}

export function isAdminAuthed(): boolean {
  return localStorage.getItem(AUTH_KEY) === '1'
}

export default function AdminProtectedRoute() {
  if (!isAdminAuthed()) {
    return <Navigate to="/admin" replace />
  }
  return <Outlet />
}

