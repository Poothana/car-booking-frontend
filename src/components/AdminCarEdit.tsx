import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './AdminCar.css'

interface Category {
  id: number
  name: string
}

interface PriceType {
  id: number
  type_name: string
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

function AdminCarEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const amenitiesSelectRef = useRef<HTMLSelectElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [priceTypes, setPriceTypes] = useState<PriceType[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
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

  // Fetch categories, price types, and amenities on component mount
  useEffect(() => {
    fetchCategories()
    fetchPriceTypes()
    fetchAmenities()
  }, [])

  // Fetch car data for editing
  useEffect(() => {
    if (id) {
      fetchCarData(parseInt(id))
    }
  }, [id])

  // Sync selected amenities when amenities list is loaded
  // This ensures existing amenities show as selected even if amenities list loads after car data
  useEffect(() => {
    if (!loadingData && amenities.length > 0 && formData.amenities && formData.amenities.length > 0) {
      // Filter to only include valid amenity IDs that exist in the loaded list
      const validAmenities = formData.amenities.filter(id => 
        amenities.some(a => a.id === id)
      )
      
      // Update if there's a mismatch (some amenities were invalid)
      if (validAmenities.length !== formData.amenities.length) {
        console.log('Syncing amenities: removing invalid IDs', {
          original: formData.amenities,
          valid: validAmenities
        })
        setFormData(prev => ({
          ...prev,
          amenities: validAmenities
        }))
      }
      
      // Manually set selected state in DOM to ensure visibility
      // This is needed because React's controlled component might not always reflect selection immediately
      if (amenitiesSelectRef.current && validAmenities.length > 0) {
        // Use setTimeout to ensure options are rendered first
        setTimeout(() => {
          const select = amenitiesSelectRef.current
          if (select && select.options.length > 0) {
            console.log('=== MANUALLY SETTING SELECTION ===')
            console.log('Select element found with', select.options.length, 'options')
            console.log('Valid amenity IDs to select:', validAmenities)
            
            // Clear all selections first
            Array.from(select.options).forEach(option => {
              option.selected = false
            })
            
            // Set selected state for each valid amenity
            let selectedCount = 0
            validAmenities.forEach(id => {
              const option = Array.from(select.options).find(opt => 
                parseInt(opt.value) === id
              )
              if (option) {
                option.selected = true
                selectedCount++
                console.log(`✓ Selected option: ${option.value} - ${option.text}`)
              } else {
                console.warn(`✗ Option not found for amenity ID: ${id}`)
              }
            })
            
            console.log(`Successfully selected ${selectedCount} out of ${validAmenities.length} amenities`)
          } else {
            console.warn('Select element or options not ready yet')
          }
        }, 200) // Increased timeout to ensure DOM is fully ready
      }
    }
  }, [amenities.length, loadingData, formData.amenities]) // Depend on all relevant values

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

  const fetchPriceTypes = async () => {
    try {
      const apiUrl = import.meta.env.DEV 
        ? '/api/price-type' 
        : 'http://127.0.0.1:8000/api/price-type'
      
      const response = await fetch(apiUrl)
      if (response.ok) {
        const data = await response.json()
        // Handle different response formats
        if (data.success && data.data) {
          setPriceTypes(data.data)
        } else if (Array.isArray(data)) {
          setPriceTypes(data)
        } else if (data.price_types) {
          setPriceTypes(data.price_types)
        }
      }
    } catch (err) {
      console.error('Error fetching price types:', err)
      // Fallback to default price types
      setPriceTypes([
        { id: 1, type_name: 'day' },
        { id: 2, type_name: 'week' }
      ])
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

      // Parse amenities from additional_details
      const parsedAmenities = (() => {
        const amenitiesData = car.additional_details?.amenities
        
        if (!amenitiesData) {
          return []
        }
        
        // If it's already an array of numbers
        if (Array.isArray(amenitiesData) && amenitiesData.length > 0) {
          // Check if it's array of objects with id property
          if (typeof amenitiesData[0] === 'object' && amenitiesData[0]?.id) {
            return amenitiesData.map((item: any) => parseInt(item.id)).filter((id: number) => !isNaN(id))
          }
          // If it's array of numbers, return as is
          if (typeof amenitiesData[0] === 'number') {
            return amenitiesData
          }
          // If it's array of strings (IDs as strings), convert to numbers
          if (typeof amenitiesData[0] === 'string') {
            return amenitiesData.map((id: string) => parseInt(id)).filter((id: number) => !isNaN(id))
          }
          return []
        }
        
        // If it's a string (comma-separated IDs)
        if (typeof amenitiesData === 'string') {
          return amenitiesData.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id))
        }
        
        return []
      })()
      
      // Debug log to verify amenities loading
      console.log('=== FETCHING CAR DATA ===')
      console.log('Car additional_details:', car.additional_details)
      console.log('Raw amenities data from API:', car.additional_details?.amenities)
      console.log('Parsed amenities IDs:', parsedAmenities)
      console.log('Currently loaded amenities list:', amenities.length, 'items')
      
      // Determine which amenities to set in formData
      // If amenities list is loaded, filter to only valid ones
      // Otherwise, keep all parsed amenities (they'll be filtered later when amenities list loads)
      let amenitiesToSet = parsedAmenities
      if (parsedAmenities.length > 0 && amenities.length > 0) {
        const validAmenities = parsedAmenities.filter(id => 
          amenities.some(a => a.id === id)
        )
        console.log('Valid amenities that exist in list:', validAmenities)
        if (validAmenities.length !== parsedAmenities.length) {
          console.warn('Some amenity IDs from car data do not exist in amenities list')
        }
        amenitiesToSet = validAmenities
      } else if (parsedAmenities.length > 0 && amenities.length === 0) {
        console.log('Amenities list not loaded yet, will set all parsed amenities and filter later')
      }

      console.log('Setting formData.amenities to:', amenitiesToSet)

      setFormData({
        car_name: car.car_name || '',
        car_model: car.car_model || '',
        car_category: car.car_category || 0,
        is_active: car.is_active !== undefined ? car.is_active : true,
        no_of_seats: car.additional_details?.no_of_seats || car.no_of_seats || 5,
        amenities: amenitiesToSet,
        price_details: car.price_details || [
          { price_type: 'day', min_hours: 24, price: 0 },
          { price_type: 'week', min_hours: 168, price: 0 }
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
        [field]: field === 'min_hours' || field === 'price' ? Number(value) : value
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

    // Handle 404 (not found) or 405 (method not allowed) - skip upload, send file directly
    if (response.status === 404 || response.status === 405) {
      console.warn(`Upload endpoint not available (${response.status}). Will send file directly with car update.`)
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
        // Handle 404 or 405 errors - allow direct file upload
        if (errorMsg.includes('404') || errorMsg.includes('405') || errorMsg.includes('Method Not Allowed')) {
          setUseDirectFileUpload(true)
          setUploadedImageName(file.name)
          setError(null) // Clear error since we'll use direct upload
          console.log('Upload endpoint not available. Image will be sent directly with car update.')
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
      
      // Add amenities as array
      if (formData.amenities && formData.amenities.length > 0) {
        formData.amenities.forEach((amenityId, index) => {
          formDataToSend.append(`additional_details[amenities][${index}]`, amenityId.toString())
        })
      }
      
      formData.price_details.forEach((priceDetail, index) => {
        formDataToSend.append(`price_details[${index}][price_type]`, priceDetail.price_type)
        formDataToSend.append(`price_details[${index}][min_hours]`, priceDetail.min_hours.toString())
        formDataToSend.append(`price_details[${index}][price]`, (priceDetail.price || 0).toString())
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

              <div className="form-group">
                <label htmlFor="amenities">Amenities</label>
                {loadingData ? (
                  <p>Loading amenities...</p>
                ) : (
                  <>
                    <select
                      key={`amenities-select-${amenities.length}-${formData.amenities?.join(',') || ''}`}
                      ref={amenitiesSelectRef}
                      id="amenities"
                      name="amenities"
                      multiple
                      value={(() => {
                        // Get valid selected amenity IDs as strings
                        if (formData.amenities && formData.amenities.length > 0 && amenities.length > 0) {
                          const validIds = formData.amenities
                            .filter(id => amenities.some(a => a.id === id))
                            .map(id => id.toString())
                          console.log('=== MULTISELECT RENDER ===')
                          console.log('formData.amenities:', formData.amenities)
                          console.log('Available amenities:', amenities.map(a => ({ id: a.id, name: a.name })))
                          console.log('Setting multiselect value (selected IDs):', validIds)
                          return validIds
                        }
                        return []
                      })()}
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
                        <option disabled>No amenities available</option>
                      ) : (
                        amenities.map((amenity) => {
                          const isSelected = formData.amenities && formData.amenities.includes(amenity.id)
                          return (
                            <option 
                              key={amenity.id} 
                              value={amenity.id.toString()}
                              selected={isSelected}
                            >
                              {amenity.name}
                            </option>
                          )
                        })
                      )}
                    </select>
                    <small className="form-help">
                      <strong>How to select multiple:</strong> Hold Ctrl (Windows/Linux) or Cmd (Mac) and click to select multiple amenities
                      {formData.amenities && formData.amenities.length > 0 && (
                        <span style={{ display: 'block', marginTop: '5px', color: '#007bff', fontWeight: '600' }}>
                          ✓ {formData.amenities.length} amenit{formData.amenities.length === 1 ? 'y' : 'ies'} selected: {formData.amenities.map(id => {
                            const amenity = amenities.find(a => a.id === id)
                            return amenity ? amenity.name : id
                          }).join(', ')}
                        </span>
                      )}
                    </small>
                  </>
                )}
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
              {formData.price_details.map((priceDetail, index) => {
                const priceType = priceTypes.find(pt => pt.type_name === priceDetail.price_type)
                return (
                  <div key={index} className="price-detail-card">
                    <h3 className="price-detail-title">
                      {priceType ? priceType.type_name.charAt(0).toUpperCase() + priceType.type_name.slice(1) : priceDetail.price_type} Pricing
                    </h3>
                    <div className="form-group">
                      <label>Price Type</label>
                      <select
                        value={priceDetail.price_type}
                        onChange={(e) => {
                          handlePriceDetailChange(index, 'price_type', e.target.value)
                        }}
                      >
                        {priceTypes.map(pt => (
                          <option key={pt.id} value={pt.type_name}>
                            {pt.type_name.charAt(0).toUpperCase() + pt.type_name.slice(1)}
                          </option>
                        ))}
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
                    <div className="form-group">
                      <label>Price (₹) <span className="required">*</span></label>
                      <input
                        type="number"
                        value={priceDetail.price || 0}
                        onChange={(e) => handlePriceDetailChange(index, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Discount Price Details Section */}
          <div className="form-section">
            <h2 className="section-title">Discount Price Details (Optional)</h2>
            <div className="price-details-grid">
              {formData.discount_price_details.map((discountPrice, index) => {
                const priceType = priceTypes.find(pt => pt.type_name === discountPrice.price_type)
                return (
                  <div key={index} className="price-detail-card">
                    <h3 className="price-detail-title">
                      {priceType ? priceType.type_name.charAt(0).toUpperCase() + priceType.type_name.slice(1) : discountPrice.price_type} Discount Price
                    </h3>
                    <div className="form-group">
                      <label>Price Type</label>
                      <select
                        value={discountPrice.price_type}
                        onChange={(e) => handleDiscountPriceChange(index, 'price_type', e.target.value)}
                      >
                        {priceTypes.map(pt => (
                          <option key={pt.id} value={pt.type_name}>
                            {pt.type_name.charAt(0).toUpperCase() + pt.type_name.slice(1)}
                          </option>
                        ))}
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
                )
              })}
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

