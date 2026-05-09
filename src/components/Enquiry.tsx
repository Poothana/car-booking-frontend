import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import './Enquiry.css'

/** Same-origin `/api` is proxied to Laravel in dev (see vite.config.ts). Override with VITE_API_URL if needed. */
function enquiryApiUrl(): string {
  const base = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''
  return `${base}/api/enquiry/add`
}

function Enquiry() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string>('')
  const [submitSuccess, setSubmitSuccess] = useState<string>('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!formData.name.trim()) nextErrors.name = 'Name is required'

    const phoneDigits = formData.phone.replace(/\D/g, '')
    if (!phoneDigits) nextErrors.phone = 'Phone number is required'
    else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = 'Phone number must be 10-15 digits'
    }

    const email = formData.email.trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email'

    if (!formData.message.trim()) nextErrors.message = 'Message is required'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')
    try {
      const phoneDigits = formData.phone.replace(/\D/g, '')

      const payload = {
        name: formData.name.trim(),
        email_address: formData.email.trim() || null,
        phone_number: phoneDigits || null,
        alt_phone_number: null,
        message: formData.message.trim(),
        pick_location: null,
        drop_location: null,
        address: null,
        status: 'Pending'
      }

      const res = await fetch(enquiryApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const message =
          (data && (data.message || data.error)) ||
          `Failed to submit enquiry (HTTP ${res.status})`
        setSubmitError(message)
        return
      }

      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      })
      setSubmitSuccess('Message sent successfully.')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error — is the backend running?')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header showEnquiryCta={false} />
      <div className="enquiry-page">
        <div className="enquiry-top">
          <div className="enquiry-top-inner">
            <div className="enquiry-mini-title">CONTACT US</div>
            <h1 className="enquiry-title">Get in Touch With Us</h1>
            <button className="enquiry-back" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>

        <div className="enquiry-wrap">
          <div className="enquiry-grid">
            <aside className="enquiry-panel enquiry-panel--left">
              <div className="enquiry-card">
                <div className="enquiry-card-icon" aria-hidden="true">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="enquiry-card-body">
                  <div className="enquiry-card-title">Address</div>
                  <div className="enquiry-card-text">
                    Madurai, Tamil Nadu
                  </div>
                </div>
              </div>

              <div className="enquiry-card">
                <div className="enquiry-card-icon" aria-hidden="true">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="enquiry-card-body">
                  <div className="enquiry-card-title">Phone Number</div>
                  <div className="enquiry-card-text">
                    <a className="enquiry-link" href="tel:6380063873">
                      +91 63800 63873
                    </a>
                  </div>
                </div>
              </div>

              <div className="enquiry-card">
                <div className="enquiry-card-icon" aria-hidden="true">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="enquiry-card-body">
                  <div className="enquiry-card-title">Email</div>
                  <div className="enquiry-card-text">
                    <a className="enquiry-link" href="mailto:poothanapuvi@gmail.com">
                      poothanapuvi@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="enquiry-card">
                <div className="enquiry-card-icon" aria-hidden="true">
                  <i className="fas fa-globe"></i>
                </div>
                <div className="enquiry-card-body">
                  <div className="enquiry-card-title">Website</div>
                  <div className="enquiry-card-text">
                    <a className="enquiry-link" href="#" onClick={(e) => e.preventDefault()}>
                      www.maduraitravels.com
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            <section className="enquiry-panel enquiry-panel--right">
              <div className="enquiry-form-header">Feel Free Contact Us</div>

              <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
                {submitError && <div className="error-message" role="alert">{submitError}</div>}
                {submitSuccess && <div className="enquiry-success" role="status">{submitSuccess}</div>}
                <div className="enquiry-form-row">
                  <div className="enquiry-field">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className={errors.name ? 'error' : ''}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="enquiry-field">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={errors.email ? 'error' : ''}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="enquiry-field">
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className={errors.phone ? 'error' : ''}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="enquiry-field">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Message"
                    className={errors.message ? 'error' : ''}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button className="enquiry-submit" type="submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </section>
          </div>

          <div className="enquiry-map">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=Madurai%2C%20Tamil%20Nadu&output=embed"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Enquiry

