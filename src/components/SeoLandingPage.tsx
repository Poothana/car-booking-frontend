import { Link, Navigate, useLocation } from 'react-router-dom'
import { getSeoLandingPage, SEO_LANDING_PAGES } from '../data/seoLandingPages'
import { BUSINESS } from '../lib/siteConfig'
import './SeoLandingPage.css'

export default function SeoLandingPage() {
  const { pathname } = useLocation()
  const page = getSeoLandingPage(pathname.replace(/^\//, ''))

  if (!page) {
    return <Navigate to="/" replace />
  }

  const relatedPages = page.relatedSlugs
    .map((s) => SEO_LANDING_PAGES.find((p) => p.slug === s))
    .filter(Boolean)

  return (
    <>
      <article className="seo-landing-page">
        <div className="seo-landing-inner">
          <nav className="seo-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>{page.h1.split('—')[0].trim()}</span>
          </nav>

          <header className="seo-landing-hero">
            <p className="seo-kicker">Mathi Cabs · Madurai</p>
            <h1>{page.h1}</h1>
            <p className="seo-tamil tamil">{page.tamilSubtitle}</p>
            {page.intro.map((paragraph, i) => (
              <p key={i} className="seo-intro">{paragraph}</p>
            ))}
            <div className="seo-cta-row">
              <Link to="/booking" className="seo-btn seo-btn--primary">Book Now</Link>
              <Link to="/enquiry" className="seo-btn seo-btn--secondary">Get a Quote</Link>
              <a href={`tel:${BUSINESS.phone.replace(/\s/g, '')}`} className="seo-btn seo-btn--call">
                <i className="fas fa-phone-alt" aria-hidden="true" /> Call {BUSINESS.phone}
              </a>
            </div>
          </header>

          <ul className="seo-highlights">
            {page.highlights.map((item) => (
              <li key={item}>
                <i className="fas fa-check-circle" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          {page.sections.map((section) => (
            <section key={section.heading} className="seo-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}

          <section className="seo-section seo-faq">
            <h2>Frequently Asked Questions</h2>
            <div className="seo-faq-list">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="seo-faq-item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {relatedPages.length > 0 && (
            <section className="seo-section seo-related">
              <h2>Related Services</h2>
              <div className="seo-related-grid">
                {relatedPages.map((related) =>
                  related ? (
                    <Link key={related.slug} to={`/${related.slug}`} className="seo-related-card">
                      <h3>{related.h1.split('—')[0].trim()}</h3>
                      <p>{related.description.slice(0, 100)}…</p>
                    </Link>
                  ) : null,
                )}
              </div>
            </section>
          )}

          <section className="seo-section seo-all-services">
            <h2>All Mathi Cabs Services in Madurai</h2>
            <nav className="seo-services-nav" aria-label="Service pages">
              {SEO_LANDING_PAGES.filter((p) => p.slug !== page.slug).map((p) => (
                <Link key={p.slug} to={`/${p.slug}`}>
                  {p.h1.split('—')[0].trim()}
                </Link>
              ))}
              <Link to="/popular-destinations">Popular Destinations</Link>
              <Link to="/cars">View Fleet &amp; Tariff</Link>
            </nav>
          </section>
        </div>
      </article>
    </>
  )
}
