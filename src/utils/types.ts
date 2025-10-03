export type Role = 'admin' | 'ta_member' | 'panelist'

export interface UserAPI {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: { name: string }
}
