'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { candidateAPI, Candidate, Todo, Post } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

type TabType = 'profile' | 'schedule' | 'feedback'

interface PostWithReactions extends Omit<Post, 'reactions'> {
  reactions: number | { likes: number; dislikes: number };
}

export default function CandidateDetail() {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [posts, setPosts] = useState<PostWithReactions[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()

  const candidateId = parseInt(params.id as string)

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setIsLoading(true)
        const [candidateData, todosData, postsData] = await Promise.all([
          candidateAPI.getCandidate(candidateId),
          candidateAPI.getTodos(candidateId),
          candidateAPI.getPosts(candidateId),
        ])
        setCandidate(candidateData)
        setTodos(todosData)
        setPosts(
          postsData.map((post) => ({
            ...post,
            reactions:
              typeof post.reactions === 'number'
                ? { likes: post.reactions, dislikes: 0 }
                : post.reactions
          }))
        )
      } catch (error) {
        console.error('Failed to fetch candidate data:', error)
        router.push('/candidates')
      } finally {
        setIsLoading(false)
      }
    }

    if (candidateId) {
      fetchCandidateData()
    }
  }, [candidateId, router])

  const renderReactions = (post: PostWithReactions) => {
    if (typeof post.reactions === 'object' && post.reactions !== null) {
      return (
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          {post.reactions.likes !== undefined && (
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span className="text-xs">{post.reactions.likes}</span>
            </div>
          )}
          {post.reactions.dislikes !== undefined && (
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
              </svg>
              <span className="text-xs">{post.reactions.dislikes}</span>
            </div>
          )}
        </div>
      )
    }
    
    if (typeof post.reactions === 'number') {
      return (
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span className="text-xs">{post.reactions}</span>
        </div>
      )
    }    
    return null
  }

  const renderTags = (post: PostWithReactions) => {
    if (Array.isArray(post.tags)) {
      return (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
            >
              {typeof tag === 'string' ? tag : JSON.stringify(tag)}
            </span>
          ))}
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'ta_member', 'panelist']}>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!candidate) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'ta_member', 'panelist']}>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-white mb-3">Candidate not found</h1>
            <Link 
              href="/candidates" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
            >
              ← Back to Candidates
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const canViewSchedule = ['admin', 'ta_member'].includes(user?.role || '')
  const canViewFeedback = ['admin', 'ta_member', 'panelist'].includes(user?.role || '')

  return (
    <ProtectedRoute allowedRoles={['admin', 'ta_member', 'panelist']}>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/candidates"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-3 inline-flex items-center text-sm font-medium group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span className="ml-1">Back to Candidates</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {candidate.firstName} {candidate.lastName}
                </h1>
                <p className="mt-0.5 text-sm text-gray-400">
                  {candidate.company.name} • {candidate.company.department}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                Profile
              </button>
              {canViewSchedule && (
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-all duration-200 ${
                    activeTab === 'schedule'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Schedule & Tasks
                </button>
              )}
              {canViewFeedback && (
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs transition-all duration-200 ${
                    activeTab === 'feedback'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  Feedback & Reviews
                </button>
              )}
            </nav>
          </div>

          <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
            {activeTab === 'profile' && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
                  Candidate Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-750 rounded-md p-3 border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Full Name</label>
                    <p className="mt-0.5 text-xs font-medium text-white">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                  </div>
                  <div className="bg-gray-750 rounded-md p-3 border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</label>
                    <p className="mt-0.5 text-xs text-white break-all">{candidate.email}</p>
                  </div>
                  <div className="bg-gray-750 rounded-md p-3 border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</label>
                    <p className="mt-0.5 text-xs text-white">{candidate.phone}</p>
                  </div>
                  <div className="bg-gray-750 rounded-md p-3 border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Domain</label>
                    <p className="mt-0.5 text-xs text-white">{candidate.domain}</p>
                  </div>
                  <div className="bg-gray-750 rounded-md p-3 border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Company</label>
                    <p className="mt-0.5 text-xs text-white">{candidate.company.name}</p>
                  </div>
                  <div className="bg-gray-750 rounded-md p-3 border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Department</label>
                    <p className="mt-0.5 text-xs text-white">{candidate.company.department}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && canViewSchedule && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-1.5 h-4 bg-green-500 rounded-full mr-2"></span>
                  Interview Schedule & Tasks
                </h3>
                <div className="max-h-80 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {todos.map((todo, index) => (
                    <div
                      key={todo.id}
                      className="flex items-center p-3 bg-gray-750 border border-gray-700 rounded-md hover:border-gray-600 transition-all duration-200 group"
                      style={{
                        transitionDelay: `${index * 30}ms`
                      }}
                    >
                      <div className={`flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                        todo.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-500 group-hover:border-blue-500'
                      }`}>
                        {todo.completed && (
                          <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`ml-3 text-xs font-medium transition-all duration-200 flex-1 ${
                          todo.completed 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {todo.todo}
                      </span>
                    </div>
                  ))}
                  {todos.length === 0 && (
                    <div className="text-center py-6">
                      <div className="text-gray-400 text-xs mb-1">No scheduled tasks</div>
                      <p className="text-gray-500 text-xs">Tasks will appear here once scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'feedback' && canViewFeedback && (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-1.5 h-4 bg-purple-500 rounded-full mr-2"></span>
                  Feedback & Reviews
                </h3>
                <div className="max-h-80 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {posts.map((post, index) => (
                    <div 
                      key={post.id} 
                      className="border border-gray-700 rounded-md p-3 bg-gray-750 hover:border-gray-600 transition-all duration-200 group"
                      style={{
                        transitionDelay: `${index * 20}ms`
                      }}
                    >
                      <h4 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-200 text-xs">
                        {post.title}
                      </h4>
                      <p className="text-gray-300 mb-3 leading-relaxed text-xs line-clamp-2">{post.body}</p>
                      <div className="flex justify-between items-center">
                        {renderTags(post)}
                        {renderReactions(post)}
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-6">
                      <div className="text-gray-400 text-xs mb-1">No feedback submitted</div>
                      <p className="text-gray-500 text-xs">Be the first to provide feedback for this candidate</p>
                    </div>
                  )}
                </div>
                {user?.role === 'panelist' && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Link
                      href={`/feedback/${candidateId}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-200 shadow hover:shadow-md"
                    >
                      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Submit Feedback
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}