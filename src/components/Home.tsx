import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import meenakshiImage from '../assets/images/Bg/meenakshi-amman-temple-india.avif'
import trivaluvarImage from '../assets/images/Bg/trivaluvar.jpeg'
import car1 from '../assets/images/cars/car1.jpeg'
import car2 from '../assets/images/cars/car2.jpeg'
import car3 from '../assets/images/cars/car3.jpeg'
import car4 from '../assets/images/cars/car4.jpeg'
import './Home.css'

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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      pickupLocation: '',
      dropLocation: '',
      journeyStartDate: '',
      journeyEndDate: ''
    }

    let isValid = true

    if (!pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required'
      isValid = false
    }

    if (!dropLocation.trim()) {
      newErrors.dropLocation = 'Drop location is required'
      isValid = false
    }

    if (!journeyStartDate) {
      newErrors.journeyStartDate = 'Journey start date is required'
      isValid = false
    }

    if (!journeyEndDate) {
      newErrors.journeyEndDate = 'Journey end date is required'
      isValid = false
    } else if (journeyStartDate && new Date(journeyEndDate) < new Date(journeyStartDate)) {
      newErrors.journeyEndDate = 'End date must be after start date'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.filter-input.error, .filter-field:has(.error-message)')
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    
    setIsNavigating(true)
    
    // Small delay for better UX
    setTimeout(() => {
      navigate('/cars', {
        state: {
          journeyDetails: {
            pickup_location: pickupLocation.trim(),
            drop_location: dropLocation.trim(),
            journey_from_date: journeyStartDate,
            journey_end_date: journeyEndDate
          }
        }
      })
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
            <Link to="/cars" className="nav-link">
              <i className="fas fa-car"></i> Cars
            </Link>
            <a href="#why-choose" className="nav-link">
              <i className="fas fa-question-circle"></i> About
            </a>
          </nav>
          <div className="nav-cta">
            <div className="phone-number">
              <i className="fas fa-phone-alt"></i>
              <span>+91 452 123 4567</span>
            </div>
            <div className="search-icon">
              <i className="fas fa-search"></i>
            </div>
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
                    aria-required="true"
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
                    aria-required="true"
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
                  aria-required="true"
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
                  aria-required="true"
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
                aria-label="Book your car rental now"
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

      {/* Car Categories Section */}
      <section className="car-categories">
        <div className="container">
            <div className="section-title">
            <h2>
              <i className="fas fa-car"></i> Our Car Fleet
            </h2>
            <div className="tamil">எங்கள் கார் பட்டாளம்</div>
            <p>Perfect vehicles for travelers exploring Tamil Nadu - comfortable, reliable, and ready for your journey</p>
          </div>
          
          <div className="category-grid">
            <div className="category-card">
              <div className="category-img">
                <img src={car1} alt="Economy Car" loading="lazy" />
              </div>
              <div className="category-info">
                <h3>Economy Cars</h3>
                <div className="category-features">
                  <div className="feature">
                    <i className="fas fa-user"></i> 4 People
                  </div>
                  <div className="feature">
                    <i className="fas fa-suitcase"></i> 2 Bags
                  </div>
                  <div className="feature">
                    <i className="fas fa-snowflake"></i> AC
                  </div>
                </div>
                <p>Perfect for city travel and short trips. Comfortable and ideal for travelers exploring Madurai.</p>
                <button className="book-btn" onClick={() => navigate('/cars')}>
                  Book Now
                </button>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-img">
                <img src={car2} alt="SUV" loading="lazy" />
              </div>
              <div className="category-info">
                <h3>SUV & MUV</h3>
                <div className="category-features">
                  <div className="feature">
                    <i className="fas fa-user"></i> 7 People
                  </div>
                  <div className="feature">
                    <i className="fas fa-suitcase"></i> 5 Bags
                  </div>
                  <div className="feature">
                    <i className="fas fa-snowflake"></i> AC
                  </div>
                </div>
                <p>Ideal for family trips and hill station visits. Perfect for travelers with luggage and groups.</p>
                <button className="book-btn" onClick={() => navigate('/cars')}>
                  Book Now
                </button>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-img">
                <img src={car3} alt="Luxury Car" loading="lazy" />
              </div>
              <div className="category-info">
                <h3>Luxury Cars</h3>
                <div className="category-features">
                  <div className="feature">
                    <i className="fas fa-user"></i> 4 People
                  </div>
                  <div className="feature">
                    <i className="fas fa-suitcase"></i> 3 Bags
                  </div>
                  <div className="feature">
                    <i className="fas fa-snowflake"></i> AC
                  </div>
                </div>
                <p>For business travelers and special occasions. Premium comfort and style for discerning travelers.</p>
                <button className="book-btn" onClick={() => navigate('/cars')}>
                  Book Now
                </button>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-img">
                <img src={car4} alt="Tempo Traveler" loading="lazy" />
              </div>
              <div className="category-info">
                <h3>Tempo Travelers</h3>
                <div className="category-features">
                  <div className="feature">
                    <i className="fas fa-user"></i> 12 People
                  </div>
                  <div className="feature">
                    <i className="fas fa-suitcase"></i> 8 Bags
                  </div>
                  <div className="feature">
                    <i className="fas fa-snowflake"></i> AC
                  </div>
                </div>
                <p>Perfect for large groups, pilgrimages, and group tours. Spacious and comfortable for extended journeys.</p>
                <button className="book-btn" onClick={() => navigate('/cars')}>
                  Book Now
                </button>
              </div>
            </div>
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
