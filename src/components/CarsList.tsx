import { useState } from 'react'
import { Link } from 'react-router-dom'
import './CarsList.css'

interface Car {
  id: number
  name: string
  model: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  features: string[]
  transmission: string
  seats: number
  fuel: string
  available: boolean
  discount?: number
}

function CarsList() {
  const [sortBy, setSortBy] = useState('cheapest')
  const [priceRange, setPriceRange] = useState([5000, 30000])
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Non Stop'])
  const [selectedDate, setSelectedDate] = useState('Fri, Nov 14, 2025')

  const cars: Car[] = [
    {
      id: 1,
      name: 'Toyota Innova Crysta',
      model: '2024',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      price: 5769,
      originalPrice: 6500,
      rating: 4.5,
      features: ['AC', 'Music System', 'GPS'],
      transmission: 'Manual',
      seats: 7,
      fuel: 'Diesel',
      available: true,
      discount: 20
    },
    {
      id: 2,
      name: 'Toyota Innova',
      model: '2023',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      price: 5844,
      rating: 4.3,
      features: ['AC', 'Music System', 'GPS', 'Reverse Camera'],
      transmission: 'Automatic',
      seats: 7,
      fuel: 'Petrol',
      available: true
    },
    {
      id: 3,
      name: 'Toyota Innova Crysta',
      model: '2024',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&q=80',
      price: 4998,
      originalPrice: 6000,
      rating: 4.7,
      features: ['AC', 'Music System', 'GPS', 'Reverse Camera', 'Sunroof'],
      transmission: 'Automatic',
      seats: 7,
      fuel: 'Diesel',
      available: true,
      discount: 15
    },
    {
      id: 4,
      name: 'Toyota Innova',
      model: '2023',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&q=80',
      price: 6500,
      rating: 4.4,
      features: ['AC', 'Music System', 'GPS'],
      transmission: 'Manual',
      seats: 7,
      fuel: 'Diesel',
      available: true
    },
    {
      id: 5,
      name: 'Toyota Innova Crysta',
      model: '2024',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&q=80',
      price: 5747,
      rating: 4.6,
      features: ['AC', 'Music System', 'GPS', 'Reverse Camera'],
      transmission: 'Automatic',
      seats: 7,
      fuel: 'Petrol',
      available: true
    }
  ]

  const dates = [
    { date: 'Thu, Nov 13', price: 7134 },
    { date: 'Fri, Nov 14', price: 5769 },
    { date: 'Sat, Nov 15', price: 5419 },
    { date: 'Sun, Nov 16', price: 5441 },
    { date: 'Mon, Nov 17', price: 4998 },
    { date: 'Tue, Nov 18', price: 4998 },
    { date: 'Wed, Nov 19', price: 4998 },
    { date: 'Thu, Nov 20', price: 5747 }
  ]

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const clearAllFilters = () => {
    setSelectedFilters([])
  }

  const sortedCars = [...cars].sort((a, b) => {
    if (sortBy === 'cheapest') return a.price - b.price
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className="cars-list-container">
      {/* Navigation Header */}
      <header className="cars-list-nav">
        <div className="nav-content">
          <Link to="/" className="logo-link">
            <div className="logo-circle">Be</div>
            <span className="logo-text">CarRental</span>
          </Link>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Home</Link>
            <a href="#" className="nav-link">Who we are</a>
            <Link to="/cars" className="nav-link active">Cars</Link>
            <a href="#" className="nav-link">Special offer</a>
            <a href="#" className="nav-link">Contact us</a>
          </nav>
        </div>
      </header>

      <div className="cars-list-header">
        <h1>Cars from New Delhi to Mumbai</h1>
        <p className="subtitle">Select your preferred car for rental</p>
      </div>

      {/* Date Carousel */}
      <div className="date-carousel">
        <button className="carousel-nav prev">‹</button>
        <div className="date-scroll">
          {dates.map((item, index) => (
            <div
              key={index}
              className={`date-item ${item.date === selectedDate ? 'active' : ''}`}
              onClick={() => setSelectedDate(item.date)}
            >
              <div className="date-text">{item.date}</div>
              <div className="date-price">₹ {item.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <button className="carousel-nav next">›</button>
      </div>

      <div className="cars-list-content">
        {/* Left Sidebar - Filters */}
        <aside className="filters-sidebar">
          <div className="filters-section">
            <div className="applied-filters">
              <h3>Applied Filters</h3>
              {selectedFilters.length > 0 ? (
                <div className="filter-tags">
                  {selectedFilters.map((filter, index) => (
                    <span key={index} className="filter-tag">
                      {filter}
                      <button onClick={() => toggleFilter(filter)}>×</button>
                    </span>
                  ))}
                  <button className="clear-all" onClick={clearAllFilters}>
                    CLEAR ALL
                  </button>
                </div>
              ) : (
                <p className="no-filters">No filters applied</p>
              )}
            </div>

            <div className="filter-group">
              <h3>Popular Filters</h3>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes('Non Stop')}
                  onChange={() => toggleFilter('Non Stop')}
                />
                <span>Non Stop</span>
                <span className="filter-price">₹ 5,769</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes('AC')}
                  onChange={() => toggleFilter('AC')}
                />
                <span>AC Available</span>
                <span className="filter-price">₹ 5,769</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes('Automatic')}
                  onChange={() => toggleFilter('Automatic')}
                />
                <span>Automatic</span>
                <span className="filter-price">₹ 6,500</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes('GPS')}
                  onChange={() => toggleFilter('GPS')}
                />
                <span>GPS Navigation</span>
                <span className="filter-price">₹ 5,844</span>
              </label>
            </div>

            <div className="filter-group">
              <h3>Price Range</h3>
              <div className="price-range">
                <div className="price-display">
                  <span>₹ {priceRange[0].toLocaleString()}</span>
                  <span>₹ {priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="30000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-slider"
                />
              </div>
            </div>

            <div className="filter-group">
              <h3>Transmission</h3>
              <label className="filter-checkbox">
                <input type="checkbox" />
                <span>Manual</span>
                <span className="filter-price">₹ 5,769</span>
              </label>
              <label className="filter-checkbox">
                <input type="checkbox" />
                <span>Automatic</span>
                <span className="filter-price">₹ 6,500</span>
              </label>
            </div>

            <div className="filter-group">
              <h3>Seating Capacity</h3>
              <label className="filter-checkbox">
                <input type="checkbox" />
                <span>5 Seater</span>
                <span className="filter-price">₹ 4,500</span>
              </label>
              <label className="filter-checkbox">
                <input type="checkbox" />
                <span>7 Seater</span>
                <span className="filter-price">₹ 5,769</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="cars-main-content">
          {/* Sort Options */}
          <div className="sort-options">
            <button
              className={`sort-btn ${sortBy === 'cheapest' ? 'active' : ''}`}
              onClick={() => setSortBy('cheapest')}
            >
              CHEAPEST
              <span className="sort-info">₹ {sortedCars[0]?.price.toLocaleString()} | 7 Seater</span>
            </button>
            <button
              className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
              onClick={() => setSortBy('rating')}
            >
              HIGHEST RATED
              <span className="sort-info">₹ {sortedCars[0]?.price.toLocaleString()} | 7 Seater</span>
            </button>
            <button className="sort-btn">
              YOU MAY PREFER
              <span className="sort-info">₹ {sortedCars[0]?.price.toLocaleString()} | 7 Seater</span>
            </button>
            <button className="sort-btn other-sort">
              Other Sort
            </button>
          </div>

          <div className="sort-info-text">
            <p>Cars sorted by Lowest fares on this route</p>
            <p className="cheaper-note">Cheaper cars available on 17 Nov & 18 Nov</p>
          </div>

          {/* Car Listings */}
          <div className="car-listings">
            {sortedCars.map((car) => (
              <div key={car.id} className="car-listing-card">
                {car.discount && (
                  <div className="discount-badge">{car.discount}% OFF</div>
                )}
                <div className="car-listing-content">
                  <div className="car-image-section">
                    <img src={car.image} alt={car.name} className="car-listing-image" />
                  </div>
                  <div className="car-details-section">
                    <div className="car-header">
                      <div className="car-name-section">
                        <h3 className="car-listing-name">{car.name}</h3>
                        <span className="car-model">{car.model}</span>
                        <div className="car-rating">
                          <span className="stars">★★★★★</span>
                          <span className="rating-value">{car.rating}</span>
                        </div>
                      </div>
                      <div className="car-price-section">
                        {car.originalPrice && (
                          <span className="original-price">₹ {car.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="current-price">₹ {car.price.toLocaleString()}</span>
                        <span className="price-label">per day</span>
                      </div>
                    </div>

                    <div className="car-specs">
                      <div className="spec-item">
                        <span className="spec-label">Transmission:</span>
                        <span className="spec-value">{car.transmission}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Seats:</span>
                        <span className="spec-value">{car.seats}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Fuel:</span>
                        <span className="spec-value">{car.fuel}</span>
                      </div>
                    </div>

                    <div className="car-features">
                      {car.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>

                    <div className="car-actions">
                      <button className="view-prices-btn">VIEW PRICES</button>
                      <button className="lock-price-btn">Lock this price starting from ₹ 306 →</button>
                      <button className="compare-btn">Add to compare +</button>
                    </div>

                    <div className="car-offers">
                      <span className="offer-text">• FLAT ₹ 335 OFF using CARSUPER</span>
                      <a href="#" className="view-details-link">View Car Details</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CarsList

