import { useState, useEffect } from 'react'
import { Eye, Target, Users, Heart, GraduationCap, Home, Phone, Mail } from 'lucide-react'

export default function AboutPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-scroll horizontal images
  const heroImages = [
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/yssvt_udyam_certificate.jpeg',
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/yssvt_nitiayog.jpg', 
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/yssvt_ngo_id.jpg',
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/yssvt_form10ac.jpg',
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/yssvt_csr_activities.jpeg',
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/allphoto_banner.jpeg',
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/img_val.jpg',
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/img23.jpeg',
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/img26.jpeg',
    'https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/img25.jpeg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  const schemes = [
    {
      title: 'Mass marriage (Mass marriage of daughters from poor families without unnecessary expenses save).'
    },
    {
      title: 'To try to eliminate dowry system in the society.'
    },
    {
      title: 'Schemes like knitting, weaving and embroidery for women'
    },
    {
      title: 'Save the girl child, educate the girl child, awaken the people of the society against female foeticide.'
    },
    {
      title: 'Addiction recovery awakening'
    },
    {
      title: 'young premature death plan.'
    },
    {
      title: 'Free: Legal Advice'
    },
    {
      title: 'Annual financial incentive to children (reward distribution).'
    },
    {
      title: 'Providing benefits of government schemes to poor families.'
    },
    {
      title: 'Service to the elderly (serving the elderly by setting up an oldage home).'
    },
    {
      title: 'To work for the welfare and upliftment of society.'
    },
    {
      title: 'Farmers Club.'
    }
  ]

  const contactDesignations = [
    {
      name: 'Shree Manoj Kumar R. Aahir',
      designation: 'Organization President',
    },
    {
      name: 'Shree Rakesh Kumar R. Yadav',
      designation: 'Organization Co-President',
    },
    {
      name: 'Organization Secretary',
      designation: 'Shree Ravishankar R. Yadav',
    }
  ]

  return (
    <div className="min-h-screen bg-white">

      <section className="sm:px-4 py-2 sm:py-2">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Welcome to Yadav Samaj Seva Vikas Trust
              </h2>
            </div>
          </div>
        </div>
      </section>
      
      {/* Auto-scrolling Horizontal Images */}
      <section className="sm:px-4 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
                             {heroImages.map((image, index) => (
                 <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center bg-gray-100">
                   <img 
                     src={image} 
                     alt={`YSSVT Community ${index + 1}`}
                     className="max-w-full max-h-full object-contain"
                   />
                 </div>
               ))}
            </div>
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Image with Text */}
      <section className="sm:px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Shree Yadav Samaj Seva Vikas Trust President ki Kalme......
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              "You all are warmly welcomed to the web site of Yadav Samaj Seva Vikas Trust."
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              "Seek the blessings of your support in my life to take the development of society to new heights. And want more active contribution"
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Yadav Social Service Development Trust aims to keep alive the glorious history of the Yadav people and the traditions of the society. Efforts are necessary to introduce today's generation to ideals and culture. There are many problems in our society. there are impurities and evil. Due to which today the pride of the society is being tarnished and the ongoing feud in the society. Tradition, dowry, illiteracy, and increasing drug addiction among the youth are licking the moral values of the society like termites.The aim of the Yadav community is to remove these problems hindering development and restore our lost glory. The main objective of the Service Development Trust is through this we will know each other closely and recognize each other in happiness and sorrow. Classmates will become a chance for all of us to become aware of what is bad and what is good in the society. Found if there is a shortage in the society so how can they be removed and if there is goodness then how can they be increased so that So that our society can develop, people should give up petty thoughts, animosity and moral and social evils. Cooperate with all your heart, mind and wealth in building Yadav society.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              "We hope and believe that all of you members of the society will also join us in this mission of Yadav Samaj Seva Vikas Trust. We will walk shoulder to shoulder together and contribute towards the upliftment of the society."
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              With this determination.....
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              Your sincerely,<br/>
              Manojkumar Ramavadh Ahir
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              Jai Yadav... Jai Madhav...
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src="https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/extra/student_award_celebration.jpeg"
                alt="YSSVT Community Service"
                className="w-full h-auto object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="sm:px-4 py-6 sm:py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Vision */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-100 mr-4">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Empowered communities where people live happy lives with healthy relationships and compassion for sustainable development Serve fellow travelers.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-100 mr-4">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              To improve the lives of the people of the society by meeting their developmental needs and create social To empower, enable and empower volunteers to serve the community through transformational initiatives. attach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schemes of YSSVT */}
      <section className="sm:px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Schemes of Yadav Social Service Development Trust
            </h2>
          </div>
          
          <ol className="list-decimal list-inside space-y-2 max-w-4xl mx-auto text-sm sm:text-base text-gray-700">
            {schemes.map((scheme, index) => (
              <li key={index} className="leading-relaxed">
                {scheme.title}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact Designation Cards */}
      <section className="sm:px-4 py-6 sm:py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Contact Our Leadership Team
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Get in touch with our dedicated leadership team for any inquiries or support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
            {contactDesignations.map((contact, index) => (
              <div 
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-100 mb-4 sm:mb-6 mx-auto overflow-hidden">
                    {/* <img 
                      src={contact.image}
                      alt={contact.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          const icon = document.createElement('div')
                          icon.innerHTML = '<svg class="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
                          parent.appendChild(icon.firstChild!)
                        }
                      }}
                    /> */}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                    {contact.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-primary-600 font-medium mb-3 sm:mb-4">
                    {contact.designation}
                  </p>
                  {/* <div className="space-y-2">
                    <a 
                      href={`tel:${contact.phone}`}
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </a>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
                    >
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </a>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 