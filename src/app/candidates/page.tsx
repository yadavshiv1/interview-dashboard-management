'use client'

import { useState, useEffect, useCallback } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { candidateAPI, Candidate } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'
import { useNotification } from '@/hooks/useNotification'

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [total, setTotal] = useState(0)
  const { user } = useAuth()
  const { showError } = useNotification()

  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const limit = 10

  const fetchCandidates = useCallback(async (search: string, page: number) => {
    try {
      setIsLoading(true)
      const skip = page * limit
      const data = await candidateAPI.getCandidates(skip, limit, search)
      setCandidates(data.users)
      setTotal(data.total)
    } catch (err) {
      showError('Failed to fetch candidates')
      console.error('Error fetching candidates:', err)
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchCandidates(debouncedSearchTerm, 0)
    setCurrentPage(0)
  }, [debouncedSearchTerm, fetchCandidates])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchCandidates(debouncedSearchTerm, newPage)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <ProtectedRoute allowedRoles={['admin', 'ta_member', 'panelist']}>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search candidates by name, email, or department..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2 custom-scrollbar overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-blue-500/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400 uppercase tracking-wider border-r border-gray-700/50">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400 uppercase tracking-wider border-r border-gray-700/50">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400 uppercase tracking-wider border-r border-gray-700/50">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400 uppercase tracking-wider border-r border-gray-700/50">
                          Company
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700/50">
                      {candidates.map((candidate, index) => (
                        <tr 
                          key={candidate.id} 
                          className="group transition-all duration-200 ease-in-out hover:bg-gradient-to-r hover:from-gray-750 hover:to-gray-850 hover:shadow-md cursor-pointer transform-gpu"
                          style={{
                            transitionDelay: `${index * 30}ms`
                          }}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:scale-105 transition-transform duration-200">
                                {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <div className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors duration-200">
                                  {candidate.firstName} {candidate.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-xs text-gray-300 group-hover:text-white transition-colors duration-200">
                              {candidate.email}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300 group-hover:bg-blue-500/30 group-hover:text-blue-200 transition-all duration-200">
                              {candidate.company.department}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-xs text-gray-300 group-hover:text-white transition-colors duration-200">
                              {candidate.company.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                            <div className="flex justify-end items-center space-x-2">
                              <Link
                                href={`/candidates/${candidate.id}`}
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium bg-blue-500/20 hover:bg-blue-500/30 px-2 py-1 rounded border border-blue-500/30 hover:border-blue-400/50 text-xs"
                              >
                                View Details
                              </Link>

                              {user?.role === 'panelist' && (
                                <Link
                                  href={`/feedback/${candidate.id}`}
                                  className="text-green-400 hover:text-green-300 transition-colors duration-200 font-medium bg-green-500/20 hover:bg-green-500/30 px-2 py-1 rounded border border-green-500/30 hover:border-green-400/50 text-xs"
                                >
                                  Submit Feedback
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {candidates.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-sm">No candidates found</div>
                    <p className="text-gray-500 text-xs mt-1">Try adjusting your search criteria</p>
                  </div>
                )}
              </>
            )}

            {totalPages > 1 && (
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    Page <span className="font-medium text-white">{currentPage + 1}</span> of{' '}
                    <span className="font-medium text-white">{totalPages}</span>
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">
                    {total} total
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-1.5 bg-gray-700 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-600 hover:border-gray-500"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1.5 bg-gray-700 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-600 hover:border-gray-500"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}