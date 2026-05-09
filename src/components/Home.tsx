import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import meenakshiImage from '../assets/images/Bg/meenakshi-amman-temple-india.avif'
import trivaluvarImage from '../assets/images/Bg/trivaluvar.jpeg'
import './Home.css'

type HireMode = 'local' | 'outstation'

interface ApiPriceDetail {
  range_type?: string | null
  price_type: string
  price: string | number
  fuel_charge?: string | number | null
  driver_betta?: string | number | null
}

interface ApiCategory {
  id: number
  name: string
}

interface ApiCar {
  id: number
  car_name: string
  car_model: string
  car_image_url: string
  is_active: boolean
  category?: ApiCategory
  price_details?: ApiPriceDetail[]
  additional_details?: {
    no_of_seats?: number
  }
}

type FleetIcon = 'fa-car' | 'fa-car-side' | 'fa-shuttle-van' | 'fa-bus'

interface FleetTariffCard {
  id: string
  name: string
  icon: FleetIcon
  imageUrl?: string
  seats?: number
  rentPerDay: number
  fuelPerKm: number
  abovePerKm: number
  driverBatta: number
}

const getBackendImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  const backendBaseUrl = import.meta.env.DEV ? 'http://127.0.0.1:8000' : window.location.origin
  const cleanImagePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
  return `${backendBaseUrl}/storage/cars/${cleanImagePath}`
}

const parseNumber = (v: unknown): number => {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN
  return Number.isFinite(n) ? n : 0
}

const normRange = (v: unknown): 'below 250km' | 'above 250km' | null => {
  const s = String(v || '').trim().toLowerCase()
  if (s === 'below 250km' || s === 'below_250km') return 'below 250km'
  if (s === 'above 250km' || s === 'above_250km') return 'above 250km'
  return null
}

const pickIcon = (categoryName: string): FleetIcon => {
  const s = categoryName.toLowerCase()
  if (s.includes('tempo') || s.includes('traveller') || s.includes('traveler') || s.includes('van')) return 'fa-bus'
  if (s.includes('suv') || s.includes('muv') || s.includes('pickup') || s.includes('tavera')) return 'fa-shuttle-van'
  if (s.includes('sedan')) return 'fa-car-side'
  return 'fa-car'
}

// Tamil Nadu cities for autocomplete
const tamilNaduCities = [
  'Madurai', 'Chennai', 'Coimbatore', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Erode', 'Vellore', 'Kanyakumari', 'Thanjavur',
  'Dindigul', 'Tiruppur', 'Karur', 'Nagercoil', 'Hosur', 'Sivakasi',
  'Pollachi', 'Kanchipuram', 'Tiruvannamalai', 'Kumbakonam'
]

interface FormErrors {
  pickupLocation: string
  dropLocation: string
  journeyStartDate: string
  journeyEndDate: string
}

