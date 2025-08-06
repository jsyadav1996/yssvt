import { useNavigate } from 'react-router-dom'
import { Calendar, Users, Heart, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Calendar,
      title: 'Community Events',
      description: 'Join exciting events and activities organized by our community.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Member Network',
      description: 'Connect with fellow members and build meaningful relationships.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Heart,
      title: 'Donations',
      description: 'Support our community initiatives through secure donations.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome to{' '}
            <span className="text-primary-600">YSSVT Community</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            Connect, collaborate, and contribute to our vibrant community. Join us in building meaningful relationships and making a positive impact together.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary w-full text-sm sm:text-base"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => navigate('/events')}
              className="btn-outline w-full text-sm sm:text-base"
            >
              View Events
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-3 sm:px-4 py-6 sm:py-8 bg-gray-50">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
            What We Offer
          </h2>
          <p className="text-sm sm:text-base text-gray-600 text-center">
            Discover the amazing features that make our community platform special
          </p>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-3 sm:p-4"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                  <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-3 sm:px-4 py-6 sm:py-8 bg-primary-600">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-sm sm:text-base text-primary-100 mb-4 sm:mb-6">
            Become a part of something bigger. Connect with like-minded individuals and make a difference.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn bg-white text-primary-600 active:bg-gray-50 w-full text-sm sm:text-base"
          >
            Join Now
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-3 sm:px-4 py-6 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-2">YSSVT Community</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Building a stronger community through connection, collaboration, and shared values.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => navigate('/events')}
                    className="active:text-white"
                  >
                    Events
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/donations')}
                    className="active:text-white"
                  >
                    Donations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/about')}
                    className="active:text-white"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Contact</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>info@yssvt.org</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Community St</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-3 sm:pt-4 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 YSSVT Community. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 