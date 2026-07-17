import { Link, Navigate, useParams } from 'react-router-dom'
import { getDestinationBySlug } from '../data/popularDestinations'
import './PopularDestinations.css'

export default function PopularDestinationDetail() {
  const { slug } = useParams<{ slug: string }>()
  const dest = getDestinationBySlug(slug)

  if (!dest) {
    return <Navigate to="/popular-destinations" replace />
  }

  const isMaduraiHub = dest.slug === 'madurai'

  return (
    <>
      <article className="popular-destination-detail-page">
        <div className="pd-inner">
          <Link to="/popular-destinations" className="pd-detail-back">
            ← All destinations
          </Link>

          <div className="pd-detail-hero">
            <img src={dest.image} alt={dest.imageAlt} width={1200} height={630} />
          </div>

          <header className="pd-detail-head">
            <div className="pd-detail-icon" aria-hidden="true">
              {dest.icon}
            </div>
            <h1>
              {isMaduraiHub
                ? 'Madurai Tourism — Places to Visit & Cab Packages'
                : `Madurai to ${dest.name} — Cab & Tour Package`}
            </h1>
            <p className="tamil">{dest.tamilName}</p>
          </header>

          <p className="pd-detail-body">{dest.excerpt}</p>

          {isMaduraiHub ? (
            <>
              <p className="pd-detail-body">
                Madurai is the cultural capital of Tamil Nadu, famous for Meenakshi Amman Temple,
                Thirumalai Nayakkar Mahal, classic Tamil cuisine, and vibrant temple-town streets.
                Mathi Cabs offers local sightseeing and multi-day Madurai tourism packages with
                chauffeur-driven cars from Madurai.
              </p>
              <div className="pd-detail-cta">
                <Link to="/madurai-tourism">View Madurai tourism itineraries</Link>
              </div>
              <div className="pd-detail-cta" style={{ marginTop: '12px' }}>
                <Link to="/madurai-local-sightseeing">Book Madurai local sightseeing</Link>
              </div>
            </>
          ) : (
            <div className="pd-detail-cta">
              <Link to="/enquiry">Enquire for cab to {dest.name}</Link>
            </div>
          )}
        </div>
      </article>
    </>
  )
}
