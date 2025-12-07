import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropLocation, setDropLocation] = useState('')
  const [journeyStartDate, setJourneyStartDate] = useState('')
  const [journeyEndDate, setJourneyEndDate] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Car images array
  const carImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      alt: 'Silver Toyota Innova Crysta',
      name: 'Toyota Innova Crysta'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      alt: 'Silver Toyota Innova',
      name: 'Toyota Innova'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&q=80',
      alt: 'White Toyota Innova Crysta',
      name: 'Toyota Innova Crysta'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&q=80',
      alt: 'Modern Toyota Innova Crysta',
      name: 'Toyota Innova Crysta'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&q=80',
      alt: 'White Toyota Innova',
      name: 'Toyota Innova'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&q=80',
      alt: 'Silver Toyota Innova Crysta',
      name: 'Toyota Innova Crysta'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&q=80',
      alt: 'White Toyota Innova Crysta',
      name: 'Toyota Innova Crysta'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&q=80',
      alt: 'Modern Toyota Innova',
      name: 'Toyota Innova'
    }
  ]

  const carsPerView = 4
  const maxSlide = Math.max(0, carImages.length - carsPerView)

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= maxSlide) {
          return 0
        }
        return prev + 1
      })
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [maxSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev >= maxSlide) {
        return 0
      }
      return prev + 1
    })
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        return maxSlide
      }
      return prev - 1
    })
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!journeyStartDate || !journeyEndDate) {
      alert('Please select journey start date and end date')
      return
    }
    
    // Navigate to cars list page with journey details
    navigate('/cars', {
      state: {
        journeyDetails: {
          pickup_location: pickupLocation,
          drop_location: dropLocation,
          journey_from_date: journeyStartDate,
          journey_end_date: journeyEndDate
        }
      }
    })
  }

  return (
    <div className="home-container">
      {/* Top Bar - Utility Header */}
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            <span>Have any questions?</span>
            <span className="contact-info">+61 383 766 284</span>
            <span className="contact-info">noreply@envato.com</span>
          </div>
          <div className="top-bar-right">
            <a href="#" className="social-icon">f</a>
            <a href="#" className="social-icon">g+</a>
            <a href="#" className="social-icon">t</a>
            <a href="#" className="social-icon">v</a>
            <a href="#" className="social-icon">d</a>
            <a href="#" className="social-icon">in</a>
            <a href="#" className="social-icon">p</a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-circle">Be</div>
            <span className="logo-text">CarRental</span>
          </div>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Home</Link>
            <a href="#" className="nav-link">Who we are</a>
            <Link to="/cars" className="nav-link">Cars</Link>
            <a href="#" className="nav-link">Special offer</a>
            <a href="#" className="nav-link">Contact us</a>
          </nav>
          <div className="search-icon">🔍</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Filter Search Section - Positioned above hero content */}
        <div className="filter-section">
          <div className="filter-container">
            <form className="filter-form" onSubmit={handleBookNow}>
              <div className="filter-field">
                <label htmlFor="pickup">Pickup Location</label>
                <input
                  type="text"
                  id="pickup"
                  placeholder="Enter pickup location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="filter-input"
                />
              </div>
              <div className="filter-field">
                <label htmlFor="drop">Drop Location</label>
                <input
                  type="text"
                  id="drop"
                  placeholder="Enter drop location"
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  className="filter-input"
                />
              </div>
              <div className="filter-field">
                <label htmlFor="journey_start_date">Journey Start Date</label>
                <input
                  type="date"
                  id="journey_start_date"
                  value={journeyStartDate}
                  onChange={(e) => setJourneyStartDate(e.target.value)}
                  className="filter-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="filter-field">
                <label htmlFor="journey_end_date">Journey End Date</label>
                <input
                  type="date"
                  id="journey_end_date"
                  value={journeyEndDate}
                  onChange={(e) => setJourneyEndDate(e.target.value)}
                  className="filter-input"
                  min={journeyStartDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <button type="submit" className="book-now-btn">
                Book Now
              </button>
            </form>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-left">
            <div className="car-image-container">
              <div className="car-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop" 
                  alt="Luxury Car" 
                  className="car-image"
                />
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-offer">
              <h2 className="offer-title">Rent a car from $99/day</h2>
              <div className="offer-features">
                <div className="feature-item">
                  <span className="feature-icon">📍</span>
                  <span>Anywhere and anytime you want</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⭐</span>
                  <span>Extra limousine offer for VIPs</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <span>Extra insurance included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car Listings Gallery - Slider */}
      <section className="car-gallery">
        <div className="gallery-header">
          <h2 className="gallery-title">Our Fleet</h2>
          <p className="gallery-subtitle">Choose from our premium collection</p>
        </div>
        <div className="car-slider-container">
          <button className="slider-btn slider-btn-prev" onClick={prevSlide} aria-label="Previous slide">
            ‹
          </button>
          <div className="car-slider-wrapper">
            <div 
              className="car-slider-track" 
              style={{ transform: `translateX(-${currentSlide * (100 / carsPerView)}%)` }}
            >
              {carImages.map((car) => (
                <div key={car.id} className="car-slide">
                  <div className="car-card">
                    <div className="car-card-image">
                      <img src={car.src} alt={car.alt} className="car-slide-image" />
                      <div className="car-card-overlay">
                        <h3 className="car-name">{car.name}</h3>
                        <button className="view-details-btn">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="slider-btn slider-btn-next" onClick={nextSlide} aria-label="Next slide">
            ›
          </button>
        </div>
        <div className="slider-dots">
          {Array.from({ length: maxSlide + 1 }).map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Sidebar Floating Elements */}
      <div className="sidebar-elements">
        <button className="sidebar-btn settings-btn">⚙️</button>
        <button className="sidebar-btn demos-btn">
          <span>⭐</span>
          <span className="btn-text">demos</span>
        </button>
      </div>
    </div>
  )
}

export default Home
