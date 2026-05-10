import { Link } from 'react-router-dom'
import Header from './Header'
import { POPULAR_DESTINATIONS } from '../data/popularDestinations'
import './PopularDestinations.css'

export default function PopularDestinations() {
  return (
    <>
      <Header showEnquiryCtaOnMobile={false} />
      <main className="popular-destinations-page">
        <div className="pd-inner">
          <header className="pd-hero">
            <p className="pd-kicker">MATHICABS TOURS &amp; TRAVELS</p>
            <h1 className="pd-title">Popular Destinations in Tamil Nadu</h1>
            <p className="pd-subtitle tamil">தமிழ்நாட்டின் பிரபலமான சுற்றுலா இடங்கள்</p>
            <p className="pd-lead">
              Plan your next trip with comfortable cabs to hill stations, beaches, temples, and wildlife spots across
              the state.
            </p>
          </header>

          <div className="pd-grid">
            {POPULAR_DESTINATIONS.map(d => (
              <Link key={d.slug} to={`/popular-destinations/${d.slug}`} className="pd-card">
                <img src={d.image} alt={d.imageAlt} loading="lazy" width={600} height={400} />
                <div className="pd-card-overlay">
                  <div className="pd-card-icon" aria-hidden="true">
                    {d.icon}
                  </div>
                  <h2>{d.name}</h2>
                  <div className="tamil">{d.tamilName}</div>
                  <p>{d.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
