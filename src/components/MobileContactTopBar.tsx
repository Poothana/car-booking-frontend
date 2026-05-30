import {
  emailMailtoHref,
  phoneTelHref,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
} from '../lib/siteConfig'
import './MobileContactTopBar.css'

export default function MobileContactTopBar() {
  return (
    <div className="mobile-contact-topbar" aria-label="Contact">
      <a href={phoneTelHref()} className="mobile-contact-topbar__link">
        <i className="fas fa-phone-alt" aria-hidden="true" />
        {SUPPORT_PHONE}
      </a>
      <a href={emailMailtoHref()} className="mobile-contact-topbar__link mobile-contact-topbar__link--email">
        <i className="fas fa-envelope" aria-hidden="true" />
        {SUPPORT_EMAIL}
      </a>
    </div>
  )
}
