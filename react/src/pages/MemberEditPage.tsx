import React from 'react'
import { useParams } from 'react-router-dom'

const MemberEditPage: React.FC = () => {
  const { id } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Member</h1>
      <p>Editing member ID: {id}</p>
      <p>This page will contain a form to edit member information.</p>
    </div>
  )
}

export default MemberEditPage 