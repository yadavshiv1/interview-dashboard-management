'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { dashboardAPI, KPIs } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Box, Typography } from '@mui/material'
import { PieChart, Direction } from '@mui/x-charts'

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await dashboardAPI.getKPIs()
        setKpis(data)
      } catch (error) {
        console.error('Failed to fetch KPIs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchKPIs()
  }, [])

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['admin', 'ta_member', 'panelist']}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          Loading...
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'ta_member', 'panelist']}>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto mt-16">
          {kpis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 text-white p-6 rounded-lg shadow">
                <p className="text-gray-400">Interviews This Week</p>
                <p className="text-3xl font-semibold">{kpis.interviewsThisWeek}</p>
              </div>

              <div className="bg-gray-800 text-white p-6 rounded-lg shadow">
                <p className="text-gray-400">Average Feedback Score</p>
                <p className="text-3xl font-semibold">{kpis.averageFeedbackScore}%</p>
              </div>

              <div className="bg-gray-800 text-white p-6 rounded-lg shadow">
                <p className="text-gray-400">No-Shows</p>
                <p className="text-3xl font-semibold text-red-500">{kpis.noShows}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {kpis && (
              <div className="bg-gray-800 text-white p-6 rounded-lg shadow">
                <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                  Interview Distribution
                </Typography>
                <div className="flex justify-center">
                  <PieChart
                      series={[
                        {
                          data: [
                            { id: 0, value: kpis.interviewsThisWeek - kpis.noShows, label: 'Completed' },
                            { id: 1, value: kpis.noShows, label: 'No-Shows' },
                          ],
                          innerRadius: 30,
                        },
                      ]}
                      height={250}
                      width={300}
                      colors={['#3b82f6', '#ef4444']}
                      slotProps={{
                        legend: {
                        //@ts-ignore
                          direction: "row",
                          position: { vertical: 'bottom', horizontal: 'center' },
                          padding: { top: 20 },
                          labelStyle: {
                            fill: '#fff',
                            color: '#fff',
                          },
                        },
                      }}
                      sx={{
                        '.MuiChartsLegend-root, .MuiChartsArcLabel-root': {
                          color: '#fff',
                          fill: '#fff',
                        },
                      }}
                    />
                </div>
              </div>
            )}

            <div className="bg-gray-800 text-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">New interview scheduled</p>
                  <p className="text-gray-400 text-sm">John Doe - Frontend Developer</p>
                  <p className="text-gray-400 text-sm">Today, 10:30 AM</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">Feedback submitted</p>
                  <p className="text-gray-400 text-sm">Jane Smith - Backend Developer</p>
                  <p className="text-gray-400 text-sm">Yesterday, 3:15 PM</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium">No-show reported</p>
                  <p className="text-gray-400 text-sm">Mike Johnson - DevOps Engineer</p>
                  <p className="text-gray-400 text-sm">Oct 1, 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}