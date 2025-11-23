import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

function AdminCar() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImageName, setUploadedImageName] = useState<string>('')
  const [useDirectFileUpload, setUseDirectFileUpload] = useState(false)

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
      // Set default categories if API fails
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

    // Handle 404 - endpoint doesn't exist
    if (response.status === 404) {
      console.warn('Upload endpoint not found. Will send file directly with car creation.')
      // Return the original filename - we'll send the file directly
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      setSelectedImage(file)
      setImageFileName(file.name)
      setUploadedImageName('') // Reset previous upload
      setError(null)
      setUploadingImage(true)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload image immediately (or mark for direct upload if endpoint doesn't exist)
      try {
        const savedFileName = await uploadImage(file)
        setUploadedImageName(savedFileName)
        setImageFileName(savedFileName)
        
        // If we got back the original filename (404 fallback), use direct file upload
        if (savedFileName === file.name) {
          setUseDirectFileUpload(true)
          console.log('Upload endpoint not available. Will send file directly with car creation.')
        } else {
          setUseDirectFileUpload(false)
          console.log('Image uploaded successfully:', savedFileName)
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError)
        // Don't reset on upload error - allow user to proceed with direct file upload
        // The error message will guide them
        const errorMsg = uploadError instanceof Error ? uploadError.message : 'Failed to upload image'
        if (errorMsg.includes('404')) {
          // Endpoint doesn't exist - allow direct file upload
          setUseDirectFileUpload(true)
          setUploadedImageName(file.name)
          setError('Upload endpoint not found. Image will be sent directly with car creation.')
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
    setImageFileName('')
    setUploadedImageName('')
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

      if (!useDirectFileUpload && !uploadedImageName && uploadingImage) {
        throw new Error('Image is still uploading. Please wait...')
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
      
      // Price details
      formData.price_details.forEach((priceDetail, index) => {
        formDataToSend.append(`price_details[${index}][price_type]`, priceDetail.price_type)
        formDataToSend.append(`price_details[${index}][min_hours]`, priceDetail.min_hours.toString())
      })
      
      // Discount price details (format price with 2 decimal places)
      formData.discount_price_details.forEach((discountPrice, index) => {
        formDataToSend.append(`discount_price_details[${index}][price_type]`, discountPrice.price_type)
        const formattedPrice = parseFloat(discountPrice.price.toString()).toFixed(2)
        formDataToSend.append(`discount_price_details[${index}][price]`, formattedPrice)
      })
      
      // Add image - either filename (if uploaded separately) or file (if direct upload)
      if (useDirectFileUpload && selectedImage) {
        // Send the file directly (fallback when upload endpoint doesn't exist)
        formDataToSend.append('car_image', selectedImage, selectedImage.name)
      } else if (uploadedImageName) {
        // Send only the filename (preferred method when upload endpoint exists)
        formDataToSend.append('car_image_url', uploadedImageName)
        formDataToSend.append('car_image', uploadedImageName) // Some APIs might expect this field name
      }

      const apiUrl = import.meta.env.DEV 
        ? '/api/admin/car/add' 
        : 'http://127.0.0.1:8000/api/admin/car/add'
      
      // Log FormData for debugging
      console.log('Sending FormData:', {
        car_name: formData.car_name,
        car_model: formData.car_model,
        car_category: formData.car_category,
        is_active: formData.is_active,
        no_of_seats: formData.no_of_seats,
        image_filename: uploadedImageName,
        price_details: formData.price_details,
        discount_price_details: formData.discount_price_details
      })

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
        // Extract error message from various possible response formats
        const errorMessage = data.message || data.error || data.detail || data.errors || 
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
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Car preview" className="image-preview" />
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
                        <span>Will be sent with car creation request</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-remove-image"
                      disabled={uploadingImage}
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
                Image will be automatically saved to src/assets/images/cars/ folder. Only the filename will be sent in the request.
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
              disabled={loading || !selectedImage || !uploadedImageName || uploadingImage}
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
