import React from 'react'
import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] text-[#0b1c30] px-4">
      <div className="max-w-xl w-full rounded-3xl border border-[#d3e4fe] bg-white p-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-sm text-[#64748b] mb-8">The page you tried to reach doesn&apos;t exist yet, or it may have been moved.</p>
        <Link to="/dashboard" className="inline-flex items-center justify-center rounded-2xl bg-[#00685f] px-5 py-3 text-white text-sm font-semibold transition hover:bg-[#005049]">
          Go back to Dashboard
        </Link>
      </div>
    </div>
  )
}
