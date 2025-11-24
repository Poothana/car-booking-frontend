import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CarsList.css'

interface ApiCategory {
  id: number
  name: string
}

interface ApiPriceDetail {
  id?: number
  car_id?: number
  price_type: string
  min_hours?: number
  price: string | number // Can be string from API
  created_at?: string
  updated_at?: string
}

interface ApiCar {
  id: number
  car_name: string
  car_model: string
  car_image_url: string
  car_category: number
  is_active: boolean
  category: ApiCategory
  price_details?: ApiPriceDetail[]
  discount_price_details?: ApiPriceDetail[]
}

interface ApiResponse {
  success: boolean
  data: ApiCar[]
}

interface Car {
  id: number
  name: string
  model: string
  image: string
  price: number | undefined
  originalPrice?: number
  rating: number
  features: string[]
  transmission: string
  seats: number
  fuel: string
  available: boolean
  discount?: number
  isDiscount?: boolean // Flag to indicate if showing discount price
  category?: string
}

function CarsList() {
  const [sortBy, setSortBy] = useState('cheapest')
  const [priceRange, setPriceRange] = useState([5000, 30000])
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Non Stop'])
  const [selectedDate, setSelectedDate] = useState('Fri, Nov 14, 2025')
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to get backend image URL from API image URL/name
  const getBackendImageUrl = (imageUrl: string): string => {
    if (!imageUrl) {
      return '' // Return empty string or a placeholder image URL
    }
    
    // If it's already a full URL (starts with http:// or https://), use it as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    // If it's just a filename, construct the backend storage URL
    // Backend serves images at /storage/cars/
    const backendBaseUrl = import.meta.env.DEV 
      ? 'http://localhost:8000' 
      : window.location.origin
    
    // Remove leading slash if present to avoid double slashes
    const cleanImagePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl
    
    // Construct URL: http://localhost:8000/storage/cars/{filename}
    return `${backendBaseUrl}/storage/cars/${cleanImagePath}`
  }

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        setError(null)
        // Using proxy path through Vite dev server to avoid CORS issues
        const apiUrl = import.meta.env.DEV 
          ? '/api/cars/list' 
          : 'http://127.0.0.1:8000/api/cars/list'
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const apiResponse: ApiResponse = await response.json()
        
        if (apiResponse.success && apiResponse.data) {
          // Map API data to component's Car interface
          const mappedCars: Car[] = apiResponse.data
            .map((apiCar): Car => {
              // Generate default values for fields not in API response
              const rating = 4.0 + (Math.random() * 1.0) // Random rating between 4.0-5.0
              
              // Default features based on category
              const defaultFeatures = ['AC', 'Music System', 'GPS']
              if (apiCar.car_category >= 5) {
                defaultFeatures.push('Premium Sound', 'Sunroof')
              }
              
              // Default specs based on category
              const getTransmission = () => {
                if (apiCar.car_category >= 5) return 'Automatic'
                return Math.random() > 0.5 ? 'Automatic' : 'Manual'
              }
              
              const getSeats = () => {
                if (apiCar.car_category === 4) return 7 // MUV
                if (apiCar.car_category === 3) return 7 // SUV
                return 5 // Others
              }
              
              const getFuel = () => {
                const fuels = ['Petrol', 'Diesel', 'Hybrid']
                return fuels[Math.floor(Math.random() * fuels.length)]
              }

              // Get backend image URL from API response
              const backendImageUrl = getBackendImageUrl(apiCar.car_image_url)

              // Helper function to convert price string/number to number, treating "0.00" as invalid
              const parsePrice = (price: string | number | undefined): number | undefined => {
                if (!price) return undefined
                const numPrice = typeof price === 'string' ? parseFloat(price) : price
                // Treat 0 or "0.00" as no price
                return numPrice && numPrice > 0 ? numPrice : undefined
              }

              // Extract prices from price_details
              let weeklyPrice: number | undefined = undefined
              let dayPrice: number | undefined = undefined
              
              if (apiCar.price_details && apiCar.price_details.length > 0) {
                // Find weekly price
                const weeklyPriceDetail = apiCar.price_details.find(pd => 
                  pd.price_type && pd.price_type.toLowerCase() === 'week'
                )
                
                // Find day price
                const dayPriceDetail = apiCar.price_details.find(pd => 
                  pd.price_type && pd.price_type.toLowerCase() === 'day'
                )
                
                if (weeklyPriceDetail) {
                  weeklyPrice = parsePrice(weeklyPriceDetail.price)
                }
                
                if (dayPriceDetail) {
                  dayPrice = parsePrice(dayPriceDetail.price)
                }
              }
              
              // Extract discount prices if available (priority: weekly -> day)
              let discountWeeklyPrice: number | undefined = undefined
              let discountDayPrice: number | undefined = undefined
              
              if (apiCar.discount_price_details && apiCar.discount_price_details.length > 0) {
                // Check weekly discount first
                const weeklyDiscount = apiCar.discount_price_details.find(pd => 
                  pd.price_type && pd.price_type.toLowerCase() === 'week'
                )
                
                // Then day discount
                const dayDiscount = apiCar.discount_price_details.find(pd => 
                  pd.price_type && pd.price_type.toLowerCase() === 'day'
                )
                
                if (weeklyDiscount) {
                  discountWeeklyPrice = parsePrice(weeklyDiscount.price)
                }
                
                if (dayDiscount) {
                  discountDayPrice = parsePrice(dayDiscount.price)
                }
              }
              
              // Determine which price to display
              // Priority: discount weekly > discount day > regular weekly > regular day
              let displayPrice: number | undefined = undefined
              let originalPrice: number | undefined = undefined
              let discountPercentage: number | undefined = undefined
              let isDiscount: boolean = false
              
              if (discountWeeklyPrice && discountWeeklyPrice > 0) {
                // Show discount weekly price
                displayPrice = discountWeeklyPrice
                originalPrice = weeklyPrice
                isDiscount = true
                if (weeklyPrice && weeklyPrice > 0) {
                  discountPercentage = Math.round(((weeklyPrice - discountWeeklyPrice) / weeklyPrice) * 100)
                }
              } else if (discountDayPrice && discountDayPrice > 0) {
                // Show discount day price
                displayPrice = discountDayPrice
                originalPrice = dayPrice
                isDiscount = true
                if (dayPrice && dayPrice > 0) {
                  discountPercentage = Math.round(((dayPrice - discountDayPrice) / dayPrice) * 100)
                }
              } else if (weeklyPrice && weeklyPrice > 0) {
                // No discount, show weekly price
                displayPrice = weeklyPrice
              } else if (dayPrice && dayPrice > 0) {
                // No discount, show day price
                displayPrice = dayPrice
              }
              
              return {
                id: apiCar.id,
                name: apiCar.car_name,
                model: apiCar.car_model,
                image: backendImageUrl,
                price: displayPrice, // Show discount price if available, otherwise weekly/day price
                originalPrice: originalPrice, // Show original price when discount exists
                rating: Math.round(rating * 10) / 10,
                features: defaultFeatures,
                transmission: getTransmission(),
                seats: getSeats(),
                fuel: getFuel(),
                available: apiCar.is_active,
                discount: discountPercentage,
                isDiscount: isDiscount, // Flag to show discount label
                category: apiCar.category?.name,
              }
            })
          
          setCars(mappedCars)
        } else {
          throw new Error('Invalid API response format')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cars')
        console.error('Error fetching cars:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

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
    if (sortBy === 'cheapest') {
      const priceA = a.price ?? Infinity // Treat undefined as highest price
      const priceB = b.price ?? Infinity
      return priceA - priceB
    }
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  // Loading state
  if (loading) {
    return (
      <div className="cars-list-container">
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
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
          Loading cars...
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="cars-list-container">
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
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#ff4444' }}>
          Error: {error}
          <br />
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

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
              <h3>Category</h3>
              {/* Category filters can be added here if needed */}
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
              <span className="sort-info">
                {sortedCars[0] ? `${sortedCars[0].price ? `₹ ${sortedCars[0].price.toLocaleString()}` : 'Price N/A'} | ${sortedCars[0].seats} Seater` : 'No cars'}
              </span>
            </button>
            <button
              className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
              onClick={() => setSortBy('rating')}
            >
              HIGHEST RATED
              <span className="sort-info">
                {sortedCars[0] ? `${sortedCars[0].price ? `₹ ${sortedCars[0].price.toLocaleString()}` : 'Price N/A'} | ${sortedCars[0].seats} Seater` : 'No cars'}
              </span>
            </button>
            <button className="sort-btn">
              YOU MAY PREFER
              <span className="sort-info">
                {sortedCars[0] ? `${sortedCars[0].price ? `₹ ${sortedCars[0].price.toLocaleString()}` : 'Price N/A'} | ${sortedCars[0].seats} Seater` : 'No cars'}
              </span>
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
            {sortedCars.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
                No cars available
              </div>
            ) : (
              sortedCars.map((car) => (
              <div key={car.id} className="car-listing-card">
                {car.discount && (
                  <div className="discount-badge">{car.discount}% OFF</div>
                )}
                <div className="car-listing-content">
                  <div className="car-image-section">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="car-listing-image"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        target.src = 'https://via.placeholder.com/300x200?text=Car+Image'
                      }}
                    />
                  </div>
                  <div className="car-details-section">
                    <div className="car-header">
                      <div className="car-name-section">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                          <h3 className="car-listing-name">{car.name}</h3>
                          {car.category && (
                            <span style={{
                              background: '#e3f2fd',
                              color: '#007bff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {car.category}
                            </span>
                          )}
                        </div>
                        <span className="car-model">{car.model}</span>
                        <div className="car-rating">
                          <span className="stars">★★★★★</span>
                          <span className="rating-value">{car.rating}</span>
                        </div>
                      </div>
                      <div className="car-price-section">
                        {car.originalPrice && car.originalPrice > 0 && (
                          <span className="original-price">₹ {car.originalPrice.toLocaleString()}</span>
                        )}
                        {car.price ? (
                          <>
                            <span className="current-price">₹ {car.price.toLocaleString()}</span>
                            <span className="price-label">
                              {car.isDiscount ? 'discount' : 'per day'}
                            </span>
                          </>
                        ) : (
                          <span className="current-price">Price N/A</span>
                        )}
                      </div>
                    </div>

                    <div className="car-specs">
                      <div className="spec-item">
                        <span className="spec-label">Category:</span>
                        <span className="spec-value">{car.category || 'N/A'}</span>
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
            ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CarsList

