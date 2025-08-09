import { useEffect } from 'react'

interface ImagePopupProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
  name?: string
  designation?: string
}

const ImagePopup = ({ isOpen, onClose, imageSrc, imageAlt, name, designation }: ImagePopupProps) => {
  // Close popup on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative z-10 max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
          aria-label="Close popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Container */}
        <div className="relative">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto max-h-[70vh] object-contain"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(imageAlt)}&size=800&background=3B82F6&color=ffffff&font-size=0.33`
            }}
          />
        </div>

        {/* Optional Name and Designation */}
        {(name || designation) && (
          <div className="p-6 bg-gray-50 border-t">
            {name && (
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
            )}
            {designation && (
              <p className="text-gray-600">{designation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImagePopup 