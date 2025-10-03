export interface MockUser {
  id: number
  name: string
  currentRole: 'admin' | 'ta_member' | 'panelist'
  email: string
  avatar: string
}

export const mockUsers: MockUser[] = [
  { id: 1, name: 'Rajesh Kumar', currentRole: 'panelist', email: 'rajesh.kumar@example.com', avatar: 'RK' },
  { id: 2, name: 'Priya Sharma', currentRole: 'ta_member', email: 'priya.sharma@example.com', avatar: 'PS' },
  { id: 3, name: 'Amit Patel', currentRole: 'admin', email: 'amit.patel@example.com', avatar: 'AP' },
  { id: 4, name: 'Sneha Gupta', currentRole: 'panelist', email: 'sneha.gupta@example.com', avatar: 'SG' },
  { id: 5, name: 'Vikram Singh', currentRole: 'ta_member', email: 'vikram.singh@example.com', avatar: 'VS' },
  { id: 6, name: 'Anjali Reddy', currentRole: 'panelist', email: 'anjali.reddy@example.com', avatar: 'AR' },
  { id: 7, name: 'Rahul Mishra', currentRole: 'admin', email: 'rahul.mishra@example.com', avatar: 'RM' },
  { id: 8, name: 'Pooja Desai', currentRole: 'ta_member', email: 'pooja.desai@example.com', avatar: 'PD' },
  { id: 9, name: 'Sanjay Joshi', currentRole: 'panelist', email: 'sanjay.joshi@example.com', avatar: 'SJ' },
  { id: 10, name: 'Meera Iyer', currentRole: 'panelist', email: 'meera.iyer@example.com', avatar: 'MI' },
  { id: 11, name: 'Karthik Nair', currentRole: 'ta_member', email: 'karthik.nair@example.com', avatar: 'KN' },
  { id: 12, name: 'Deepika Choudhary', currentRole: 'admin', email: 'deepika.choudhary@example.com', avatar: 'DC' },
  { id: 13, name: 'Arun Malhotra', currentRole: 'panelist', email: 'arun.malhotra@example.com', avatar: 'AM' },
  { id: 14, name: 'Swati Banerjee', currentRole: 'ta_member', email: 'swati.banerjee@example.com', avatar: 'SB' },
  { id: 15, name: 'Rohit Kapoor', currentRole: 'panelist', email: 'rohit.kapoor@example.com', avatar: 'RK' },
]
