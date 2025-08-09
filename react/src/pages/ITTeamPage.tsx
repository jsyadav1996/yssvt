import { useState } from 'react'
import ImagePopup from '@/components/ImagePopup'

interface ITTeamMember {
  id: number
  name: string
  designation: string
  image: string
}

// Sample data for IT team members
const itTeamMembers: ITTeamMember[] = [
  {
    id: 1,
    name: "MR. Mahesh S Yadav",
    designation: "IT Head, Founder of WorldWideWebSolution.com & PingTreeSystems.com",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Mahesh-Yadav2.png"
  },
  {
    id: 2,
    name: "MR. Jagdish S Yadav",
    designation: "Sr. Software Engineer",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/my-image.jpeg"
  },
  {
    id: 3,
    name: "MR. Manoj S Yadav",
    designation: "Sr. Software Engineer",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Manoj-S-Yadav-1.png"
  }
]

const MemberCard = ({ member, onImageClick }: { member: ITTeamMember, onImageClick: (member: ITTeamMember) => void }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => onImageClick(member)}>
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=3B82F6&color=ffffff&font-size=0.33`
          }}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{member.name}</h3>
        <p className="text-sm text-gray-600">{member.designation}</p>
      </div>
    </div>
  )
}

const ITTeamPage = () => {
  const [selectedMember, setSelectedMember] = useState<ITTeamMember | null>(null)

  const handleImageClick = (member: ITTeamMember) => {
    setSelectedMember(member)
  }

  const handleClosePopup = () => {
    setSelectedMember(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Description */}
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our dedicated IT professionals who develop and maintain our digital platforms
          </p>
        </div>

        {/* IT Team Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our IT Team</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {itTeamMembers.map((member) => (
              <MemberCard key={member.id} member={member} onImageClick={handleImageClick} />
            ))}
          </div>
        </section>
      </div>

      {/* Image Popup */}
      {selectedMember && (
        <ImagePopup
          isOpen={!!selectedMember}
          onClose={handleClosePopup}
          imageSrc={selectedMember.image}
          imageAlt={selectedMember.name}
          name={selectedMember.name}
          designation={selectedMember.designation}
        />
      )}
    </div>
  )
}

export default ITTeamPage 