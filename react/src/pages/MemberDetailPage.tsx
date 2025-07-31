import React from 'react'
import { useParams } from 'react-router-dom'

const MemberDetailPage: React.FC = () => {
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Member Details</h1>
      <p>Member ID: {id}</p>
      <p>This page will show detailed information about the member.</p>
    </div>
  )
}

export default MemberDetailPage 