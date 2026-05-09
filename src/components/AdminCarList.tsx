import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminCarList.css'
import AdminTopNav from './AdminTopNav'

interface ApiCategory {
  id: number
  name: string
}

interface ApiPriceDetail {
  range_type?: string | null
  price_type: string
  price: string | number
  fuel_charge?: string | number | null
  driver_betta?: string | number | null
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
}

interface ApiResponse {
  success: boolean
  data: ApiCar[]
}

function AdminCarList() {
  const navigate = useNavigate()
  const [cars, setCars] = useState<ApiCar[]>([])
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

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      setError(null)
      const apiUrl = import.meta.env.DEV 
        ? '/api/cars/list?include_inactive=1' 
        : 'http://127.0.0.1:8000/api/cars/list?include_inactive=1'
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const apiResponse: ApiResponse = await response.json()
      
      if (apiResponse.success && apiResponse.data) {
        setCars(apiResponse.data)
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

  const handleEdit = (carId: number) => {
    navigate(`/admin/car/edit/${carId}`)
  }

  const handleDelete = async (carId: number, carName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${carName}"?`)) {
      return
    }

    try {
      const apiUrl = import.meta.env.DEV 
        ? `/api/admin/car/delete/${carId}` 
        : `http://127.0.0.1:8000/api/admin/car/delete/${carId}`
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Remove car from list
        setCars(prevCars => prevCars.filter(car => car.id !== carId))
        alert('Car deleted successfully!')
      } else {
        throw new Error(data.message || 'Failed to delete car')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete car')
      console.error('Error deleting car:', err)
    }
  }

  const parseNumber = (v: unknown): number | null => {
    if (v === null || v === undefined) return null
    const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN
    return Number.isFinite(n) ? n : null
  }

  const pickTariff = (car: ApiCar) => {
    const rows = Array.isArray(car.price_details) ? car.price_details : []

    const below =
      rows.find(r => (r.range_type || '').toLowerCase() === 'below 250km' && r.price_type === 'day') ||
      rows.find(r => (r.range_type || '').toLowerCase() === 'below_250km' && r.price_type === 'day') ||
      rows.find(r => r.price_type === 'day') ||
      null

    const above =
      rows.find(r => (r.range_type || '').toLowerCase() === 'above 250km' && r.price_type === 'km') ||
      rows.find(r => (r.range_type || '').toLowerCase() === 'above_250km' && r.price_type === 'km') ||
      rows.find(r => r.price_type === 'km') ||
      null

    return {
      dayPrice: below ? parseNumber(below.price) : null,
      kmRate: above ? parseNumber(above.price) : null,
      fuelCharge: below ? parseNumber(below.fuel_charge) : null,
      driverBetta: below ? parseNumber(below.driver_betta) : null,
    }
  }

  if (loading) {
    return (
      <div className="admin-car-list-container">
        <AdminTopNav active="cars" showAddCar />
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
          Loading cars...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-car-list-container">
      {/* Navigation Header */}
      <AdminTopNav active="cars" showAddCar />

      <div className="admin-car-list-content">
        <div className="admin-header">
          <div className="header-row">
            <div>
              <h1>Car Management</h1>
              <p className="admin-subtitle">Manage all cars in your inventory</p>
            </div>
            <Link to="/admin/car" className="btn-add-car">
              + Add New Car
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={fetchCars} className="btn-retry">Retry</button>
          </div>
        )}

        {cars.length === 0 && !loading && !error && (
          <div className="empty-state">
            <p>No cars found. <Link to="/admin/car">Add your first car</Link></p>
          </div>
        )}

        <div className="cars-grid">
          {cars.map((car) => {
            const imageUrl = getBackendImageUrl(car.car_image_url)
            const tariff = pickTariff(car)
            return (
              <div key={car.id} className="admin-car-card">
                <div className="car-card-image">
                  <img 
                    src={imageUrl} 
                    alt={car.car_name}
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/300x200?text=Car+Image'
                    }}
                  />
                  <div className={`status-badge ${car.is_active ? 'active' : 'inactive'}`}>
                    {car.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="car-card-content">
                  <div className="car-card-top">
                    <div className="car-card-mini-title">{car.category?.name || 'Car'}</div>
                    <div className="car-card-name">{car.car_name}</div>
                  </div>

                  <div className="car-card-price">
                    <span className="price-amount">
                      {tariff.dayPrice !== null ? `₹${tariff.dayPrice.toLocaleString()}` : '—'}
                    </span>
                    <span className="price-suffix">/ day</span>
                  </div>

                  <div className="car-card-meta">
                    <div className="meta-row">
                      <span className="meta-label">Fuel charge</span>
                      <span className="meta-value">
                        {tariff.fuelCharge !== null ? `₹${tariff.fuelCharge}/km` : '—'}
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Above 250 km</span>
                      <span className="meta-value">
                        {tariff.kmRate !== null ? `₹${tariff.kmRate}/km` : '—'}
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Driver betta</span>
                      <span className="meta-value">
                        {tariff.driverBetta !== null ? `₹${tariff.driverBetta}` : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="car-card-sub">
                    {car.car_model ? car.car_model : ' '}
                  </div>

                  <div className="car-card-actions">
                    <button
                      onClick={() => handleEdit(car.id)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car.id, car.car_name)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminCarList

