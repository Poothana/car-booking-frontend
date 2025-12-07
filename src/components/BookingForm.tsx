import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './BookingForm.css'

interface LocationState {
  car?: {
    id: number
    name: string
    model: string
    image: string
    price?: number
    priceType?: string
  }
  journeyDetails?: {
    pickup_location?: string
    drop_location?: string
    journey_from_date?: string
    journey_end_date?: string
  }
}

function BookingForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  const car = state?.car
  const initialJourneyDetails = state?.journeyDetails

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    adharno: '',
    pan_no: '',
    phone_no: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    is_prime_user: false,
    is_red_flag: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [customerSubmitted, setCustomerSubmitted] = useState(false)
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  
  const [journeyData, setJourneyData] = useState({
    journey_from_date: initialJourneyDetails?.journey_from_date || '',
    journey_end_date: initialJourneyDetails?.journey_end_date || '',
    pickup_location: initialJourneyDetails?.pickup_location || '',
    drop_location: initialJourneyDetails?.drop_location || ''
  })
  
  const [journeyErrors, setJourneyErrors] = useState<Record<string, string>>({})
  const [submittingJourney, setSubmittingJourney] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }
    if (!formData.phone_no.trim()) {
      newErrors.phone_no = 'Phone number is required'
    } else if (!/^\d{10,15}$/.test(formData.phone_no.trim())) {
      newErrors.phone_no = 'Phone number must be 10-15 digits'
    }
    if (formData.adharno && !/^\d{12}$/.test(formData.adharno.trim())) {
      newErrors.adharno = 'Aadhar number must be exactly 12 digits'
    }
    if (formData.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_no.trim().toUpperCase())) {
      newErrors.pan_no = 'PAN number must be in format ABCDE1234F'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const apiUrl = import.meta.env.DEV 
        ? '/api/customer/add' 
        : 'http://127.0.0.1:8000/api/customer/add'
      
      const requestData = {
        ...formData,
        car_id: car?.id,
        pan_no: formData.pan_no ? formData.pan_no.toUpperCase() : null,
        is_prime_user: formData.is_prime_user ? 1 : 0,
        is_red_flag: formData.is_red_flag ? 1 : 0
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        const result = await response.json()
        // Store customer ID if returned from API
        if (result.data && result.data.id) {
          setCustomerId(result.data.id)
        } else if (result.customer_id) {
          setCustomerId(result.customer_id)
        }
        setCustomerSubmitted(true)
        // Clear customer form errors
        setErrors({})
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || 'Failed to submit customer details'}`)
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred while submitting the booking')
    } finally {
      setSubmitting(false)
    }
  }

  const handleJourneyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setJourneyData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field
    if (journeyErrors[name]) {
      setJourneyErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateJourneyForm = () => {
    const newErrors: Record<string, string> = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!journeyData.journey_from_date) {
      newErrors.journey_from_date = 'Journey start date is required'
    } else {
      const startDate = new Date(journeyData.journey_from_date)
      startDate.setHours(0, 0, 0, 0)
      if (startDate < today) {
        newErrors.journey_from_date = 'Journey start date cannot be in the past'
      }
    }

    if (!journeyData.journey_end_date) {
      newErrors.journey_end_date = 'Journey end date is required'
    } else if (journeyData.journey_from_date) {
      const startDate = new Date(journeyData.journey_from_date)
      const endDate = new Date(journeyData.journey_end_date)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
      if (endDate < startDate || endDate.getTime() === startDate.getTime()) {
        newErrors.journey_end_date = 'Journey end date must be after start date'
      }
    }

    // Note: pickup_location and drop_location are nullable in API, but we can make them required in UI
    // They should be location IDs from locations table, but keeping as text for now
    // Backend may need to handle conversion or lookup

    setJourneyErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleJourneySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateJourneyForm()) {
      return
    }

    setSubmittingJourney(true)
    try {
      const apiUrl = import.meta.env.DEV 
        ? '/api/booking/add' 
        : 'http://127.0.0.1:8000/api/booking/add'
      
      const requestData: Record<string, any> = {
        car_id: car?.id,
        customer_id: customerId,
        journey_from_date: journeyData.journey_from_date,
        journey_end_date: journeyData.journey_end_date
      }
      
      // Add pickup_location if provided (should be location ID from locations table)
      if (journeyData.pickup_location.trim()) {
        requestData.pickup_location = journeyData.pickup_location.trim()
      }
      
      // Add drop_location if provided (should be location ID from locations table)
      if (journeyData.drop_location.trim()) {
        requestData.drop_location = journeyData.drop_location.trim()
      }
      
      // Status is optional, default to 'pending' if not set
      requestData.status = 'pending'
      
      // Payment amounts can be calculated on backend or set here
      // For now, leave them null as they're nullable

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        try {
          const result = await response.json()
          console.log('Booking successful:', result)
        } catch (e) {
          console.log('Booking successful (no JSON response)')
        }
        setShowSuccessPopup(true)
      } else {
        let errorMessage = 'Failed to submit journey details'
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        alert(`Error: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Journey booking error:', error)
      alert('An error occurred while submitting the journey details')
    } finally {
      setSubmittingJourney(false)
    }
  }

  // Show journey form after customer is submitted
  if (customerSubmitted) {
    return (
      <>
        <div className="booking-form-container">
        <div className="booking-form-header">
          <button className="back-button" onClick={() => setCustomerSubmitted(false)}>← Back</button>
          <h1>Journey Details</h1>
        </div>

        <div className="booking-form-content">
          <div className="success-message">
            <h2>✓ Customer Details Submitted Successfully!</h2>
            <p>Please provide your journey details to complete the booking.</p>
          </div>

          {car && (
            <div className="car-summary-card">
              <img src={car.image} alt={car.name} className="car-summary-image" />
              <div className="car-summary-details">
                <h3>{car.name} {car.model}</h3>
                {car.price && (
                  <p className="car-summary-price">
                    ₹ {car.price.toLocaleString()} {car.priceType ? `per ${car.priceType}` : ''}
                  </p>
                )}
              </div>
            </div>
          )}

          <form className="booking-form" onSubmit={handleJourneySubmit}>
            <div className="form-section">
              <h2>Journey Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="journey_from_date">Journey Start Date <span className="required">*</span></label>
                  <input
                    type="date"
                    id="journey_from_date"
                    name="journey_from_date"
                    value={journeyData.journey_from_date}
                    onChange={handleJourneyInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className={journeyErrors.journey_from_date ? 'error' : ''}
                  />
                  {journeyErrors.journey_from_date && <span className="error-message">{journeyErrors.journey_from_date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="journey_end_date">Journey End Date <span className="required">*</span></label>
                  <input
                    type="date"
                    id="journey_end_date"
                    name="journey_end_date"
                    value={journeyData.journey_end_date}
                    onChange={handleJourneyInputChange}
                    required
                    min={journeyData.journey_from_date || new Date().toISOString().split('T')[0]}
                    className={journeyErrors.journey_end_date ? 'error' : ''}
                  />
                  {journeyErrors.journey_end_date && <span className="error-message">{journeyErrors.journey_end_date}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pickup_location">Pickup Location</label>
                <input
                  type="text"
                  id="pickup_location"
                  name="pickup_location"
                  value={journeyData.pickup_location}
                  onChange={handleJourneyInputChange}
                  placeholder="Enter pickup location ID"
                  className={journeyErrors.pickup_location ? 'error' : ''}
                />
                <small style={{color: '#666', fontSize: '12px', display: 'block', marginTop: '5px'}}>
                  Note: Should be a location ID from locations table
                </small>
                {journeyErrors.pickup_location && <span className="error-message">{journeyErrors.pickup_location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="drop_location">Drop Location</label>
                <input
                  type="text"
                  id="drop_location"
                  name="drop_location"
                  value={journeyData.drop_location}
                  onChange={handleJourneyInputChange}
                  placeholder="Enter drop location ID"
                  className={journeyErrors.drop_location ? 'error' : ''}
                />
                <small style={{color: '#666', fontSize: '12px', display: 'block', marginTop: '5px'}}>
                  Note: Should be a location ID from locations table
                </small>
                {journeyErrors.drop_location && <span className="error-message">{journeyErrors.drop_location}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => navigate('/cars')}>
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={submittingJourney}>
                {submittingJourney ? 'Submitting...' : 'Complete Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay" onClick={() => {
          setShowSuccessPopup(false)
          navigate('/cars')
        }}>
          <div className="success-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="success-popup-icon">✓</div>
            <h2 className="success-popup-title">Thanks for Booking!</h2>
            <p className="success-popup-message">
              Our team will connect with you soon.
            </p>
            <div className="success-popup-contact">
              <p className="contact-heading">For Other Enquiry Contact:</p>
              <p className="contact-info">
                <span className="contact-label">Phone:</span>
                <a href="tel:6380063873" className="contact-link">6380063873</a>
              </p>
              <p className="contact-info">
                <span className="contact-label">Email:</span>
                <a href="mailto:poothanapuvi@gmail.com" className="contact-link">poothanapuvi@gmail.com</a>
              </p>
            </div>
            <button 
              className="success-popup-button" 
              onClick={() => {
                setShowSuccessPopup(false)
                navigate('/cars')
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      </>
    )
  }

  return (
    <div className="booking-form-container">
      <div className="booking-form-header">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>Book Your Car</h1>
      </div>

      <div className="booking-form-content">
        {car && (
          <div className="car-summary-card">
            <img src={car.image} alt={car.name} className="car-summary-image" />
            <div className="car-summary-details">
              <h3>{car.name} {car.model}</h3>
              {car.price && (
                <p className="car-summary-price">
                  ₹ {car.price.toLocaleString()} {car.priceType ? `per ${car.priceType}` : ''}
                </p>
              )}
            </div>
          </div>
        )}

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  className={errors.first_name ? 'error' : ''}
                />
                {errors.first_name && <span className="error-message">{errors.first_name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  className={errors.last_name ? 'error' : ''}
                />
                {errors.last_name && <span className="error-message">{errors.last_name}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone_no">Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                id="phone_no"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                required
                maxLength={15}
                placeholder="10-15 digits"
                className={errors.phone_no ? 'error' : ''}
              />
              {errors.phone_no && <span className="error-message">{errors.phone_no}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter your full address"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Identification Details</h2>
            
            <div className="form-group">
              <label htmlFor="adharno">Aadhar Number</label>
              <input
                type="text"
                id="adharno"
                name="adharno"
                value={formData.adharno}
                onChange={handleInputChange}
                maxLength={12}
                placeholder="12 digits"
                className={errors.adharno ? 'error' : ''}
              />
              {errors.adharno && <span className="error-message">{errors.adharno}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pan_no">PAN Number</label>
              <input
                type="text"
                id="pan_no"
                name="pan_no"
                value={formData.pan_no}
                onChange={handleInputChange}
                maxLength={10}
                placeholder="ABCDE1234F"
                className={errors.pan_no ? 'error' : ''}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.pan_no && <span className="error-message">{errors.pan_no}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Options</h2>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_prime_user"
                  checked={formData.is_prime_user}
                  onChange={handleInputChange}
                />
                <span>Prime User</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_red_flag"
                  checked={formData.is_red_flag}
                  onChange={handleInputChange}
                />
                <span>Red Flag User</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Next: Journey Details'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay" onClick={() => {
          setShowSuccessPopup(false)
          navigate('/cars')
        }}>
          <div className="success-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="success-popup-icon">✓</div>
            <h2 className="success-popup-title">Thanks for Booking!</h2>
            <p className="success-popup-message">
              Our team will connect with you soon.
            </p>
            <div className="success-popup-contact">
              <p className="contact-heading">For Other Enquiry Contact:</p>
              <p className="contact-info">
                <span className="contact-label">Phone:</span>
                <a href="tel:6380063873" className="contact-link">6380063873</a>
              </p>
              <p className="contact-info">
                <span className="contact-label">Email:</span>
                <a href="mailto:poothanapuvi@gmail.com" className="contact-link">poothanapuvi@gmail.com</a>
              </p>
            </div>
            <button 
              className="success-popup-button" 
              onClick={() => {
                setShowSuccessPopup(false)
                navigate('/cars')
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingForm


