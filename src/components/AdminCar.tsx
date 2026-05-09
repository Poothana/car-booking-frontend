import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminCar.css'

interface Category {
  id: number
  name: string
}

interface Amenity {
  id: number
  name: string
}

interface PriceDetail {
  price_type: string
  min_hours: number
  price: number
}

/** Tariff row sent as `price_details[]` — must match DB enum (spaced labels). */
type TariffRangeType = 'below 250km' | 'above 250km'
type TariffPriceType = 'day' | 'km'

interface TariffPriceDetailRow {
  range_type: TariffRangeType
  price_type: TariffPriceType
  price: number
  fuel_charge: number
  driver_betta: number
}

interface DiscountPriceDetail {
  price_type: string
  price: number
}

interface CarFormData {
  car_name: string
  car_model: string
  car_category: number
  is_active: boolean
  no_of_seats: number
  amenities: number[] // Array of amenity IDs
  price_details: PriceDetail[]
  discount_price_details: DiscountPriceDetail[]
}

/** Laravel MessageBag shape: { "field.key": ["msg1", ...] } */
function formatLaravelValidationErrors(errors: unknown): string | null {
  if (!errors || typeof errors !== 'object') return null
  const lines: string[] = []
  for (const [key, val] of Object.entries(errors as Record<string, unknown>)) {
    const msgs = Array.isArray(val) ? val.map(String) : [String(val)]
    const label = key.replace(/\./g, ' · ')
    for (const m of msgs) {
      if (m) lines.push(`${label}: ${m}`)
    }
  }
  return lines.length > 0 ? lines.join('\n') : null
}

/** Reject renamed non-images before upload (Laravel `image` rule does the same server-side). */
function assertFileDecodesAsImage(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve()
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(
        new Error(
          'This file is not a valid image. Use a real JPEG, PNG, GIF, or WebP (not a renamed PDF or document).'
        )
      )
    }
    img.src = url
  })
}

