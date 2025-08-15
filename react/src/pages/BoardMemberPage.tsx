import { useState } from 'react'
import ImagePopup from '@/components/ImagePopup'

interface BoardMember {
  id: number
  name: string
  designation: string
  image: string
  area?: string
}

// Sample data for trustees
const trustees: BoardMember[] = [
  {
    id: 1,
    name: "Mr. Manoj Ahir",
    designation: "Founder",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/manoj-ahir.jpeg"
  },
  {
    id: 2,
    name: "Mr. Rakesh Yadav",
    designation: "National President",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/rakeshyadav.jpeg"
  },
  {
    id: 3,
    name: "Mr. Jayesh Yadav",
    designation: "National Vice President",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Jayesh_yadav.jpeg"
  },
  {
    id: 4,
    name: "Mr. Hitendra Ahir",
    designation: "National Youth President",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Hitendra-Ahir.jpeg"
  },
  {
    id: 5,
    name: "Mr. Babulal Yadav",
    designation: "Trustee",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/babulal_yadav.jpeg"
  },
  {
    id: 6,
    name: "Mr. Ravishankar Yadav",
    designation: "Trustee",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/ravishanker_yadav.jpeg"
  },
  {
    id: 7,
    name: "Mr. Ramkishor Yadav",
    designation: "Trustee",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/ramkishor_yadav.jpeg"
  },
  {
    id: 8,
    name: "Mr. Vasudev Yadav",
    designation: "Trustee",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/vasudev_yadav.jpeg"
  },
  {
    id: 9,
    name: "Mr. Hariram Yadav",
    designation: "Trustee",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Hariram_yadav.jpeg"
  },
  {
    id: 10,
    name: "Mr. Arjun Yadav",
    designation: "Trustee",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/arjun_yadav.jpeg"
  }
]

// Sample data for patrons
const patrons: BoardMember[] = [
  {
    id: 1,
    name: "MR. D.S. Yadav",
    designation: "M. R. Road Line Transport",
    area: "Ishanpur, Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/D.S.YADAV.jpeg"
  },
  {
    id: 2,
    name: "Mr. M.D. Yadav",
    designation: "Raghunath School",
    area: "Bapunagar, Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/MAHENDRA-YADAV.jpeg"
  },
  {
    id: 3,
    name: "MR. R.S. Yadav",
    designation: "Transport",
    area: "Hathizan, Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/R-S-YADAV.jpeg"
  },
  {
    id: 4,
    name: "Mr. Radheshyam R Yadav",
    designation: "Radhe Dairy Parlor",
    area: "Civil, Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Radhe-Shyam-Yadav-dairy.jpeg"
  },
  {
    id: 5,
    name: "MR. Mulayam Singh Yadav",
    area: "Bareja, Ahmedabad",
    designation: "Bajrang Transport",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Mulayam-Singh-Yadav.jpeg"
  },
  {
    id: 6,
    name: "Mr. Jagdish Yadav",
    designation: "Bansidhar Road Line",
    area: "Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/JagdishYadav.jpeg"
  },
  {
    id: 7,
    name: "MR. Ajay Yadav",
    designation: "President - Gujarat Pradesh",
    area: "Bapunagar, Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Ajay-Yadav.jpeg"
  },
  {
    id: 8,
    name: "Mr. Hariram Yadav",
    designation: "Treasurer",
    area: "Meghaninagar, Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Hariram-Yadav.jpeg"
  },
  {
    id: 9,
    name: "MR. Ashok Yadav",
    designation: "Director In Hari Om School",
    area: "Meghaninagar, Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/Ashok-Yadav.jpeg"
  },
  {
    id: 10,
    name: "Mr. Ram Kishan Yadav",
    designation: "Patanjali Store",
    area: "Ghodasar, Ahmedabad",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/RAMKISHAN-YADAV.jpeg"
  },
  {
    id: 11,
    name: "Dr. Vikas Yadav",
    area: "",
    designation: "",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/dr_vikas_yadav.jpeg"
  },
  {
    id: 12,
    name: "Dr. Satish Yadav",
    designation: "",
    area: "",
    image: "https://xhuhctuysxgqcpfybhdl.supabase.co/storage/v1/object/public/board-members/dr_satish_yadav.jpeg"
  }
]

const MemberCard = ({ member, onImageClick }: { member: BoardMember, onImageClick: (member: BoardMember) => void }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => onImageClick(member)}>
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=3B82F6&color=ffffff&font-size=0.33`
          }}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{member.name}</h3>
        <p className="text-sm text-gray-600">{member.designation}</p>
        {member.area ? (<p className="text-sm text-gray-600">{member.area}</p>) : ''}
      </div>
    </div>
  )
}

const BoardMemberPage = () => {
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null)

  const handleImageClick = (member: BoardMember) => {
    setSelectedMember(member)
  }

  const handleClosePopup = () => {
    setSelectedMember(null)
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          {/* Page Description */}
          {/* <div className="text-center mb-6">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our dedicated leaders who guide and support our community initiatives
            </p>
          </div> */}

          {/* Our Trustees Section */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Trustees</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trustees.map((trustee) => (
                <MemberCard key={trustee.id} member={trustee} onImageClick={handleImageClick} />
              ))}
            </div>
          </section>

          {/* Our Patron Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Patron</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {patrons.map((patron) => (
                <MemberCard key={patron.id} member={patron} onImageClick={handleImageClick} />
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

export default BoardMemberPage 