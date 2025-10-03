'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { useState } from 'react'
import { useNotification } from '@/hooks/useNotification'
import { mockUsers } from '@/utils/mockUsers'

export default function Admin() {
  const [users, setUsers] = useState(mockUsers)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [updatingUser, setUpdatingUser] = useState<number | null>(null)
  const [savingUser, setSavingUser] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<{[key: number]: string}>({})
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null)
  const { showSuccess, showError } = useNotification()
  const usersPerPage = 6

  useState(() => {
    const initialSelectedRoles: {[key: number]: string} = {}
    users.forEach(user => {
      initialSelectedRoles[user.id] = user.currentRole
    })
    setSelectedRoles(initialSelectedRoles)
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.currentRole === roleFilter
    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  const setSelectedRole = (userId: number, role: string) => {
    setSelectedRoles(prev => ({
      ...prev,
      [userId]: role
    }))
  }

  const handleRoleUpdate = async (userId: number) => {
    const newRole = selectedRoles[userId] || users.find(u => u.id === userId)?.currentRole
    if (!newRole) return

    const user = users.find(u => u.id === userId)
    if (!user) return

    setUpdatingUser(userId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, currentRole: newRole as 'admin' | 'ta_member' | 'panelist' } : user
      ))
      
      setSelectedRoles(prev => {
        const newSelectedRoles = { ...prev }
        delete newSelectedRoles[userId]
        return newSelectedRoles
      })
      
      showSuccess(`Role updated successfully! ${user.name} is now ${newRole}`)
    } catch (error) {
      showError('Failed to update user role. Please try again.')
    } finally {
      setUpdatingUser(null)
    }
  }

  const handleEditUser = (user: typeof mockUsers[0]) => {
    setEditingUser({ ...user })
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    setSavingUser(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ))
      
      showSuccess(`User details updated successfully!`)
      setEditingUser(null)
    } catch (error) {
      showError('Failed to update user details. Please try again.')
    } finally {
      setSavingUser(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Navbar />
      <div className="min-h-screen bg-gray-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage user roles and permissions
            </p>
          </div>

          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
            <div className="p-4">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                      <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
                      Role Management
                    </h3>
                    <p className="text-xs text-gray-400">
                      Manage user roles and permissions across the platform
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-48"
                    />
                    <select
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-32"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="ta_member">TA Member</option>
                      <option value="panelist">Panelist</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Showing {currentUsers.length} of {filteredUsers.length} users
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {currentUsers.map((user) => (
                  <div key={user.id} className="bg-gray-750 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{user.name}</h4>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors duration-200 flex-shrink-0"
                        title="Edit user details"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.currentRole === 'admin' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : user.currentRole === 'ta_member'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {user.currentRole}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <select 
                          value={selectedRoles[user.id] || user.currentRole}
                          onChange={(e) => setSelectedRole(user.id, e.target.value)}
                          disabled={updatingUser === user.id}
                          className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 min-w-24"
                        >
                          <option value="panelist">Panelist</option>
                          <option value="ta_member">TA Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleRoleUpdate(user.id)}
                      disabled={updatingUser === user.id || (!!selectedRoles[user.id] && selectedRoles[user.id] === user.currentRole)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {updatingUser === user.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        'Update Role'
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mb-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-xs border rounded transition-colors ${
                        currentPage === page
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                  <span className="w-1.5 h-4 bg-green-500 rounded-full mr-2"></span>
                  Permission Matrix
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-750">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-blue-400 uppercase tracking-wider border-r border-gray-700/50">
                          Feature
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-red-400 uppercase tracking-wider border-r border-gray-700/50">
                          Admin
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-purple-400 uppercase tracking-wider border-r border-gray-700/50">
                          TA Member
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-green-400 uppercase tracking-wider">
                          Panelist
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700/50">
                      {[
                        { feature: 'View Dashboard', admin: '✓', ta: '✓', panelist: '✓' },
                        { feature: 'View Candidates', admin: '✓', ta: '✓', panelist: '✓' },
                        { feature: 'Manage Schedule', admin: '✓', ta: '✓', panelist: '✗' },
                        { feature: 'Submit Feedback', admin: '✗', ta: '✗', panelist: '✓' },
                        { feature: 'Admin Panel Access', admin: '✓', ta: '✗', panelist: '✗' },
                        { feature: 'User Management', admin: '✓', ta: '✗', panelist: '✗' },
                        { feature: 'System Settings', admin: '✓', ta: '✗', panelist: '✗' },
                      ].map((row, index) => (
                        <tr key={index} className="hover:bg-gray-750 transition-colors duration-150">
                          <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-300">
                            {row.feature}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                              row.admin === '✓' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {row.admin}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                              row.ta === '✓' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {row.ta}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                              row.panelist === '✓' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {row.panelist}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                  <span className="w-1.5 h-4 bg-yellow-500 rounded-full mr-2"></span>
                  Quick Stats
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Users', value: users.length.toString(), color: 'blue' },
                    { label: 'Admins', value: users.filter(u => u.currentRole === 'admin').length.toString(), color: 'red' },
                    { label: 'TA Members', value: users.filter(u => u.currentRole === 'ta_member').length.toString(), color: 'purple' },
                    { label: 'Panelists', value: users.filter(u => u.currentRole === 'panelist').length.toString(), color: 'green' },
                  ].map((stat, index) => (
                    <div key={index} className="bg-gray-750 border border-gray-700 rounded-lg p-3 text-center">
                      <div className={`text-lg font-bold ${
                        stat.color === 'blue' ? 'text-blue-400' :
                        stat.color === 'red' ? 'text-red-400' :
                        stat.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg w-full max-w-md border border-gray-600/50">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Edit User Details</h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Role</label>
                <select 
                  value={editingUser.currentRole}
                  onChange={(e) => setEditingUser({...editingUser, currentRole: e.target.value as 'admin' | 'ta_member' | 'panelist'})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="panelist">Panelist</option>
                  <option value="ta_member">TA Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-4 border-t border-gray-700">
              <button 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUser}
                disabled={savingUser}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {savingUser ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}