function AdminCar() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string>('')

  const [formData, setFormData] = useState<CarFormData>({
    car_name: '',
    car_model: '',
    car_category: 0,
    is_active: true,
    no_of_seats: 5,
    amenities: [], // Array of selected amenity IDs
    price_details: [
      { price_type: 'day', min_hours: 24, price: 0 },
      { price_type: 'week', min_hours: 168, price: 0 }
    ],
    discount_price_details: [
      { price_type: 'day', price: 0 },
      { price_type: 'week', price: 0 }
    ]
  })

  /** Two rows: below 250km (day) + above 250km (km) */
  const [tariffPrices, setTariffPrices] = useState<TariffPriceDetailRow[]>([
    { range_type: 'below 250km', price_type: 'day', price: 0, fuel_charge: 0, driver_betta: 0 },
    { range_type: 'above 250km', price_type: 'km', price: 0, fuel_charge: 0, driver_betta: 0 }
  ])

  const updateTariffRow = <K extends keyof TariffPriceDetailRow>(
    index: number,
    key: K,
    value: TariffPriceDetailRow[K]
  ) => {
    setTariffPrices(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: value }
      return next
    })
  }

  const updateTariffNumber = (index: number, key: 'price' | 'fuel_charge' | 'driver_betta', raw: string) => {
    const n = parseFloat(raw) || 0
    updateTariffRow(index, key, n)
  }

  // Fetch categories and amenities on component mount
  useEffect(() => {
    fetchCategories()
    fetchAmenities()
  }, [])

  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.DEV 
        ? '/api/admin/car/category' 
        : 'http://127.0.0.1:8000/api/admin/car/category'
      
      const response = await fetch(apiUrl)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setCategories(data.data)
        } else if (Array.isArray(data)) {
          setCategories(data)
        } else if (data.categories) {
          setCategories(data.categories)
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      // Do not inject fake IDs — backend `exists:car_categories,id` would fail on submit.
      setCategories([])
    }
  }

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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (name === 'no_of_seats') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 5
      }))
    } else if (name === 'car_category') {
      setFormData(prev => ({
        ...prev,
        car_category: parseInt(value, 10) || 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Removed handlePriceDetailChange and handleDiscountPriceChange as price details sections are hidden

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    try {
      await assertFileDecodesAsImage(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid image file')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setSelectedImage(file)
    setImageFileName(file.name)
    setError(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setImageFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate required fields
      if (!formData.car_name || !formData.car_model || !formData.car_category) {
        throw new Error('Please fill in all required fields')
      }

      if (!selectedImage) {
        throw new Error('Please select a car image')
      }

      await assertFileDecodesAsImage(selectedImage)

      const labels: Record<TariffRangeType, string> = {
        'below 250km': 'Below 250 km',
        'above 250km': 'Above 250 km'
      }
      for (const row of tariffPrices) {
        const prefix = labels[row.range_type]
        if (row.price <= 0) {
          throw new Error(`${prefix}: enter a valid ${row.price_type === 'day' ? 'rent per day' : 'rate per km'} (₹)`)
        }
        if (row.fuel_charge <= 0) {
          throw new Error(`${prefix}: enter a valid fuel charge (₹)`)
        }
        if (row.driver_betta <= 0) {
          throw new Error(`${prefix}: enter a valid driver betta (₹)`)
        }
      }

      // Create FormData to match the API structure
      const formDataToSend = new FormData()
      
      // Basic fields
      formDataToSend.append('car_name', formData.car_name.trim())
      formDataToSend.append('car_model', formData.car_model.trim())
      formDataToSend.append('car_category', formData.car_category.toString())
      formDataToSend.append('is_active', formData.is_active ? '1' : '0')
      
      // Additional details
      formDataToSend.append('additional_details[no_of_seats]', formData.no_of_seats.toString())
      
      // Add amenities as array
      if (formData.amenities && formData.amenities.length > 0) {
        formData.amenities.forEach((amenityId, index) => {
          formDataToSend.append(`additional_details[amenities][${index}]`, amenityId.toString())
        })
      }
      
      tariffPrices.forEach((row, i) => {
        const minHours = row.range_type === 'below 250km' ? 24 : 0
        formDataToSend.append(`price_details[${i}][range_type]`, row.range_type)
        formDataToSend.append(`price_details[${i}][price_type]`, row.price_type)
        formDataToSend.append(`price_details[${i}][min_hours]`, String(minHours))
        formDataToSend.append(`price_details[${i}][price]`, row.price.toFixed(2))
        formDataToSend.append(`price_details[${i}][fuel_charge]`, row.fuel_charge.toFixed(2))
        formDataToSend.append(`price_details[${i}][driver_betta]`, row.driver_betta.toFixed(2))
      })
      
      // Add image file directly in the request
      // Backend will handle saving it and storing the filename
      if (selectedImage) {
        formDataToSend.append('car_image', selectedImage, selectedImage.name)
      }

      const apiUrl = import.meta.env.DEV 
        ? '/api/admin/car/add' 
        : 'http://127.0.0.1:8000/api/admin/car/add'
      
      // Log FormData for debugging
      console.log('Sending FormData with image file:', {
        car_name: formData.car_name,
        car_model: formData.car_model,
        car_category: formData.car_category,
        is_active: formData.is_active,
        no_of_seats: formData.no_of_seats,
        image_file: selectedImage?.name,
        price_details: tariffPrices
      })
      console.log('Sending image file directly in request. Backend will handle storage.')

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formDataToSend,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      })

      // Try to parse response as JSON, but handle errors
      let data
      const contentType = response.headers.get('content-type')
      
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        } else {
          const text = await response.text()
          console.error('Non-JSON response:', text)
          throw new Error(`Server error (${response.status}): ${text || response.statusText}`)
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        throw new Error(`Server error (${response.status}): ${response.statusText || 'Unknown error'}`)
      }

      if (response.ok && data.success) {
        setSuccess('Car added successfully!')
        // Redirect to car list after 1.5 seconds
        setTimeout(() => {
          navigate('/admin/car/list')
        }, 1500)
      } else {
        const validationText = formatLaravelValidationErrors(data?.errors)
        const errorMessage =
          validationText ||
          data.message ||
          data.error ||
          data.detail ||
          (typeof data === 'string' ? data : 'Failed to add car')
        console.error('API Error Response:', data)
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('Submit error:', err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An error occurred while adding the car'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-car-container">
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
            <Link to="/admin/car/list" className="nav-link">Admin Cars</Link>
            <Link to="/admin/car" className="nav-link active">Add Car</Link>
          </nav>
        </div>
      </header>

      <div className="admin-car-content">
        <div className="admin-header">
          <h1>Add New Car</h1>
          <p className="admin-subtitle">Fill in the details to add a new car to the inventory</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ whiteSpace: 'pre-line' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="car-form" encType="multipart/form-data">
          {/* Basic Information Section */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="car_name">Car Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="car_name"
                  name="car_name"
                  value={formData.car_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Toyota Camry"
                />
              </div>

              <div className="form-group">
                <label htmlFor="car_model">Car Model <span className="required">*</span></label>
                <input
                  type="text"
                  id="car_model"
                  name="car_model"
                  value={formData.car_model}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 2024"
                />
              </div>

              <div className="form-group">
                <label htmlFor="car_category">Category <span className="required">*</span></label>
                <select
                  id="car_category"
                  name="car_category"
                  value={formData.car_category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="0">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="no_of_seats">Number of Seats <span className="required">*</span></label>
                <input
                  type="number"
                  id="no_of_seats"
                  name="no_of_seats"
                  value={formData.no_of_seats}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amenities">Amenities</label>
                <select
                  id="amenities"
                  name="amenities"
                  multiple
                  value={formData.amenities ? formData.amenities.map(id => id.toString()) : []}
                  onChange={(e) => {
                    // Get all selected options from the multiselect
                    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value))
                    console.log('Selected amenities:', selectedOptions)
                    setFormData(prev => ({
                      ...prev,
                      amenities: selectedOptions.length > 0 ? selectedOptions : []
                    }))
                  }}
                  className="multi-select"
                  size={Math.min(amenities.length || 5, 8)}
                  style={{ minHeight: '150px' }}
                >
                  {amenities.length === 0 ? (
                    <option disabled>Loading amenities...</option>
                  ) : (
                    amenities.map((amenity) => (
                      <option key={amenity.id} value={amenity.id.toString()}>
                        {amenity.name}
                      </option>
                    ))
                  )}
                </select>
                <small className="form-help">
                  <strong>How to select multiple:</strong> Hold Ctrl (Windows/Linux) or Cmd (Mac) and click to select multiple amenities
                  {formData.amenities && formData.amenities.length > 0 && (
                    <span style={{ display: 'block', marginTop: '5px', color: '#007bff', fontWeight: '600' }}>
                      ✓ {formData.amenities.length} amenit{formData.amenities.length === 1 ? 'y' : 'ies'} selected
                    </span>
                  )}
                </small>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <span>Active (Car is available for booking)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="form-section">
            <h2 className="section-title">Car Image</h2>
            <div className="form-group">
              <label htmlFor="car_image">Car Image <span className="required">*</span></label>
              <div className="image-upload-area">
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Car preview" className="image-preview" />
                    <div className="upload-status" style={{ background: '#e8f5e9', color: '#2e7d32', marginTop: '10px' }}>
                      <span className="success-icon">✓</span>
                      <span>Image ready to send</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-remove-image"
                    >
                      Remove Image
                    </button>
                    <p className="image-filename">{imageFileName}</p>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="car_image"
                      name="car_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    <label htmlFor="car_image" className="file-input-label">
                      <span className="upload-icon">📷</span>
                      <span>Click to upload car image</span>
                      <small>PNG, JPG, JPEG up to 5MB</small>
                    </label>
                  </div>
                )}
              </div>
              <small className="form-help">
                Use a real photo file (JPEG, PNG, GIF, or WebP). Renamed documents are rejected and cause a 422 error.
              </small>
            </div>
          </div>

          {/* Price details — structured rows: range_type, price_type, price, fuel_charge, driver_betta */}
          <div className="form-section">
            <h2 className="section-title">Price Details</h2>
            <p className="pricing-intro">
              Each row: <code>range_type</code> (<code>below 250km</code> / <code>above 250km</code>),{' '}
              <code>price_type</code> (day or km),{' '}
              <code>price</code>, <code>fuel_charge</code>, <code>driver_betta</code>. All amounts in ₹.
            </p>
            <div className="pricing-blocks">
              {tariffPrices.map((row, index) => (
                <div key={row.range_type} className="pricing-block">
                  <div className="pricing-block__meta">
                    <span className="pricing-badge" title="Stored enum value">
                      {row.range_type}
                    </span>
                    <span className="pricing-badge pricing-badge--muted">price_type: {row.price_type}</span>
                  </div>
                  <h3 className="pricing-block__title">
                    <i
                      className={row.range_type === 'below 250km' ? 'fas fa-map-marker-alt' : 'fas fa-road'}
                      aria-hidden="true"
                    ></i>
                    {row.range_type === 'below 250km' ? 'Below 250 km' : 'Above 250 km'}
                  </h3>

                  <div className="form-group">
                    <label htmlFor={`tariff-${index}-price`}>
                      {row.price_type === 'day' ? 'Rent per day (₹)' : 'Rate per km (₹)'} <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id={`tariff-${index}-price`}
                      value={row.price || ''}
                      onChange={(e) => updateTariffNumber(index, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                      placeholder={row.price_type === 'day' ? 'e.g. 1300' : 'e.g. 11'}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`tariff-${index}-fuel`}>
                      Fuel charge (₹) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id={`tariff-${index}-fuel`}
                      value={row.fuel_charge || ''}
                      onChange={(e) => updateTariffNumber(index, 'fuel_charge', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                      placeholder="Per km"
                    />
                    <small className="form-help">Stored as fuel charge (per km).</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor={`tariff-${index}-driver`}>
                      Driver betta (₹) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id={`tariff-${index}-driver`}
                      value={row.driver_betta || ''}
                      onChange={(e) => updateTariffNumber(index, 'driver_betta', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                      placeholder="e.g. 300"
                    />
                  </div>
                </div>
              ))}
            </div>
            <small className="form-help pricing-mapping-note">
              API: <code>price_details[]</code> with{' '}
              <code>range_type</code>, <code>price_type</code>, <code>price</code>, <code>fuel_charge</code>,{' '}
              <code>driver_betta</code>.
            </small>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading || !selectedImage}
            >
              {loading ? 'Adding Car...' : 'Add Car'}
            </button>
            <Link to="/cars" className="btn-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminCar
