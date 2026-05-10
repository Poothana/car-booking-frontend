import { useNavigate } from 'react-router-dom'
import Header from './Header'
import './TamilNaduMap.css'

/** OpenStreetMap embed: Tamil Nadu approximate bounds (west, south, east, north). */
const OSM_EMBED_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=76.25%2C7.95%2C80.55%2C13.58&layer=mapnik'

const OSM_FULL_MAP_HREF =
  'https://www.openstreetmap.org/?mlat=10.85&mlon=78.65#map=7/10.85/78.65'

export default function TamilNaduMap() {
  const navigate = useNavigate()

  return (
    <>
      <Header showEnquiryCta={false} />
      <main className="tamil-nadu-map-page">
        <div className="tamil-nadu-map-top">
          <div className="tamil-nadu-map-top-inner">
            <p className="tamil-nadu-map-kicker">COVERAGE</p>
            <h1 className="tamil-nadu-map-title">Tamil Nadu</h1>
            <p className="tamil-nadu-map-subtitle tamil">தமிழ்நாடு வரைபடம்</p>
            <button type="button" className="tamil-nadu-map-back" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>

        <div className="tamil-nadu-map-wrap">
          <p className="tamil-nadu-map-lead">
            Explore the state we serve. Pan and zoom inside the map, or open the full map on OpenStreetMap.
          </p>
          <div className="tamil-nadu-map-frame">
            <iframe
              title="Map of Tamil Nadu — OpenStreetMap"
              src={OSM_EMBED_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="tamil-nadu-map-attrib">
            Map data ©{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
              OpenStreetMap contributors
            </a>
            .{' '}
            <a href={OSM_FULL_MAP_HREF} target="_blank" rel="noopener noreferrer">
              Open larger map
            </a>
          </p>
        </div>
      </main>
    </>
  )
}
