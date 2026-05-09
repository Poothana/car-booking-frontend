import { useEffect, useMemo, useState } from 'react'
import './AdminCar.css'
import AdminTopNav from './AdminTopNav'

type SettingType = 'string' | 'text' | 'email' | 'phone' | 'url' | 'image'

interface SettingRow {
  id: number
  key: string
  type: SettingType | string
  value: string | null
}

function labelize(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function inputKind(type: string) {
  if (type === 'email') return 'email'
  if (type === 'url') return 'url'
  if (type === 'phone') return 'tel'
  return 'text'
}

function AdminSetting() {
  const [rows, setRows] = useState<SettingRow[]>([])
  const [values, setValues] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const orderedRows = useMemo(() => [...rows].sort((a, b) => a.id - b.id), [rows])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const apiUrl = import.meta.env.DEV ? '/api/admin/settings' : 'http://127.0.0.1:8000/api/admin/settings'
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || `Failed to fetch settings (${res.status})`)
      }

      const data: SettingRow[] = Array.isArray(json.data) ? json.data : []
      setRows(data)
      setValues(
        data.reduce((acc, r) => {
          acc[r.id] = r.value ?? ''
          return acc
        }, {} as Record<number, string>)
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleChange = (id: number, v: string) => {
    setValues((prev) => ({ ...prev, [id]: v }))
  }

  const save = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const payload = {
        settings: orderedRows.map((r) => ({ id: r.id, value: values[r.id] ?? '' })),
      }

      const apiUrl = import.meta.env.DEV
        ? '/api/admin/settings/update'
        : 'http://127.0.0.1:8000/api/admin/settings/update'

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => null)

      if (!res.ok || !json?.success) {
        const msg =
          json?.errors
            ? JSON.stringify(json.errors)
            : json?.message || `Failed to update settings (${res.status})`
        throw new Error(msg)
      }

      setRows(Array.isArray(json.data) ? json.data : rows)
      setSuccess('Settings updated successfully!')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-car-container">
      <AdminTopNav active="settings" />

      <div className="admin-car-content">
        <div className="admin-header">
          <h1>Admin Settings</h1>
          <p className="admin-subtitle">Edit values from site_basic_settings</p>
        </div>

        {error && <div className="alert alert-error" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-section">
          <h2 className="section-title">Site Basic Settings</h2>

          {loading ? (
            <div style={{ padding: 20 }}>Loading…</div>
          ) : (
            <>
              <div className="form-grid">
                {orderedRows.map((r) => (
                  <div key={r.id} className="form-group" style={{ gridColumn: r.type === 'text' ? '1 / -1' : undefined }}>
                    <label htmlFor={`setting-${r.id}`}>
                      {labelize(r.key)} <span style={{ color: '#777', fontWeight: 600 }}>({r.type})</span>
                    </label>

                    {r.type === 'text' ? (
                      <textarea
                        id={`setting-${r.id}`}
                        value={values[r.id] ?? ''}
                        onChange={(e) => handleChange(r.id, e.target.value)}
                        rows={4}
                      />
                    ) : (
                      <input
                        id={`setting-${r.id}`}
                        type={inputKind(String(r.type))}
                        value={values[r.id] ?? ''}
                        onChange={(e) => handleChange(r.id, e.target.value)}
                        placeholder={labelize(r.key)}
                      />
                    )}

                    {r.type === 'image' && values[r.id] ? (
                      <small className="form-help">
                        Current: <code>{values[r.id]}</code>
                      </small>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-submit" onClick={save} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Settings'}
                </button>
                <button type="button" className="btn-cancel" onClick={fetchSettings} disabled={saving}>
                  Reload
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSetting

