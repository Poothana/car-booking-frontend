import { Link } from 'react-router-dom'
import {
  BUSINESS,
  ENTITY_TAGLINE,
  emailMailtoHref,
  phoneTelHref,
  SITE_NAME,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
} from '../lib/siteConfig'
import './SiteFooter.css'

/** Sitewide NAP + Madurai HQ statement (entity disambiguation for SEO). */
export default function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <p className="site-footer__tagline">{ENTITY_TAGLINE}</p>
        <address className="site-footer__nap">
          <strong>{BUSINESS.name}</strong>
          <span>{BUSINESS.addressLine}</span>
          <a href={phoneTelHref()}>{SUPPORT_PHONE}</a>
          <a href={emailMailtoHref()}>{SUPPORT_EMAIL}</a>
        </address>
        <p className="site-footer__note">
          Based in <strong>Madurai</strong> (Near Meenakshi Temple). We are a Madurai tours &amp; travels /
          cab operator — not affiliated with unrelated listings that may use a similar name in other cities.
        </p>
        <nav className="site-footer__links" aria-label="Popular Madurai services">
          <Link to="/madurai-tourism">Madurai Tourism</Link>
          <Link to="/madurai-tours-and-travels">Tours &amp; Travels</Link>
          <Link to="/madurai-local-sightseeing">Local Sightseeing</Link>
          <Link to="/enquiry">Contact</Link>
        </nav>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
