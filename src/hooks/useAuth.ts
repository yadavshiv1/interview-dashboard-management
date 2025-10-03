'use client'
//@ts-ignore
import { useAuthContext } from '../context/AuthContext'
export const useAuth = () => {
const { auth, login, logout } = useAuthContext()
return { auth, login, logout }
}