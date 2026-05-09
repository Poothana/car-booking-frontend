import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminTopNav from './AdminTopNav'
import './AdminEnquiryEdit.css'

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

const STATUSES = ['Pending', 'Processed', 'Invalid', 'Paid', 'Payment Pending', 'Completed'] as const

export default function AdminEnquiryEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [row, setRow] = useState<Enquiry | null>(null)
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('Pending')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchRow = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      const apiUrl = import.meta.env.DEV ? `/api/admin/enquiry/${id}` : `http://127.0.0.1:8000/api/admin/enquiry/${id}`
      const res = await fetch(apiUrl)
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || `Failed to load enquiry (${res.status})`)
      setRow(json.data)
      setStatus((json.data?.status as any) || 'Pending')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load enquiry')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const save = async () => {
    if (!id) return
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const apiUrl = import.meta.env.DEV
        ? `/api/admin/enquiry/update/${id}`
        : `http://127.0.0.1:8000/api/admin/enquiry/update/${id}`
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || `Failed to update enquiry (${res.status})`)
      setRow(json.data)
      setSuccess('Updated successfully')
      setTimeout(() => navigate('/admin/enquiry/list'), 600)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update enquiry')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-enquiry-edit-container">
      <AdminTopNav active="enquiries" />

      <div className="admin-enquiry-edit__content">
        <div className="admin-header">
          <div>
            <h1>Edit Enquiry</h1>
            <p className="admin-subtitle">Update enquiry status</p>
          </div>
          <Link to="/admin/enquiry/list" className="admin-enquiry-edit__back">
            ← Back to list
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading || !row ? (
          <div className="admin-enquiry-edit__card">Loading…</div>
        ) : (
          <div className="admin-enquiry-edit__form-card">
            <div className="admin-enquiry-edit__form-grid">
              <div className="admin-enquiry-edit__field">
                <label>ID</label>
                <input value={row.id} disabled />
              </div>
              <div className="admin-enquiry-edit__field">
                <label>Name</label>
                <input value={row.name || ''} disabled />
              </div>
              <div className="admin-enquiry-edit__field">
                <label>Phone</label>
                <input value={row.phone_number || ''} disabled />
              </div>
              <div className="admin-enquiry-edit__field">
                <label>Alt Phone</label>
                <input value={row.alt_phone_number || ''} disabled />
              </div>
              <div className="admin-enquiry-edit__field">
                <label>Email</label>
                <input value={row.email_address || ''} disabled />
              </div>
              <div className="admin-enquiry-edit__field">
                <label>Pickup</label>
                <input value={row.pick_location || ''} disabled />
              </div>
              <div className="admin-enquiry-edit__field">
                <label>Drop</label>
                <input value={row.drop_location || ''} disabled />
              </div>
              <div className="admin-enquiry-edit__field admin-enquiry-edit__field--wide">
                <label>Address</label>
                <textarea value={row.address || ''} disabled rows={3} />
              </div>
              <div className="admin-enquiry-edit__field admin-enquiry-edit__field--wide">
                <label>Message</label>
                <textarea value={row.message || ''} disabled rows={4} />
              </div>

              <div className="admin-enquiry-edit__field">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="admin-enquiry-edit__field">
                <label>Created</label>
                <input value={new Date(row.created_at).toLocaleString()} disabled />
              </div>
              <div className="admin-enquiry-edit__field">
                <label>Updated</label>
                <input value={new Date(row.updated_at).toLocaleString()} disabled />
              </div>
            </div>

            <div className="admin-enquiry-edit__actions">
              <button type="button" className="admin-enquiry-edit__save" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : 'Update Status'}
              </button>
              <button type="button" className="admin-enquiry-edit__cancel" onClick={() => navigate('/admin/enquiry/list')} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