function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropLocation, setDropLocation] = useState('')
  const [journeyStartDate, setJourneyStartDate] = useState('')
  const [journeyEndDate, setJourneyEndDate] = useState('')
  const [errors, setErrors] = useState<FormErrors>({
    pickupLocation: '',
    dropLocation: '',
    journeyStartDate: '',
    journeyEndDate: ''
  })
  const [isNavigating, setIsNavigating] = useState(false)
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([])
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([])
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropSuggestions, setShowDropSuggestions] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [fleetHireMode, setFleetHireMode] = useState<HireMode>('local')
  const [fleetCards, setFleetCards] = useState<FleetTariffCard[]>([])
  const [fleetLoading, setFleetLoading] = useState(false)
  const pickupRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  // Handle location input with autocomplete
  const handlePickupChange = (value: string) => {
    setPickupLocation(value)
    setErrors(prev => ({ ...prev, pickupLocation: '' }))
    
    if (value.length > 0) {
      const filtered = tamilNaduCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      )
      setPickupSuggestions(filtered)
      setShowPickupSuggestions(true)
    } else {
      setPickupSuggestions([])
      setShowPickupSuggestions(false)
    }
  }

  const handleDropChange = (value: string) => {
    setDropLocation(value)
    setErrors(prev => ({ ...prev, dropLocation: '' }))
    
    if (value.length > 0) {
      const filtered = tamilNaduCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      )
      setDropSuggestions(filtered)
      setShowDropSuggestions(true)
    } else {
      setDropSuggestions([])
      setShowDropSuggestions(false)
    }
  }

  const selectPickupLocation = (city: string) => {
    setPickupLocation(city)
    setPickupSuggestions([])
    setShowPickupSuggestions(false)
  }

  const selectDropLocation = (city: string) => {
    setDropLocation(city)
    setDropSuggestions([])
    setShowDropSuggestions(false)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false)
      }
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setShowDropSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsNavigating(true)
    setTimeout(() => {
      navigate('/enquiry')
    }, 300)
  }

  // Update end date min when start date changes
  useEffect(() => {
    if (journeyStartDate) {
      setErrors(prev => ({ ...prev, journeyEndDate: '' }))
    }
  }, [journeyStartDate])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev >= 2 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Fetch car fleet from backend (stored cars + tariff rows)
  useEffect(() => {
    const fetchFleet = async () => {
      try {
        setFleetLoading(true)
        const apiUrl = import.meta.env.DEV ? '/api/cars/list' : 'http://127.0.0.1:8000/api/cars/list'
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        const cars: ApiCar[] = json?.data || []

        const cards: FleetTariffCard[] = cars
          .filter(c => c && (c.is_active === undefined || c.is_active === true))
          .map((car) => {
            const rows = Array.isArray(car.price_details) ? car.price_details : []
            const below = rows.find(r => normRange(r.range_type) === 'below 250km' && r.price_type === 'day') || rows.find(r => r.price_type === 'day')
            const above = rows.find(r => normRange(r.range_type) === 'above 250km' && r.price_type === 'km') || rows.find(r => r.price_type === 'km')

            const rentPerDay = parseNumber(below?.price)
            const fuelPerKm = parseNumber(below?.fuel_charge)
            const abovePerKm = parseNumber(above?.price)
            const driverBatta = parseNumber(below?.driver_betta)
            const catName = car.category?.name || car.car_name || 'Car'

            return {
              id: String(car.id),
              name: car.category?.name ? `${car.category.name}` : car.car_name,
              icon: pickIcon(catName),
              imageUrl: getBackendImageUrl(car.car_image_url || ''),
              seats: car.additional_details?.no_of_seats,
              rentPerDay,
              fuelPerKm,
              abovePerKm,
              driverBatta,
            }
          })
          // keep only those having some tariff data
          .filter(c => c.rentPerDay > 0 || c.abovePerKm > 0)

        setFleetCards(cards)
      } catch (e) {
        console.error('Fleet fetch failed:', e)
        setFleetCards([])
      } finally {
        setFleetLoading(false)
      }
    }

    fetchFleet()
  }, [])

  // If we land on a hash route like "/#car-fleet", scroll to the section.
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      // Delay helps if images/layout are still settling.
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.hash])

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index)
  }

  return (
    <div className="home-container" style={{ backgroundImage: `url(${meenakshiImage})` }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Main Navigation Bar */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="fas fa-car"></i>
            </div>
            <div className="logo-text">
              <span className="logo-title">CarRental</span>
              <span className="tamil">கார் வாடகை</span>
            </div>
          </div>
          <nav className="main-nav">
            <Link to="/" className="nav-link">
              <i className="fas fa-home"></i> Home
            </Link>
            <a href="#services" className="nav-link">
              <i className="fas fa-concierge-bell"></i> Services
            </a>
            <a href="#car-fleet" className="nav-link">
              <i className="fas fa-car"></i> Car Fleet
            </a>
            <a href="#why-choose" className="nav-link">
              <i className="fas fa-question-circle"></i> About
            </a>
          </nav>
          <div className="nav-cta">
            <div className="phone-number">
              <i className="fas fa-phone-alt"></i>
              <div className="phone-text">
                <span>+91 452 123 4567</span>
                <span className="phone-email">poothanapuvi@gmail.com</span>
              </div>
            </div>

            <Link to="/enquiry" className="book-now-btn" aria-label="Go to enquiry page">
              Enquire Us
            </Link>
          </div>
        </div>

      </header>

      {/* Hero Section */}
      <section id="main-content" className="hero-section">
        {/* Filter Search Section - Positioned above hero content */}
        <div className="filter-section">
          <div className="filter-container">
            <form className="filter-form" onSubmit={handleBookNow} noValidate>
              <div className="filter-field" ref={pickupRef}>
                <label htmlFor="pickup">
                  Pickup Location <span className="required-asterisk">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="pickup"
                    placeholder="Enter pickup location (e.g., Madurai)"
                    value={pickupLocation}
                    onChange={(e) => handlePickupChange(e.target.value)}
                    onFocus={() => pickupLocation.length > 0 && setShowPickupSuggestions(true)}
                    className={`filter-input ${errors.pickupLocation ? 'error' : ''}`}
                    aria-invalid={!!errors.pickupLocation}
                    // aria-required="true"
                    aria-describedby={errors.pickupLocation ? 'pickup-error' : undefined}
                    autoComplete="off"
                  />
                  {showPickupSuggestions && pickupSuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {pickupSuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-item"
                          onClick={() => selectPickupLocation(city)}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.pickupLocation && (
                  <span id="pickup-error" className="error-message" role="alert">
                    {errors.pickupLocation}
                  </span>
                )}
              </div>
              <div className="filter-field" ref={dropRef}>
                <label htmlFor="drop">
                  Drop Location <span className="required-asterisk">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="drop"
                    placeholder="Enter drop location (e.g., Chennai)"
                    value={dropLocation}
                    onChange={(e) => handleDropChange(e.target.value)}
                    onFocus={() => dropLocation.length > 0 && setShowDropSuggestions(true)}
                    className={`filter-input ${errors.dropLocation ? 'error' : ''}`}
                    aria-invalid={!!errors.dropLocation}
                    // aria-required="true"
                    aria-describedby={errors.dropLocation ? 'drop-error' : undefined}
                    autoComplete="off"
                  />
                  {showDropSuggestions && dropSuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {dropSuggestions.map((city, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-item"
                          onClick={() => selectDropLocation(city)}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.dropLocation && (
                  <span id="drop-error" className="error-message" role="alert">
                    {errors.dropLocation}
                  </span>
                )}
              </div>
              <div className="filter-field">
                <label htmlFor="journey_start_date">
                  Journey Start Date <span className="required-asterisk">*</span>
                </label>
                <input
                  type="date"
                  id="journey_start_date"
                  value={journeyStartDate}
                  onChange={(e) => {
                    setJourneyStartDate(e.target.value)
                    setErrors(prev => ({ ...prev, journeyStartDate: '' }))
                  }}
                  className={`filter-input ${errors.journeyStartDate ? 'error' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  aria-invalid={!!errors.journeyStartDate}
                  // aria-required="true"
                  aria-describedby={errors.journeyStartDate ? 'start-date-error' : undefined}
                />
                {errors.journeyStartDate && (
                  <span id="start-date-error" className="error-message" role="alert">
                    {errors.journeyStartDate}
                  </span>
                )}
              </div>
              <div className="filter-field">
                <label htmlFor="journey_end_date">
                  Journey End Date <span className="required-asterisk">*</span>
                </label>
                <input
                  type="date"
                  id="journey_end_date"
                  value={journeyEndDate}
                  onChange={(e) => {
                    setJourneyEndDate(e.target.value)
                    setErrors(prev => ({ ...prev, journeyEndDate: '' }))
                  }}
                  className={`filter-input ${errors.journeyEndDate ? 'error' : ''}`}
                  min={journeyStartDate || new Date().toISOString().split('T')[0]}
                  aria-invalid={!!errors.journeyEndDate}
                  // aria-required="true"
                  aria-describedby={errors.journeyEndDate ? 'end-date-error' : undefined}
                />
                {errors.journeyEndDate && (
                  <span id="end-date-error" className="error-message" role="alert">
                    {errors.journeyEndDate}
                  </span>
                )}
              </div>
              <button 
                type="submit" 
                className="book-now-btn"
                disabled={isNavigating}
                aria-label="Go to enquiry page"
              >
                {isNavigating ? (
                  <>
                    <span className="loading-spinner"></span>
                    Booking...
                  </>
                ) : (
                  'Book Now'
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-right">
            <div className="hero-offer">
              <div className="trivallur-statue-container">
                <img 
                  src={trivaluvarImage}
                  alt="Thiruvalluvar Statue" 
                  className="trivallur-statue-image"
                />
              </div>
              <h2 className="offer-title">
                Are you looking for a great trip?
              </h2>
              <div className="offer-features">
                <div className="feature-item">
                  <span className="feature-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </span>
                  <span>Anywhere and anytime you want</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">
                    <i className="fas fa-star"></i>
                  </span>
                  <span>Extra limousine offer for VIPs</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">
                    <i className="fas fa-shield-alt"></i>
                  </span>
                  <span>Extra insurance included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Highlights */}
        <div className="hero-highlights">
          <div className="highlight-item">
            <div className="highlight-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="highlight-text">Fully Insured</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon">
              <i className="fas fa-headset"></i>
            </div>
            <div className="highlight-text">24/7 Support</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="highlight-text">200+ Locations</div>
          </div>
          <div className="highlight-item">
            <div className="highlight-icon">
              <i className="fas fa-award"></i>
            </div>
            <div className="highlight-text">Award Winning</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-title">
            <h2>
              <i className="fas fa-concierge-bell"></i> Our Services
            </h2>
            <div className="tamil">எங்கள் சேவைகள்</div>
            <p>Comprehensive car rental services for every type of journey</p>
          </div>
          
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3>Chauffeur Service</h3>
              <p>Professional drivers for business meetings, events, or leisure. Hourly, daily, or weekly packages available.</p>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-plane"></i>
              </div>
              <h3>Airport Transfers</h3>
              <p>Reliable airport pickups and drops. Flight tracking, meet & greet service, and fixed pricing.</p>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-route"></i>
              </div>
              <h3>Outstation Trips</h3>
              <p>Long-distance trips with flexible itineraries. Multiple city tours, hill station visits, and pilgrimage tours.</p>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <h3>Corporate Rentals</h3>
              <p>Special packages for businesses with multiple vehicles, billing preferences, and priority support.</p>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-ring"></i>
              </div>
              <h3>Wedding & Events</h3>
              <p>Decorated cars for weddings and special events. Multiple car packages with professional drivers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Car Fleet — transparent tariff (reference layout, Madurai theme) */}
      <section id="car-fleet" className="car-fleet-v2">
        <div className="container">
          <header className="tariff-v2-header">
            <div className="tariff-v2-trust">
              <i className="fas fa-gem" aria-hidden="true"></i>
              No hidden costs
            </div>
            <h2 className="tariff-v2-title">Transparent tariff packages</h2>
            <p className="tariff-v2-sub">
              Outstation &amp; Local hire · Rates indicative, confirm at booking
            </p>
            <div className="tamil tariff-v2-tamil">எங்கள் கார் பட்டாளம்</div>
          </header>

          <div className="tariff-v2-notice" role="note">
            <div className="tariff-v2-notice__left">
              <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
              <span>
                <strong>Extra as applicable:</strong> Tollgate · Parking · Hills Charges
              </span>
            </div>
            <span className="tariff-v2-notice__right">Pay directly or as per invoice</span>
          </div>

          <div className="tariff-v2-toggle" role="group" aria-label="Hire type">
            <button
              type="button"
              className={`tariff-v2-toggle__btn ${fleetHireMode === 'local' ? 'is-active' : ''}`}
              onClick={() => setFleetHireMode('local')}
              aria-pressed={fleetHireMode === 'local'}
            >
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              Local hire (Below 250 km/day)
            </button>
            <button
              type="button"
              className={`tariff-v2-toggle__btn ${fleetHireMode === 'outstation' ? 'is-active' : ''}`}
              onClick={() => setFleetHireMode('outstation')}
              aria-pressed={fleetHireMode === 'outstation'}
            >
              <i className="fas fa-route" aria-hidden="true"></i>
              Outstation (Above 250 km/day)
            </button>
          </div>

          <div className="tariff-v2-grid">
            {fleetLoading ? (
              <div className="tariff-v2-notice" role="status" aria-live="polite">
                <div className="tariff-v2-notice__left">
                  <i className="fas fa-spinner" aria-hidden="true"></i>
                  <span>Loading fleet…</span>
                </div>
              </div>
            ) : fleetCards.length === 0 ? (
              <div className="tariff-v2-notice" role="note">
                <div className="tariff-v2-notice__left">
                  <i className="fas fa-info-circle" aria-hidden="true"></i>
                  <span>No cars available right now.</span>
                </div>
                <span className="tariff-v2-notice__right">Please check back soon</span>
              </div>
            ) : (
              fleetCards.map((pkg) => (
              <article key={pkg.id} className="tariff-v2-card">
                {pkg.imageUrl ? (
                  <div className="tariff-v2-card__media" aria-hidden="true">
                    <img
                      src={pkg.imageUrl}
                      alt=""
                      className="tariff-v2-card__media-img"
                      loading="lazy"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                ) : null}
                <div className="tariff-v2-card__top">
                  <div className="tariff-v2-card__icon" aria-hidden="true">
                    <i className={`fas ${pkg.icon}`}></i>
                  </div>
                  <div className="tariff-v2-card__heading">
                    <h3 className="tariff-v2-card__name">{pkg.name}</h3>
                    {pkg.seats ? (
                      <div className="tariff-v2-card__seats">{pkg.seats} Seater</div>
                    ) : null}
                  </div>
                </div>

                {fleetHireMode === 'local' ? (
                  <>
                    <div className="tariff-v2-card__hero">
                      <span className="tariff-v2-card__hero-price">₹{pkg.rentPerDay.toLocaleString('en-IN')}</span>
                      <span className="tariff-v2-card__hero-unit">/ day</span>
                    </div>
                    <div className="tariff-v2-pill tariff-v2-pill--muted">
                      <i className="fas fa-gas-pump" aria-hidden="true"></i>
                      Fuel charge: ₹{pkg.fuelPerKm} per km
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tariff-v2-card__hero">
                      <span className="tariff-v2-card__hero-price">₹{pkg.abovePerKm}</span>
                      <span className="tariff-v2-card__hero-unit">/ km</span>
                    </div>
                    <div className="tariff-v2-pill tariff-v2-pill--accent">
                      <i className="fas fa-check-circle" aria-hidden="true"></i>
                      Includes fuel + per-day km rate
                    </div>
                  </>
                )}

                <div className="tariff-v2-card__divider" />

                {fleetHireMode === 'local' ? (
                  <div className="tariff-v2-card__row">
                    <span className="tariff-v2-card__row-label">
                      <i className="fas fa-level-up-alt tariff-v2-card__row-ico" aria-hidden="true"></i>
                      Above 250 km
                    </span>
                    <span className="tariff-v2-card__row-value">₹{pkg.abovePerKm}/km</span>
                  </div>
                ) : (
                  <div className="tariff-v2-card__row">
                    <span className="tariff-v2-card__row-label">
                      <i className="fas fa-map-marker-alt tariff-v2-card__row-ico" aria-hidden="true"></i>
                      Local (below 250 km)
                    </span>
                    <span className="tariff-v2-card__row-value">
                      ₹{pkg.rentPerDay.toLocaleString('en-IN')} + ₹{pkg.fuelPerKm}/km
                    </span>
                  </div>
                )}

                <div className="tariff-v2-batta">
                  <i className="fas fa-user-tie" aria-hidden="true"></i>
                  Driver batta: ₹{pkg.driverBatta.toLocaleString('en-IN')}
                </div>
                <p className="tariff-v2-card__fineprint">+ Toll, Parking, Hills extra</p>

                <button
                  type="button"
                  className="tariff-v2-card__book"
                  onClick={() => navigate('/enquiry')}
                >
                  Book now <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </button>
              </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose" id="why-choose">
        <div className="container">
          <div className="section-title">
            <h2>
              <i className="fas fa-check-circle"></i> Why Choose Us
            </h2>
            <div className="tamil">ஏன் நாங்கள் தேர்வு செய்ய வேண்டும்</div>
            <p>We stand out from the competition with our exceptional service and customer-centric approach</p>
          </div>
          
          <div className="why-grid">
            <div className="why-item">
              <div className="why-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="why-content">
                <h3>Fully Insured Vehicles</h3>
                <p>All our vehicles come with comprehensive insurance coverage for your complete peace of mind during the journey.</p>
              </div>
            </div>
            
            <div className="why-item">
              <div className="why-icon">
                <i className="fas fa-headset"></i>
              </div>
              <div className="why-content">
                <h3>24/7 Customer Support</h3>
                <p>Our customer support team is available round the clock to assist you with any queries or emergency situations.</p>
              </div>
            </div>
            
            <div className="why-item">
              <div className="why-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <div className="why-content">
                <h3>Local Knowledge</h3>
                <p>Our drivers have excellent knowledge of local routes, shortcuts, and destinations across Tamil Nadu.</p>
              </div>
            </div>
            
            <div className="why-item">
              <div className="why-icon">
                <i className="fas fa-rupee-sign"></i>
              </div>
              <div className="why-content">
                <h3>Transparent Pricing</h3>
                <p>No hidden charges. What you see is what you pay. All taxes and fees are included in the quoted price.</p>
              </div>
            </div>
            
            <div className="why-item">
              <div className="why-icon">
                <i className="fas fa-car"></i>
              </div>
              <div className="why-content">
                <h3>Well-Maintained Fleet</h3>
                <p>Regular maintenance and cleanliness checks ensure our vehicles are in top condition for your safety and comfort.</p>
              </div>
            </div>
            
            <div className="why-item">
              <div className="why-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="why-content">
                <h3>Quick Booking Process</h3>
                <p>Book your car in less than 2 minutes through our website or mobile app with instant confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>
              <i className="fas fa-comment-alt"></i> Customer Testimonials
            </h2>
            <div className="tamil">வாடிக்கையாளர் பாராட்டுகள்</div>
            <p>See what our customers have to say about their experience with us</p>
          </div>
          
          <div className="testimonial-slider">
            <div className={`testimonial-item ${currentTestimonial === 0 ? 'active' : ''}`}>
              <div className="testimonial-text">
                "Excellent service! Booked a car for a family trip to Kodaikanal. The vehicle was clean, well-maintained, and the driver was very knowledgeable about the routes. Will definitely use again!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Rajesh Kumar</h4>
                  <p>Family Trip • March 2023</p>
                </div>
              </div>
            </div>
            
            <div className={`testimonial-item ${currentTestimonial === 1 ? 'active' : ''}`}>
              <div className="testimonial-text">
                "As a business traveler, I need reliable transportation. CarRental provided a professional chauffeur and comfortable sedan for my meetings. Punctual and courteous service."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="author-info">
                  <h4>Priya Sharma</h4>
                  <p>Business Travel • February 2023</p>
                </div>
              </div>
            </div>
            
            <div className={`testimonial-item ${currentTestimonial === 2 ? 'active' : ''}`}>
              <div className="testimonial-text">
                "Booked a car for a weekend getaway to Kodaikanal. The booking process was smooth, pickup was hassle-free, and the car was in perfect condition. Great value for money and perfect for travelers!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <div className="author-info">
                  <h4>Arun Balaji</h4>
                  <p>Weekend Trip • January 2023</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-nav">
              <button 
                className={`nav-dot ${currentTestimonial === 0 ? 'active' : ''}`}
                onClick={() => goToTestimonial(0)}
                aria-label="Testimonial 1"
              ></button>
              <button 
                className={`nav-dot ${currentTestimonial === 1 ? 'active' : ''}`}
                onClick={() => goToTestimonial(1)}
                aria-label="Testimonial 2"
              ></button>
              <button 
                className={`nav-dot ${currentTestimonial === 2 ? 'active' : ''}`}
                onClick={() => goToTestimonial(2)}
                aria-label="Testimonial 3"
              ></button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="destinations">
        <div className="container">
          <div className="section-title">
            <h2>
              <i className="fas fa-map-marked-alt"></i> Popular Destinations
            </h2>
            <div className="tamil">பிரபலமான இடங்கள்</div>
            <p>Explore Tamil Nadu's most beautiful places with our rental cars</p>
          </div>
          
          <div className="destination-grid">
            <div className="destination-card">
              <img src="https://images.unsplash.com/photo-1595599512947-92c571860ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Chennai" loading="lazy" />
              <div className="destination-overlay">
                <h3>Chennai</h3>
                <div className="tamil">சென்னை</div>
                <p>Marina Beach, Kapaleeshwarar Temple</p>
              </div>
            </div>
            
            <div className="destination-card">
              <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Madurai" loading="lazy" />
              <div className="destination-overlay">
                <h3>Madurai</h3>
                <div className="tamil">மதுரை</div>
                <p>Meenakshi Temple, Thirumalai Nayakkar Palace</p>
              </div>
            </div>
            
            <div className="destination-card">
              <img src="https://images.unsplash.com/photo-1622279452202-5b847faf7033?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Ooty" loading="lazy" />
              <div className="destination-overlay">
                <h3>Ooty</h3>
                <div className="tamil">ஊட்டி</div>
                <p>Nilgiri Mountains, Botanical Gardens</p>
              </div>
            </div>
            
            <div className="destination-card">
              <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Kanyakumari" loading="lazy" />
              <div className="destination-overlay">
                <h3>Kanyakumari</h3>
                <div className="tamil">கன்னியாகுமரி</div>
                <p>Sunrise Point, Vivekananda Rock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp & Call Floating Buttons */}
      <div className="float-buttons">
        <a 
          href="https://wa.me/9194521234567?text=Hello%20CarRental%20I%20need%20information%20about%20car%20rental" 
          className="whatsapp-float" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <a 
          href="tel:+914521234567" 
          className="call-float"
          aria-label="Call us"
        >
          <i className="fas fa-phone-alt"></i>
        </a>
      </div>


      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>CarRental</h3>
              <div className="tamil">கார் வாடகை</div>
              <p>Your trusted partner for car rentals across Tamil Nadu. Experience comfort, reliability, and excellent service with our premium fleet.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
            
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/cars">Our Cars</Link></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#why-choose">About Us</a></li>
                <li><a href="#destinations">Destinations</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Car Types</h3>
              <ul className="footer-links">
                <li><a href="#">Economy Cars</a></li>
                <li><a href="#">Sedans</a></li>
                <li><a href="#">SUVs & MUVs</a></li>
                <li><a href="#">Luxury Cars</a></li>
                <li><a href="#">Tempo Travelers</a></li>
                <li><a href="#">Traveler Packages</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Contact Info</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <strong>Address:</strong><br />
                    123 Anna Salai,<br />
                    Near Meenakshi Temple,<br />
                    Madurai - 625020
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <div>
                    <strong>Phone:</strong><br />
                    +91 452 123 4567<br />
                    +91 98765 43210
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <strong>Email:</strong><br />
                    info@carrental.com<br />
                    support@carrental.com
                  </div>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <strong>Available:</strong><br />
                    24/7 Service
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} CarRental. All rights reserved.</p>
            <div className="tamil">கார் வாடகை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
