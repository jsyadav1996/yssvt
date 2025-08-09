import { MessageCircle, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: 'https://wa.me/6355757025',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      description: 'Chat with us on WhatsApp'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/yssvtrust/',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      description: 'Follow us on Facebook'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://www.twitter.com/trust_samaj/',
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      hoverColor: 'hover:bg-sky-100',
      description: 'Follow us on Twitter'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/yssvtrust/',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      hoverColor: 'hover:bg-pink-100',
      description: 'Follow us on Instagram'
    }
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'infoyssvt@gmail.com',
      link: 'mailto:infoyssvt@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 63557 57025',
      link: 'tel:+91 63557 57025'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Yadav samaj seva vikas trust Plot No.169, Sundarnagar Serve No 252. Near Laxminagar Bunglow B/H Narol Court, Ahmedabad Gujarat -382405 (India)',
      link: 'https://maps.app.goo.gl/ninHQdzygTczKBtB6'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {/* <section className="px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Contact <span className="text-primary-600">YSSVT</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 sm:mb-8 leading-relaxed">
            Get in touch with us through any of the following channels. We're here to help and connect with our community.
          </p>
        </div>
      </section> */}

      {/* Social Media Links */}
      <section className="sm:px-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
            Connect With Us
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {socialLinks.map((social) => {
              const IconComponent = social.icon
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-4 sm:p-6 rounded-xl border border-gray-200 ${social.bgColor} ${social.hoverColor} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-sm mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${social.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      {social.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {social.description}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {contactInfo.map((contact) => {
              const IconComponent = contact.icon
              return (
                <div
                  key={contact.title}
                  className="p-4 sm:p-6 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-100 mb-3 sm:mb-4">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      {contact.title}
                    </h3>
                    <a
                      href={contact.link}
                      className="text-xs sm:text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200 break-words"
                    >
                      {contact.value}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
} 