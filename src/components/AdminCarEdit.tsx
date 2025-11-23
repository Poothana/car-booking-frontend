import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './AdminCar.css'

interface Category {
  id: number
  name: string
}

interface PriceDetail {
  price_type: string
  min_hours: number
  price?: number
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
  price_details: PriceDetail[]
  discount_price_details: DiscountPriceDetail[]
}

function AdminCarEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImageName, setUploadedImageName] = useState<string>('')
  const [useDirectFileUpload, setUseDirectFileUpload] = useState(false)
  const [existingImageUrl, setExistingImageUrl] = useState<string>('')

  const [formData, setFormData] = useState<CarFormData>({
    car_name: '',
    car_model: '',
    car_category: 0,
    is_active: true,
    no_of_seats: 5,
    price_details: [
      { price_type: 'day', min_hours: 24 },
      { price_type: 'week', min_hours: 168 }
    ],
    discount_price_details: [
      { price_type: 'day', price: 0 },
      { price_type: 'week', price: 0 }
    ]
  })

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch car data for editing
  useEffect(() => {
    if (id) {
      fetchCarData(parseInt(id))
    }
  }, [id])

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
      setCategories([
        { id: 1, name: 'Hatchback' },
        { id: 2, name: 'Sedan' },
        { id: 3, name: 'SUV' },
        { id: 4, name: 'MUV' },
        { id: 5, name: 'Luxury' },
        { id: 6, name: 'Premium Sedan' },
      ])
    }
  }

  const fetchCarData = async (carId: number) => {
    try {
      setLoadingData(true)
      setError(null)
      
      const apiUrl = import.meta.env.DEV 
        ? `/api/admin/car/${carId}` 
        : `http://127.0.0.1:8000/api/admin/car/${carId}`
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch car data: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle different response formats
      let car
      if (data.success && data.data) {
        car = data.data
      } else if (data.success && data.car) {
        car = data.car
      } else if (data.id) {
        // If response is the car object directly
        car = data
      } else {
        throw new Error('Invalid car data format')
      }

      setFormData({
        car_name: car.car_name || '',
        car_model: car.car_model || '',
        car_category: car.car_category || 0,
        is_active: car.is_active !== undefined ? car.is_active : true,
        no_of_seats: car.additional_details?.no_of_seats || car.no_of_seats || 5,
        price_details: car.price_details || [
          { price_type: 'day', min_hours: 24 },
          { price_type: 'week', min_hours: 168 }
        ],
        discount_price_details: car.discount_price_details || [
          { price_type: 'day', price: 0 },
          { price_type: 'week', price: 0 }
        ]
      })
      setExistingImageUrl(car.car_image_url || '')
      setImageFileName(car.car_image_url || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load car data')
      console.error('Error fetching car data:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handlePriceDetailChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newPriceDetails = [...prev.price_details]
      newPriceDetails[index] = {
        ...newPriceDetails[index],
        [field]: field === 'min_hours' ? Number(value) : value
      }
      return {
        ...prev,
        price_details: newPriceDetails
      }
    })
  }

  const handleDiscountPriceChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newDiscountPrices = [...prev.discount_price_details]
      newDiscountPrices[index] = {
        ...newDiscountPrices[index],
        [field]: field === 'price' ? Number(value) : value
      }
      return {
        ...prev,
        discount_price_details: newDiscountPrices
      }
    })
  }

  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('car_image', file, file.name)

    const uploadUrl = import.meta.env.DEV 
      ? '/api/admin/car/upload-image' 
      : 'http://127.0.0.1:8000/api/admin/car/upload-image'
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    })

    if (response.status === 404) {
      console.warn('Upload endpoint not found. Will send file directly with car update.')
      return file.name
    }

    const contentType = response.headers.get('content-type')
    let data

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error(`Server error (${response.status}): ${text || response.statusText}`)
      }
    } catch (parseError) {
      console.error('Error parsing upload response:', parseError)
      throw new Error(`Server error (${response.status}): ${response.statusText || 'Unknown error'}`)
    }

    if (response.ok && data.success) {
      return data.filename || data.image_name || file.name
    } else {
      const errorMessage = data.message || data.error || 'Failed to upload image'
      throw new Error(errorMessage)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      setSelectedImage(file)
      setImageFileName(file.name)
      setUploadedImageName('')
      setError(null)
      setUploadingImage(true)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      try {
        const savedFileName = await uploadImage(file)
        setUploadedImageName(savedFileName)
        setImageFileName(savedFileName)
        
        if (savedFileName === file.name) {
          setUseDirectFileUpload(true)
          console.log('Upload endpoint not available. Will send file directly with car update.')
        } else {
          setUseDirectFileUpload(false)
          console.log('Image uploaded successfully:', savedFileName)
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError)
        const errorMsg = uploadError instanceof Error ? uploadError.message : 'Failed to upload image'
        if (errorMsg.includes('404')) {
          setUseDirectFileUpload(true)
          setUploadedImageName(file.name)
          setError('Upload endpoint not found. Image will be sent directly with car update.')
        } else {
          setError(errorMsg)
        }
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setImageFileName(existingImageUrl)
    setUploadedImageName('')
    setUseDirectFileUpload(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!formData.car_name || !formData.car_model || !formData.car_category) {
        throw new Error('Please fill in all required fields')
      }

      if (!selectedImage && !useDirectFileUpload && !uploadedImageName && !existingImageUrl) {
        throw new Error('Please select a car image')
      }

      const formDataToSend = new FormData()
      
      formDataToSend.append('car_name', formData.car_name.trim())
      formDataToSend.append('car_model', formData.car_model.trim())
      formDataToSend.append('car_category', formData.car_category.toString())
      formDataToSend.append('is_active', formData.is_active ? '1' : '0')
      formDataToSend.append('additional_details[no_of_seats]', formData.no_of_seats.toString())
      
      formData.price_details.forEach((priceDetail, index) => {
        formDataToSend.append(`price_details[${index}][price_type]`, priceDetail.price_type)
        formDataToSend.append(`price_details[${index}][min_hours]`, priceDetail.min_hours.toString())
      })
      
      formData.discount_price_details.forEach((discountPrice, index) => {
        formDataToSend.append(`discount_price_details[${index}][price_type]`, discountPrice.price_type)
        const formattedPrice = parseFloat(discountPrice.price.toString()).toFixed(2)
        formDataToSend.append(`discount_price_details[${index}][price]`, formattedPrice)
      })
      
      if (useDirectFileUpload && selectedImage) {
        formDataToSend.append('car_image', selectedImage, selectedImage.name)
      } else if (uploadedImageName) {
        formDataToSend.append('car_image_url', uploadedImageName)
        formDataToSend.append('car_image', uploadedImageName)
      } else if (existingImageUrl) {
        formDataToSend.append('car_image_url', existingImageUrl)
        formDataToSend.append('car_image', existingImageUrl)
      }

      const apiUrl = import.meta.env.DEV 
        ? `/api/admin/car/update/${id}` 
        : `http://127.0.0.1:8000/api/admin/car/update/${id}`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formDataToSend,
      })

      let data
      const contentType = response.headers.get('content-type')
      
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        } else {
          const text = await response.text()
          throw new Error(`Server error (${response.status}): ${text || response.statusText}`)
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        throw new Error(`Server error (${response.status}): ${response.statusText || 'Unknown error'}`)
      }

      if (response.ok && data.success) {
        setSuccess('Car updated successfully!')
        setTimeout(() => {
          navigate('/admin/car/list')
        }, 1500)
      } else {
        const errorMessage = data.message || data.error || data.detail || data.errors || 
                           (typeof data === 'string' ? data : 'Failed to update car')
        console.error('API Error Response:', data)
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('Submit error:', err)
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An error occurred while updating the car'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="admin-car-container">
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
              <Link to="/admin/car" className="nav-link">Add Car</Link>
            </nav>
          </div>
        </header>
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
          Loading car data...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-car-container">
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

      <div className="admin-car-content">
        <div className="admin-header">
          <h1>Edit Car</h1>
          <p className="admin-subtitle">Update car details</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="car-form" encType="multipart/form-data">
          {/* Same form structure as AdminCar.tsx */}
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
                  min="2"
                  max="10"
                />
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
                {imagePreview || existingImageUrl ? (
                  <div className="image-preview-container">
                    <img 
                      src={imagePreview || existingImageUrl} 
                      alt="Car preview" 
                      className="image-preview" 
                    />
                    {uploadingImage && (
                      <div className="upload-status">
                        <span className="upload-spinner">⏳</span>
                        <span>Uploading...</span>
                      </div>
                    )}
                    {uploadedImageName && !uploadingImage && !useDirectFileUpload && (
                      <div className="upload-success">
                        <span className="success-icon">✓</span>
                        <span>Uploaded: {uploadedImageName}</span>
                      </div>
                    )}
                    {useDirectFileUpload && !uploadingImage && (
                      <div className="upload-status" style={{ background: '#fff3cd', color: '#856404' }}>
                        <span>⚠</span>
                        <span>Will be sent with car update request</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-remove-image"
                      disabled={uploadingImage}
                    >
                      Remove/Change Image
                    </button>
                    <p className="image-filename">{imageFileName || existingImageUrl}</p>
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
                      disabled={uploadingImage}
                    />
                    <label htmlFor="car_image" className="file-input-label">
                      <span className="upload-icon">📷</span>
                      <span>Click to upload car image</span>
                      <small>PNG, JPG, JPEG up to 5MB</small>
                      {uploadingImage && <small style={{ color: '#007bff' }}>Uploading...</small>}
                    </label>
                  </div>
                )}
              </div>
              <small className="form-help">
                Leave unchanged to keep existing image, or upload a new one.
              </small>
            </div>
          </div>

          {/* Price Details Section */}
          <div className="form-section">
            <h2 className="section-title">Price Details</h2>
            <div className="price-details-grid">
              {formData.price_details.map((priceDetail, index) => (
                <div key={index} className="price-detail-card">
                  <h3 className="price-detail-title">
                    {priceDetail.price_type === 'day' ? 'Daily' : 'Weekly'} Pricing
                  </h3>
                  <div className="form-group">
                    <label>Price Type</label>
                    <select
                      value={priceDetail.price_type}
                      onChange={(e) => handlePriceDetailChange(index, 'price_type', e.target.value)}
                      disabled
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Minimum Hours</label>
                    <input
                      type="number"
                      value={priceDetail.min_hours}
                      onChange={(e) => handlePriceDetailChange(index, 'min_hours', e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount Price Details Section */}
          <div className="form-section">
            <h2 className="section-title">Discount Price Details (Optional)</h2>
            <div className="price-details-grid">
              {formData.discount_price_details.map((discountPrice, index) => (
                <div key={index} className="price-detail-card">
                  <h3 className="price-detail-title">
                    {discountPrice.price_type === 'day' ? 'Daily' : 'Weekly'} Discount Price
                  </h3>
                  <div className="form-group">
                    <label>Price Type</label>
                    <select
                      value={discountPrice.price_type}
                      onChange={(e) => handleDiscountPriceChange(index, 'price_type', e.target.value)}
                      disabled
                    >
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Discount Price (₹)</label>
                    <input
                      type="number"
                      value={discountPrice.price}
                      onChange={(e) => handleDiscountPriceChange(index, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={loading || (!selectedImage && !uploadedImageName && !existingImageUrl)}
            >
              {loading ? 'Updating Car...' : 'Update Car'}
            </button>
            <Link to="/admin/car/list" className="btn-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminCarEdit

