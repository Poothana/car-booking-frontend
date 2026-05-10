import { Link, Navigate, useParams } from 'react-router-dom'
import Header from './Header'
import { getDestinationBySlug } from '../data/popularDestinations'
import './PopularDestinations.css'

export default function PopularDestinationDetail() {
  const { slug } = useParams<{ slug: string }>()
  const dest = getDestinationBySlug(slug)

  if (!dest) {
    return <Navigate to="/popular-destinations" replace />
  }

  return (
    <>
      <Header showEnquiryCtaOnMobile={false} />
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
            <h1>{dest.name}</h1>
            <p className="tamil">{dest.tamilName}</p>
          </header>

          <p className="pd-detail-body">{dest.excerpt}</p>

          <div className="pd-detail-cta">
            <Link to="/enquiry">Enquire for cab to {dest.name}</Link>
          </div>
        </div>
      </article>
    </>
  )
}
