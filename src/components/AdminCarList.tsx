import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminCarList.css'

interface ApiCategory {
  id: number
  name: string
}

interface ApiCar {
  id: number
  car_name: string
  car_model: string
  car_image_url: string
  car_category: number
  is_active: boolean
  category: ApiCategory
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
        ? '/api/cars/list' 
        : 'http://127.0.0.1:8000/api/cars/list'
      
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

  const toggleActiveStatus = async (carId: number, currentStatus: boolean) => {
    try {
      const apiUrl = import.meta.env.DEV 
        ? `/api/admin/car/${carId}/toggle-active` 
        : `http://127.0.0.1:8000/api/admin/car/${carId}/toggle-active`
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update car status in list
        setCars(prevCars =>
          prevCars.map(car =>
            car.id === carId ? { ...car, is_active: !currentStatus } : car
          )
        )
      } else {
        throw new Error(data.message || 'Failed to update car status')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update car status')
      console.error('Error updating car status:', err)
    }
  }

  if (loading) {
    return (
      <div className="admin-car-list-container">
        <header className="admin-nav">
          <div className="nav-content">
            <Link to="/" className="logo-link">
              <div className="logo-circle">Be</div>
              <span className="logo-text">CarRental</span>
            </Link>
            <nav className="main-nav">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/cars" className="nav-link">Cars</Link>
              <Link to="/admin/car/list" className="nav-link active">Admin Cars</Link>
              <Link to="/admin/car" className="nav-link">Add Car</Link>
            </nav>
          </div>
        </header>
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
          Loading cars...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-car-list-container">
      {/* Navigation Header */}
      <header className="admin-nav">
        <div className="nav-content">
          <Link to="/" className="logo-link">
            <div className="logo-circle">Be</div>
            <span className="logo-text">CarRental</span>
          </Link>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/cars" className="nav-link">Cars</Link>
            <Link to="/admin/car/list" className="nav-link active">Admin Cars</Link>
            <Link to="/admin/car" className="nav-link">Add Car</Link>
          </nav>
        </div>
      </header>

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
                  <h3 className="car-card-name">{car.car_name}</h3>
                  <p className="car-card-model">{car.car_model}</p>
                  <p className="car-card-category">Category: {car.category?.name || 'N/A'}</p>
                  <div className="car-card-actions">
                    <button
                      onClick={() => handleEdit(car.id)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActiveStatus(car.id, car.is_active)}
                      className={`btn-toggle ${car.is_active ? 'btn-deactivate' : 'btn-activate'}`}
                    >
                      {car.is_active ? 'Deactivate' : 'Activate'}
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

