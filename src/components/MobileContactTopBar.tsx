import { useEffect, useState } from 'react'
import './MobileContactTopBar.css'

export default function MobileContactTopBar() {
  const [supportPhone, setSupportPhone] = useState('+91 63800 63873')
  const [supportEmail, setSupportEmail] = useState('poothanapuvi@gmail.com')

  useEffect(() => {
    const fetchBasic = async () => {
      try {
        const apiUrl = import.meta.env.DEV ? '/api/settings/basic' : 'http://127.0.0.1:8000/api/settings/basic'
        const res = await fetch(apiUrl)
        if (!res.ok) return
        const json = await res.json()
        const data = json?.data || {}
        if (data.support_phone) setSupportPhone(String(data.support_phone))
        if (data.support_email) setSupportEmail(String(data.support_email))
      } catch {
        // keep defaults
      }
    }
    fetchBasic()
  }, [])

  const phoneHref = `tel:${supportPhone.replace(/\s/g, '')}`

  return (
    <div className="mobile-contact-topbar" aria-label="Contact">
      <a href={phoneHref} className="mobile-contact-topbar__link">
        <i className="fas fa-phone-alt" aria-hidden="true" />
        {supportPhone}
      </a>
      <a href={`mailto:${supportEmail}`} className="mobile-contact-topbar__link mobile-contact-topbar__link--email">
        <i className="fas fa-envelope" aria-hidden="true" />
        {supportEmail}
      </a>
    </div>
  )
}
