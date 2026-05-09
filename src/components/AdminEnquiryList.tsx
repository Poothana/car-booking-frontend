import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './AdminEnquiryList.css'
import AdminTopNav from './AdminTopNav'

type Enquiry = {
  id: number
  name: string
  email_address: string | null
  phone_number: string | null
  alt_phone_number: string | null
  message: string | null
  pick_location: string | null
  drop_location: string | null
  address: string | null
  status: string
  created_at: string
  updated_at: string
}

export default function AdminEnquiryList() {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc')
  const [rows, setRows] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRows = async (o: 'desc' | 'asc') => {
    try {
      setLoading(true)
      setError(null)
      const apiUrl = import.meta.env.DEV
        ? `/api/admin/enquiry/list?order=${o}`
        : `http://127.0.0.1:8000/api/admin/enquiry/list?order=${o}`
      const res = await fetch(apiUrl)
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `Failed to fetch enquiries (${res.status})`)
      }
      setRows(Array.isArray(json.data) ? json.data : [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch enquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRows(order)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

  const sortedLabel = order === 'desc' ? 'Newest first' : 'Oldest first'

  const count = useMemo(() => rows.length, [rows.length])

  return (
    <div className="admin-enquiry-container">
      <AdminTopNav active="enquiries" />

      <div className="admin-enquiry-content">
        <div className="admin-header">
          <div>
            <h1>Enquiries</h1>
            <p className="admin-subtitle">All enquiries from enquiry_details ({count})</p>
          </div>

          <div className="admin-enquiry-controls">
            <label className="admin-enquiry-label">
              Sort
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value === 'asc' ? 'asc' : 'desc')}
                className="admin-enquiry-select"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </label>
            <button type="button" className="admin-enquiry-refresh" onClick={() => fetchRows(order)} disabled={loading}>
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ whiteSpace: 'pre-line' }}>
            {error}
          </div>
        )}

        <div className="admin-enquiry-table-wrap">
          <table className="admin-enquiry-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-enquiry-empty">
                    {loading ? `Loading (${sortedLabel})…` : 'No enquiries found.'}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td className="admin-enquiry-id">#{String(r.id).padStart(3, '0')}</td>
                    <td>{r.name}</td>
                    <td>{r.email_address || '—'}</td>
                    <td>{r.phone_number || '—'}</td>
                    <td>
                      <span className={`status-pill status-${r.status.replace(/\s+/g, '-').toLowerCase()}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="admin-enquiry-action">
                      <Link className="admin-enquiry-edit" to={`/admin/enquiry/edit/${r.id}`} aria-label="Edit enquiry">
                        ✏️ Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

