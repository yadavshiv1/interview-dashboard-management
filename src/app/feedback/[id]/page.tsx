'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { candidateAPI, Candidate } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface FeedbackForm {
  overallScore: number
  strengths: string
  areasForImprovement: string
  comments: string
}

export default function FeedbackForm() {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<FeedbackForm>({
    mode: 'onChange',
    defaultValues: {
      overallScore: 50,
      strengths: '',
      areasForImprovement: '',
      comments: ''
    }
  })

  const candidateId = parseInt(params.id as string)
  const watchedScore = watch('overallScore')

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const candidateData = await candidateAPI.getCandidate(candidateId)
        setCandidate(candidateData)
      } catch (error) {
        console.error('Failed to fetch candidate:', error)
        router.push('/candidates')
      }
    }

    if (candidateId) {
      fetchCandidate()
    }
  }, [candidateId, router])

  const onSubmit = async (data: FeedbackForm) => {
    if (user?.role !== 'panelist') {
      setSubmitError('Only panelists can submit feedback')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Feedback submitted:', {
        candidateId,
        ...data,
        reviewer: `${user?.firstName} ${user?.lastName}`,
        timestamp: new Date().toISOString()
      })

      setSubmitSuccess(true)
      setTimeout(() => {
        router.push(`/candidates/${candidateId}`)
      }, 2000)
    } catch (error) {
      setSubmitError('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateScore = (value: number) => {
    if (value < 1 || value > 100) {
      return 'Score must be between 1 and 100'
    }
    return true
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  if (user?.role !== 'panelist') {
    return (
      <ProtectedRoute allowedRoles={['panelist']}>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-400 mb-3">Access Denied</h1>
            <p className="text-gray-400">Only panelists can submit feedback.</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!candidate) {
    return (
      <ProtectedRoute allowedRoles={['panelist']}>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (submitSuccess) {
    return (
      <ProtectedRoute allowedRoles={['panelist']}>
        <Navbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-green-400 text-4xl mb-3">✓</div>
            <h1 className="text-xl font-bold text-white mb-2">Feedback Submitted!</h1>
            <p className="text-gray-400">Redirecting back to candidate details...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['panelist']}>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => router.push(`/candidates/${candidateId}`)}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-3 inline-flex items-center text-sm font-medium group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span className="ml-1">Back to Candidate</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Submit Feedback
                </h1>
                <p className="mt-0.5 text-xs text-gray-400">
                  For {candidate.firstName} {candidate.lastName} • {candidate.company.department}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label htmlFor="overallScore" className="block text-xs font-medium text-gray-300 mb-2">
                  Overall Score *
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    id="overallScore"
                    min="1"
                    max="100"
                    className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    {...register('overallScore', {
                      required: 'Overall score is required',
                      validate: validateScore,
                      valueAsNumber: true
                    })}
                    onChange={(e) => {
                      setValue('overallScore', parseInt(e.target.value))
                      trigger('overallScore')
                    }}
                  />
                  <span className={`text-sm font-semibold min-w-10 ${getScoreColor(watchedScore)}`}>
                    {watchedScore}/100
                  </span>
                </div>
                {errors.overallScore && (
                  <p className="mt-1 text-xs text-red-400">{errors.overallScore.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="strengths" className="block text-xs font-medium text-gray-300 mb-2">
                  Strengths *
                </label>
                <textarea
                  id="strengths"
                  rows={3}
                  className="w-full text-xs bg-gray-750 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Describe the candidate's strengths, technical skills, positive attributes..."
                  {...register('strengths', {
                    required: 'Strengths are required',
                    minLength: {
                      value: 10,
                      message: 'Strengths must be at least 10 characters long'
                    },
                    maxLength: {
                      value: 1000,
                      message: 'Strengths must not exceed 1000 characters'
                    }
                  })}
                />
                {errors.strengths && (
                  <p className="mt-1 text-xs text-red-400">{errors.strengths.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="areasForImprovement" className="block text-xs font-medium text-gray-300 mb-2">
                  Areas for Improvement *
                </label>
                <textarea
                  id="areasForImprovement"
                  rows={3}
                  className="w-full text-xs bg-gray-750 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Describe areas where the candidate can improve, gaps in knowledge, development opportunities..."
                  {...register('areasForImprovement', {
                    required: 'Areas for improvement are required',
                    minLength: {
                      value: 10,
                      message: 'Areas for improvement must be at least 10 characters long'
                    },
                    maxLength: {
                      value: 1000,
                      message: 'Areas for improvement must not exceed 1000 characters'
                    }
                  })}
                />
                {errors.areasForImprovement && (
                  <p className="mt-1 text-xs text-red-400">{errors.areasForImprovement.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="comments" className="block text-xs font-medium text-gray-300 mb-2">
                  Additional Comments
                </label>
                <textarea
                  id="comments"
                  rows={2}
                  className="w-full text-xs bg-gray-750 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Any additional comments, observations, or recommendations..."
                  {...register('comments', {
                    maxLength: {
                      value: 500,
                      message: 'Comments must not exceed 500 characters'
                    }
                  })}
                />
                {errors.comments && (
                  <p className="mt-1 text-xs text-red-400">{errors.comments.message}</p>
                )}
              </div>

              {submitError && (
                <div className="rounded-md bg-red-400/10 border border-red-400/20 p-3">
                  <div className="text-xs text-red-400">{submitError}</div>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => router.push(`/candidates/${candidateId}`)}
                  className="px-3 py-1.5 border border-gray-600 text-xs font-medium rounded text-gray-300 bg-gray-750 hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className="px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow hover:shadow-md"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}