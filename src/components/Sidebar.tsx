'use client'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
  const { auth } = useAuth()
  const role = auth.role

  return (
    <aside className="w-64 bg-white p-4 h-screen sticky top-0">
      <div className="mb-4 font-semibold">Menu</div>
      <ul className="space-y-2 text-sm">
        <li><Link href="/dashboard" className="block">Dashboard</Link></li>
        <li><Link href="/candidates" className="block">Candidates</Link></li>
        {role === 'admin' && <li><Link href="/admin" className="block">Role Management</Link></li>}
      </ul>
    </aside>
  )
}
