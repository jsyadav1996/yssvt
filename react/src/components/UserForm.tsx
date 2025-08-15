import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiClient, User } from '@/lib/api'
import { Save, User as UserIcon, Mail, Phone, MapPin, Shield, Camera, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import ImagePopup from './ImagePopup'

interface UserFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  dob: string
  gender: string
  occupationField: string
  occupation: string
  role?: string
}

interface FileData {
  file: File | null
  preview: string | null
}

interface UserFormProps {
  mode: 'profile' | 'add' | 'edit'
  user?: User | null
  onSuccess?: (user?: User) => void
  onCancel?: () => void
  showBackButton?: boolean
}

const UserForm: React.FC<UserFormProps> = ({ 
  mode, 
  user, 
  onSuccess, 
  onCancel
}) => {
  const { updateUser } = useAuthStore()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const location = useLocation()
  const formRef = useRef<HTMLDivElement>(null)
  console.log('location', location)

  // Scroll to top when there's an error or success message
  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }

  // Scroll to top when error or success message changes
  useEffect(() => {
    if (error || success) {
      scrollToTop()
    }
  }, [error, success])
  
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dob: '',
    gender: 'male',
    occupationField: '',
    occupation: '',
    role: 'member'
  })

  const [profileImage, setProfileImage] = useState<FileData>({
    file: null,
    preview: null
  })

  const [showImagePopup, setShowImagePopup] = useState(false)

  // Get form title and description based on mode
  const getFormInfo = () => {
    switch (mode) {
      case 'add':
        return {
          title: 'Add New Member',
          description: 'Create a new community member',
          submitText: 'Create Member'
        }
      case 'edit':
        return {
          title: 'Edit Member',
          description: 'Update member information',
          submitText: 'Save Changes'
        }
      default:
        return {
          title: 'Profile',
          description: 'Manage your account settings',
          submitText: 'Save Changes'
        }
    }
  }

  const formInfo = getFormInfo()

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {      
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          password: '', // Password is not loaded for security reasons
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          pincode: user.pincode || '',
          dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
          gender: user.gender || '',
          occupationField: user.occupationField || '',
          occupation: user.occupation || '',
          role: user.role || 'member'
        })
        
        // Set profile image preview if exists
        if (user.profileImagePath) {
          setProfileImage({
            file: null,
            preview: user.profileImagePath
          })
        }
        return
      }
    }

    loadUserData()
  }, [user])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage({
          file,
          preview: e.target?.result as string
        })
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name, last name are required')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      let response
      
      const formDataToSend = new FormData()
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('email', formData.email)
      if (formData.password) {
        formDataToSend.append('password', formData.password)
      }
      formDataToSend.append('phone', formData.phone || '')
      formDataToSend.append('dob', formData.dob || '')
      formDataToSend.append('gender', formData.gender || '')
      formDataToSend.append('address', formData.address || '')
      formDataToSend.append('city', formData.city || '')
      formDataToSend.append('state', formData.state || '')
      formDataToSend.append('pincode', formData.pincode || '')
      formDataToSend.append('occupationField', formData.occupationField || '')
      formDataToSend.append('occupation', formData.occupation || '')
      formDataToSend.append('role', formData.role || '')
      if (profileImage.file) {
        formDataToSend.append('image', profileImage.file)
      }
      if (mode === 'add') {
        // Create new user
        response = await apiClient.createUser(formDataToSend)
      } else if (mode === 'edit') {
        // Update existing user
        if (!user?.id) {
          setError('User ID not found')
          return
        }
        response = await apiClient.updateUser(BigInt(user.id), formDataToSend)
      } else {
        // Update profile
        response = await apiClient.updateProfile(formDataToSend)
      }

      if (response.success) {
        setSuccess(mode === 'add' ? 'Member created successfully!' : 'Profile updated successfully!')
        if (mode === 'profile') {
          updateUser(response.data as User)
        }
        // Call onSuccess callback if provided
        if (onSuccess && response.data) {
          onSuccess()
        }
      } else {
        if (response.errors) {
          const errorMessage = response.errors.map((error: any) => error.msg)
          setError(errorMessage.join('. '))
        } else {
          setError(response.message || 'Operation failed')
        }
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate(-1)
    }
  }

  return (
    <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm">
            {success}
          </div>
        )}

        {/* Profile Image Upload */}
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="profileImage" className="block text-xs sm:text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <div className="flex items-center space-x-4">
            {/* Image Preview */}
            <div 
              className={`w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300 flex items-center justify-center ${
                profileImage.preview ? 'cursor-pointer hover:border-primary-400 transition-colors' : ''
              }`}
              onClick={() => profileImage.preview && setShowImagePopup(true)}
            >
              {profileImage.preview ? (
                <img 
                  src={profileImage.preview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <Camera className="h-8 w-8 text-gray-400" />
              )}
            </div>
            
            {/* File Input */}
            <div className="flex-1">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="profileImage"
                className="cursor-pointer inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Camera className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {profileImage.file ? 'Change Image' : 'Upload Image'}
              </label>
              {profileImage.file && (
                <p className="text-xs text-gray-500 mt-1">
                  {profileImage.file.name} ({(profileImage.file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700">
              First Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter first name"
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={mode === 'profile'} // Email can't be changed in profile mode
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Password Field - Only for add mode */}
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        {/* Role Field - Only for add/edit modes */}
        {mode !== 'profile' && (
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="role" className="block text-xs sm:text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <select
                id="role"
                name="role"
                value={formData.role || 'member'}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select role</option>
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        )}

        {/* Phone Field */}
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Personal Information Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="dob" className="block text-xs sm:text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="flex gap-4 sm:gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-xs sm:text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-xs sm:text-sm text-gray-700">Female</span>
              </label>
            </div>
          </div>
        </div>

        {/* Address Field */}
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter address"
            />
          </div>
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter state"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="pincode" className="block text-xs sm:text-sm font-medium text-gray-700">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter pincode"
            />
          </div>
        </div>

        {/* Occupation Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="occupationField" className="block text-xs sm:text-sm font-medium text-gray-700">
              Occupation Field
            </label>
            <select
              id="occupationField"
              name="occupationField"
              value={formData.occupationField}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">Select occupation field</option>
              <option value="agriculture_and_allied">Agriculture and Allied</option>
              <option value="industry_and_manufacturing">Industry and Manufacturing</option>
              <option value="trade_and_business">Trade and Business</option>
              <option value="government_and_public_services">Government and Public Services</option>
              <option value="education_and_research">Education and Research</option>
              <option value="healthcare">Healthcare</option>
              <option value="media_and_entertainment">Media and Entertainment</option>
              <option value="corporate_sector">Corporate Sector</option>
              <option value="legal_and_judiciary">Legal and Judiciary</option>
              <option value="skilled_services">Skilled Services</option>
              <option value="transport_and_logistics">Transport and Logistics</option>
              <option value="hospitality_and_tourism">Hospitality and Tourism</option>
              <option value="freelancing_and_emerging_roles">Freelancing and Emerging Roles</option>
            </select>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="occupation" className="block text-xs sm:text-sm font-medium text-gray-700">
              Occupation
            </label>
            <select
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">Select occupation</option>
              <option value="farmer">Farmer</option>
              <option value="fisherman">Fisherman</option>
              <option value="livestock_rearer">Livestock Rearer</option>
              <option value="horticulturist">Horticulturist</option>
              <option value="factory_worker">Factory Worker</option>
              <option value="industrialist">Industrialist</option>
              <option value="mechanic">Mechanic</option>
              <option value="welder">Welder</option>
              <option value="carpenter">Carpenter</option>
              <option value="plumber">Plumber</option>
              <option value="shopkeeper">Shopkeeper</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="wholesale_trader">Wholesale Trader</option>
              <option value="retail_salesperson">Retail Salesperson</option>
              <option value="small_business_owner">Small Business Owner</option>
              <option value="government_employee">Government Employee</option>
              <option value="police_officer">Police Officer</option>
              <option value="soldier">Soldier</option>
              <option value="postman">Postman</option>
              <option value="clerk">Clerk</option>
              <option value="teacher">Teacher</option>
              <option value="professor">Professor</option>
              <option value="researcher">Researcher</option>
              <option value="tutor">Tutor</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="medical_technician">Medical Technician</option>
              <option value="media_person_journalist">Media Person (Journalist)</option>
              <option value="actor">Actor</option>
              <option value="singer">Singer</option>
              <option value="photographer">Photographer</option>
              <option value="dancer">Dancer</option>
              <option value="engineer_it_civil_etc">Engineer (IT, Civil, etc.)</option>
              <option value="accountant">Accountant</option>
              <option value="hr_professional">HR Professional</option>
              <option value="marketing_executive">Marketing Executive</option>
              <option value="data_analyst">Data Analyst</option>
              <option value="lawyer">Lawyer</option>
              <option value="judge">Judge</option>
              <option value="barber">Barber</option>
              <option value="tailor">Tailor</option>
              <option value="cobbler">Cobbler</option>
              <option value="domestic_helper">Domestic Helper</option>
              <option value="driver">Driver</option>
              <option value="courier_delivery_agent">Courier Delivery Agent</option>
              <option value="chef">Chef</option>
              <option value="hotel_manager">Hotel Manager</option>
              <option value="tour_guide">Tour Guide</option>
              <option value="digital_marketer">Digital Marketer</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : formInfo.submitText}</span>
          </button>
        </div>
      </form>

      {/* Image Popup */}
      {profileImage.preview && (
        <ImagePopup
          isOpen={showImagePopup}
          onClose={() => setShowImagePopup(false)}
          imageSrc={profileImage.preview}
          imageAlt="Profile Image"
          name={`${formData.firstName} ${formData.lastName}`.trim() || 'Profile Image'}
          designation={mode === 'profile' ? 'Your Profile' : 'Member Profile'}
        />
      )}
    </div>
  )
}

export default UserForm 