import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
  display_price?: {
    day?: number | null
    week?: number | null
    km?: number | null
    trip?: number | null
    hour?: number | null
    month?: number | null
    discount_price_amount?: {
      price: number
      type: string
    } | null
    regular_price_amount?: {
      price: number
      min_hours?: number
      type: string
    } | null
  }
  additional_details?: {
    no_of_seats?: number
    amenity_names?: string[]
  }
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
  priceType?: string // Type of price: 'day', 'week', 'km', 'trip', 'hour', 'month'
  rating: number
  features: string[]
  transmission: string
  seats: number
  fuel: string
  available: boolean
  discount?: number
  isDiscount?: boolean // Flag to indicate if showing discount price
  category?: string
  amenities?: string[] // Amenities from API
  priceDetails?: ApiPriceDetail[] // Store all price details
  discountPriceDetails?: ApiPriceDetail[] // Store all discount price details
}

interface Amenity {
  id: number
  name: string
}

interface LocationState {
  journeyDetails?: {
    pickup_location?: string
    drop_location?: string
    journey_from_date?: string
    journey_end_date?: string
  }
}

function CarsList() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  const journeyDetails = state?.journeyDetails
  
  const [sortBy, setSortBy] = useState('cheapest')
  const [priceRange, setPriceRange] = useState([5000, 30000])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState<number[]>([])
  const [selectedDate, setSelectedDate] = useState('Fri, Nov 14, 2025')
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [selectedCarForPrices, setSelectedCarForPrices] = useState<Car | null>(null)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)

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

  // Fetch amenities from API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const apiUrl = import.meta.env.DEV 
          ? '/api/amenities' 
          : 'http://127.0.0.1:8000/api/amenities'
        
        const response = await fetch(apiUrl)
        if (response.ok) {
          const data = await response.json()
          // Handle different response formats
          if (data.success && data.data) {
            setAmenities(data.data)
          } else if (Array.isArray(data)) {
            setAmenities(data)
          } else if (data.amenities) {
            setAmenities(data.amenities)
          }
        }
      } catch (err) {
        console.error('Error fetching amenities:', err)
      }
    }

    fetchAmenities()
  }, [])

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build API URL with query parameters if journey details are available
        let apiUrl = import.meta.env.DEV 
          ? '/api/cars/list' 
          : 'http://127.0.0.1:8000/api/cars/list'
        
        // Add query parameters if journey details exist
        const queryParams = new URLSearchParams()
        if (journeyDetails?.journey_from_date) {
          // Convert date to datetime format (YYYY-MM-DD HH:MM:SS)
          // Add default time 10:00:00 for start date
          const formattedStartDate = `${journeyDetails.journey_from_date} 10:00:00`
          queryParams.append('journey_start_date', formattedStartDate)
        }
        if (journeyDetails?.journey_end_date) {
          // Convert date to datetime format (YYYY-MM-DD HH:MM:SS)
          // Add default time 18:00:00 for end date
          const formattedEndDate = `${journeyDetails.journey_end_date} 18:00:00`
          queryParams.append('journey_end_date', formattedEndDate)
        }
        
        // Append query string if we have parameters
        if (queryParams.toString()) {
          apiUrl += '?' + queryParams.toString()
        }
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const apiResponse: ApiResponse = await response.json()
        
        // Debug: Log raw API response
        console.log('Raw API response:', apiResponse)
        if (apiResponse.data && apiResponse.data.length > 0) {
          console.log('First car from API:', apiResponse.data[0])
          console.log('First car price_details:', apiResponse.data[0].price_details)
          console.log('First car discount_price_details:', apiResponse.data[0].discount_price_details)
        }
        
        if (apiResponse.success && apiResponse.data) {
          // Map API data to component's Car interface
          const mappedCars: Car[] = apiResponse.data
            .map((apiCar): Car => {
              // Generate default values for fields not in API response
              const rating = 4.0 + (Math.random() * 1.0) // Random rating between 4.0-5.0
              
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

              // Get amenities from additional_details.amenity_names
              const carAmenities = apiCar.additional_details?.amenity_names || []

              // Extract price from display_price object
              // Priority: discount_price_amount > regular_price_amount
              let displayPrice: number | undefined = undefined
              let originalPrice: number | undefined = undefined
              let priceType: string | undefined = undefined
              let isDiscount: boolean = false
              let discountPercentage: number | undefined = undefined

              if (apiCar.display_price) {
                const discountPrice = apiCar.display_price.discount_price_amount
                const regularPrice = apiCar.display_price.regular_price_amount

                // Check if discount price exists and is valid (> 0)
                if (discountPrice && discountPrice.price && discountPrice.price > 0) {
                  displayPrice = discountPrice.price
                  priceType = discountPrice.type
                  isDiscount = true
                  
                  // Calculate discount percentage if regular price exists
                  if (regularPrice && regularPrice.price && regularPrice.price > 0) {
                    originalPrice = regularPrice.price
                    discountPercentage = Math.round(((regularPrice.price - discountPrice.price) / regularPrice.price) * 100)
                  }
                } 
                // If no discount or discount is 0, use regular price
                else if (regularPrice && regularPrice.price && regularPrice.price > 0) {
                  displayPrice = regularPrice.price
                  priceType = regularPrice.type
                  isDiscount = false
                }
              }
              
              return {
                id: apiCar.id,
                name: apiCar.car_name,
                model: apiCar.car_model,
                image: backendImageUrl,
                price: displayPrice, // Show discount price if available, otherwise regular price
                originalPrice: originalPrice, // Show original price when discount exists
                priceType: priceType, // Type of price: 'day', 'week', etc.
                rating: Math.round(rating * 10) / 10,
                features: carAmenities, // Use amenities from API instead of default features
                transmission: getTransmission(),
                seats: apiCar.additional_details?.no_of_seats || getSeats(), // Use API value if available
                fuel: getFuel(),
                available: apiCar.is_active,
                discount: discountPercentage,
                isDiscount: isDiscount, // Flag to show discount label
                category: apiCar.category?.name,
                amenities: carAmenities, // Add amenities from API
                // Store price_details array - ensure it's properly structured
                priceDetails: apiCar.price_details && Array.isArray(apiCar.price_details) && apiCar.price_details.length > 0
                  ? apiCar.price_details.map(p => ({
                      id: p.id,
                      car_id: p.car_id,
                      price_type: String(p.price_type || '').trim(),
                      min_hours: p.min_hours,
                      price: String(p.price || '0.00'),
                      created_at: p.created_at,
                      updated_at: p.updated_at
                    }))
                  : [],
                // Store discount_price_details array - ensure it's properly structured
                discountPriceDetails: apiCar.discount_price_details && Array.isArray(apiCar.discount_price_details) && apiCar.discount_price_details.length > 0
                  ? apiCar.discount_price_details.map(p => ({
                      id: p.id,
                      car_id: p.car_id,
                      price_type: String(p.price_type || '').trim(),
                      price: String(p.price || '0.00'),
                      created_at: p.created_at,
                      updated_at: p.updated_at
                    }))
                  : []
              }
            })
          
          // Debug: Log a sample car to verify data is stored
          if (mappedCars.length > 0) {
            console.log('Sample mapped car:', mappedCars[0])
            console.log('Sample car priceDetails:', mappedCars[0].priceDetails)
            console.log('Sample car discountPriceDetails:', mappedCars[0].discountPriceDetails)
          }
          
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
  }, [journeyDetails?.journey_from_date, journeyDetails?.journey_end_date])

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

  const toggleSeatingCapacity = (seats: number) => {
    setSelectedSeatingCapacity(prev =>
      prev.includes(seats)
        ? prev.filter(s => s !== seats)
        : [...prev, seats]
    )
  }

  const clearAllFilters = () => {
    setSelectedFilters([])
    setSelectedSeatingCapacity([])
  }

  // Filter cars based on selected amenities and seating capacity
  const filteredCars = cars.filter(car => {
    // Filter by amenities
    if (selectedFilters.length > 0) {
      if (!car.amenities || car.amenities.length === 0) return false
      const hasAllAmenities = selectedFilters.every(filter => 
        car.amenities?.includes(filter)
      )
      if (!hasAllAmenities) return false
    }

    // Filter by seating capacity
    if (selectedSeatingCapacity.length > 0) {
      if (!selectedSeatingCapacity.includes(car.seats)) return false
    }

    return true
  })

  const sortedCars = [...filteredCars].sort((a, b) => {
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
              {selectedFilters.length > 0 || selectedSeatingCapacity.length > 0 ? (
                <div className="filter-tags">
                  {selectedFilters.map((filter, index) => (
                    <span key={index} className="filter-tag">
                      {filter}
                      <button onClick={() => toggleFilter(filter)}>×</button>
                    </span>
                  ))}
                  {selectedSeatingCapacity.map((seats, index) => (
                    <span key={`seats-${index}`} className="filter-tag">
                      {seats} Seater
                      <button onClick={() => toggleSeatingCapacity(seats)}>×</button>
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
              {amenities.length === 0 ? (
                <p style={{ padding: '10px', color: '#666', fontSize: '14px' }}>Loading amenities...</p>
              ) : (
                amenities.map((amenity) => (
                  <label key={amenity.id} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(amenity.name)}
                      onChange={() => toggleFilter(amenity.name)}
                    />
                    <span>{amenity.name}</span>
                  </label>
                ))
              )}
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
                <input
                  type="checkbox"
                  checked={selectedSeatingCapacity.includes(5)}
                  onChange={() => toggleSeatingCapacity(5)}
                />
                <span>5 Seater</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSeatingCapacity.includes(7)}
                  onChange={() => toggleSeatingCapacity(7)}
                />
                <span>7 Seater</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSeatingCapacity.includes(8)}
                  onChange={() => toggleSeatingCapacity(8)}
                />
                <span>8 Seater</span>
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
                {/* {car.discount && (
                  <div className="discount-badge">{car.discount}% OFF</div>
                )} */}
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
                        <div>
                          {car.originalPrice && car.originalPrice > 0 && (
                            <span className="original-price">₹ {car.originalPrice.toLocaleString()}</span>
                          )}
                          {car.price ? (
                            <>
                              <span className="current-price">₹ {car.price.toLocaleString()}</span>
                              <span className="price-label">
                                {car.isDiscount 
                                  ? `discount (${car.priceType || 'per day'})` 
                                  : `per ${car.priceType || 'day'}`}
                              </span>
                            </>
                          ) : (
                            <span className="current-price">Price N/A</span>
                          )}
                        </div>
                        <button 
                          className="book-now-btn"
                          onClick={() => {
                            navigate('/booking', {
                              state: {
                                car: {
                                  id: car.id,
                                  name: car.name,
                                  model: car.model,
                                  image: car.image,
                                  price: car.price,
                                  priceType: car.priceType
                                }
                              }
                            })
                          }}
                        >
                          BOOK NOW
                        </button>
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

                    {car.amenities && car.amenities.length > 0 && (
                      <div className="car-amenities" style={{ marginTop: '10px' }}>
                        <span className="spec-label" style={{ fontWeight: '600', marginRight: '8px' }}>Amenities:</span>
                        {car.amenities.map((amenity, index) => (
                          <span 
                            key={index} 
                            className="amenity-tag" 
                            style={{
                              display: 'inline-block',
                              background: '#f0f7ff',
                              color: '#0066cc',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              marginRight: '6px',
                              marginTop: '4px',
                              border: '1px solid #cce5ff'
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="car-actions">
                      <button 
                        className="view-prices-btn"
                        onClick={() => {
                          console.log('=== CLICKING VIEW PRICES ===')
                          console.log('Original car object:', car)
                          console.log('car.priceDetails:', car.priceDetails)
                          console.log('car.priceDetails type:', typeof car.priceDetails)
                          console.log('car.priceDetails isArray:', Array.isArray(car.priceDetails))
                          console.log('car.discountPriceDetails:', car.discountPriceDetails)
                          console.log('car.discountPriceDetails type:', typeof car.discountPriceDetails)
                          console.log('car.discountPriceDetails isArray:', Array.isArray(car.discountPriceDetails))
                          
                          // Ensure we have the price details arrays
                          const carWithPrices: Car = {
                            ...car,
                            priceDetails: Array.isArray(car.priceDetails) && car.priceDetails.length > 0 
                              ? [...car.priceDetails] 
                              : [],
                            discountPriceDetails: Array.isArray(car.discountPriceDetails) && car.discountPriceDetails.length > 0
                              ? [...car.discountPriceDetails]
                              : []
                          }
                          
                          console.log('Car with prices to set:', carWithPrices)
                          console.log('carWithPrices.priceDetails:', carWithPrices.priceDetails)
                          console.log('carWithPrices.discountPriceDetails:', carWithPrices.discountPriceDetails)
                          
                          setSelectedCarForPrices(carWithPrices)
                          setIsPriceModalOpen(true)
                        }}
                      >
                        VIEW PRICES
                      </button>
                      {/* <button className="lock-price-btn">Lock this price starting from ₹ 306 →</button>
                      <button className="compare-btn">Add to compare +</button> */}
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

      {/* Price Details Modal */}
      {isPriceModalOpen && selectedCarForPrices && (
        <div className="price-modal-overlay" onClick={() => setIsPriceModalOpen(false)}>
          <div className="price-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="price-modal-header">
              <h2>Price Details - {selectedCarForPrices.name} {selectedCarForPrices.model}</h2>
              <button className="price-modal-close" onClick={() => setIsPriceModalOpen(false)}>×</button>
            </div>
            <div className="price-modal-body">
              <div className="price-table-container">
                {(() => {
                  // Debug logging
                  console.log('=== MODAL RENDER ===')
                  console.log('selectedCarForPrices:', selectedCarForPrices)
                  console.log('priceDetails:', selectedCarForPrices.priceDetails)
                  console.log('discountPriceDetails:', selectedCarForPrices.discountPriceDetails)
                  console.log('priceDetails type:', typeof selectedCarForPrices.priceDetails)
                  console.log('priceDetails isArray:', Array.isArray(selectedCarForPrices.priceDetails))
                  console.log('priceDetails length:', Array.isArray(selectedCarForPrices.priceDetails) ? selectedCarForPrices.priceDetails.length : 'N/A')
                  
                  // Get all unique price types from both arrays
                  const allPriceTypes = new Set<string>()
                  
                  // Collect price types from price_details
                  const priceDetails = selectedCarForPrices.priceDetails
                  if (priceDetails && Array.isArray(priceDetails)) {
                    console.log('Processing priceDetails, count:', priceDetails.length)
                    priceDetails.forEach((p, idx) => {
                      console.log(`  Price detail ${idx}:`, p)
                      if (p && p.price_type) {
                        const type = String(p.price_type).toLowerCase().trim()
                        console.log(`  Adding type: ${type}`)
                        allPriceTypes.add(type)
                      }
                    })
                  } else {
                    console.log('priceDetails is not an array or is null')
                  }
                  
                  // Collect price types from discount_price_details
                  const discountPriceDetails = selectedCarForPrices.discountPriceDetails
                  if (discountPriceDetails && Array.isArray(discountPriceDetails)) {
                    console.log('Processing discountPriceDetails, count:', discountPriceDetails.length)
                    discountPriceDetails.forEach((p, idx) => {
                      console.log(`  Discount price detail ${idx}:`, p)
                      if (p && p.price_type) {
                        const type = String(p.price_type).toLowerCase().trim()
                        console.log(`  Adding type: ${type}`)
                        allPriceTypes.add(type)
                      }
                    })
                  } else {
                    console.log('discountPriceDetails is not an array or is null')
                  }
                  
                  console.log('All collected price types:', Array.from(allPriceTypes))
                  
                  // Sort price types for consistent display
                  const priceTypesToShow = Array.from(allPriceTypes).sort()
                  
                  // If no price types found, show message with debug info
                  if (priceTypesToShow.length === 0) {
                    return (
                      <div style={{padding: '20px'}}>
                        <p className="no-prices-message">No price details available for this car.</p>
                        <div style={{marginTop: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '4px', fontSize: '12px'}}>
                          <strong>Debug Info:</strong>
                          <pre style={{marginTop: '10px', overflow: 'auto'}}>
                            {JSON.stringify({
                              hasPriceDetails: !!selectedCarForPrices.priceDetails,
                              priceDetailsIsArray: Array.isArray(selectedCarForPrices.priceDetails),
                              priceDetailsLength: Array.isArray(selectedCarForPrices.priceDetails) ? selectedCarForPrices.priceDetails.length : null,
                              hasDiscountPriceDetails: !!selectedCarForPrices.discountPriceDetails,
                              discountPriceDetailsIsArray: Array.isArray(selectedCarForPrices.discountPriceDetails),
                              discountPriceDetailsLength: Array.isArray(selectedCarForPrices.discountPriceDetails) ? selectedCarForPrices.discountPriceDetails.length : null,
                              priceDetails: selectedCarForPrices.priceDetails,
                              discountPriceDetails: selectedCarForPrices.discountPriceDetails
                            }, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )
                  }
                  
                  return (
                    <table className="price-table">
                      <thead>
                        <tr>
                          <th>Price Type</th>
                          <th>Regular Price</th>
                          <th>Discount Price</th>
                          <th>Min Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceTypesToShow.map((type) => {
                          // Find matching price in price_details
                          const regularPrice = selectedCarForPrices.priceDetails?.find(
                            p => p && p.price_type && p.price_type.toLowerCase().trim() === type
                          )
                          
                          // Find matching price in discount_price_details
                          const discountPrice = selectedCarForPrices.discountPriceDetails?.find(
                            p => p && p.price_type && p.price_type.toLowerCase().trim() === type
                          )
                          
                          // Parse regular price value
                          let regularPriceValue: number | null = null
                          if (regularPrice && regularPrice.price !== undefined && regularPrice.price !== null) {
                            const parsed = typeof regularPrice.price === 'string' 
                              ? parseFloat(regularPrice.price) 
                              : regularPrice.price
                            regularPriceValue = isNaN(parsed) ? null : parsed
                          }
                          
                          // Parse discount price value
                          let discountPriceValue: number | null = null
                          if (discountPrice && discountPrice.price !== undefined && discountPrice.price !== null) {
                            const parsed = typeof discountPrice.price === 'string' 
                              ? parseFloat(discountPrice.price) 
                              : discountPrice.price
                            discountPriceValue = isNaN(parsed) ? null : parsed
                          }
                          
                          // Determine if we have entries
                          const hasRegularEntry = regularPrice !== undefined
                          const hasDiscountEntry = discountPrice !== undefined
                          
                          return (
                            <tr key={type}>
                              <td className="price-type-cell">
                                <span className="price-type-badge">{type.toUpperCase()}</span>
                              </td>
                              <td className="regular-price-cell">
                                {hasRegularEntry && regularPriceValue !== null && regularPriceValue > 0 ? (
                                  <span className="regular-price">₹ {regularPriceValue.toLocaleString()}</span>
                                ) : hasRegularEntry ? (
                                  <span className="no-price">₹ 0.00</span>
                                ) : (
                                  <span className="no-price">-</span>
                                )}
                              </td>
                              <td className="discount-price-cell">
                                {hasDiscountEntry && discountPriceValue !== null && discountPriceValue > 0 ? (
                                  <div>
                                    <span className="discount-price">₹ {discountPriceValue.toLocaleString()}</span>
                                    {regularPriceValue && regularPriceValue > 0 && regularPriceValue > discountPriceValue && (
                                      <span className="discount-badge-small">
                                        {Math.round(((regularPriceValue - discountPriceValue) / regularPriceValue) * 100)}% OFF
                                      </span>
                                    )}
                                  </div>
                                ) : hasDiscountEntry ? (
                                  <span className="no-price">₹ 0.00</span>
                                ) : (
                                  <span className="no-price">-</span>
                                )}
                              </td>
                              <td className="min-hours-cell">
                                {regularPrice?.min_hours !== undefined && regularPrice?.min_hours !== null 
                                  ? `${regularPrice.min_hours} hrs` 
                                  : '-'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )
                })()}
              </div>
            </div>
            <div className="price-modal-footer">
              <button 
                className="book-now-modal-btn" 
                onClick={() => {
                  setIsPriceModalOpen(false)
                  navigate('/booking', {
                    state: {
                      car: {
                        id: selectedCarForPrices.id,
                        name: selectedCarForPrices.name,
                        model: selectedCarForPrices.model,
                        image: selectedCarForPrices.image,
                        price: selectedCarForPrices.price,
                        priceType: selectedCarForPrices.priceType
                      },
                      journeyDetails: journeyDetails
                    }
                  })
                }}
              >
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarsList

