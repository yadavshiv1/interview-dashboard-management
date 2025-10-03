const BASE_URL = 'https://dummyjson.com'

export interface Candidate {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  domain: string
  company: {
    name: string
    department: string
  }
}

export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: number
}

export interface KPIs {
  interviewsThisWeek: number
  averageFeedbackScore: number
  noShows: number
}

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  },
}

export const candidateAPI = {
  getCandidates: async (skip: number = 0, limit: number = 10, search?: string): Promise<{ users: Candidate[]; total: number }> => {
    let url = `${BASE_URL}/users?skip=${skip}&limit=${limit}`
    if (search) {
      url = `${BASE_URL}/users/search?q=${encodeURIComponent(search)}`
    }
    const response = await fetch(url)
    const data = await response.json()
    return {
      users: data.users.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        domain: user.domain,
        company: {
          name: user.company?.name || 'Unknown Company',
          department: user.company?.department || 'Engineering',
        },
      })),
      total: data.total,
    }
  },

  getCandidate: async (id: number): Promise<Candidate> => {
    const response = await fetch(`${BASE_URL}/users/${id}`)
    const data = await response.json()
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      domain: data.domain,
      company: {
        name: data.company?.name || 'Unknown Company',
        department: data.company?.department || 'Engineering',
      },
    }
  },

  getTodos: async (userId: number): Promise<Todo[]> => {
    const response = await fetch(`${BASE_URL}/todos?userId=${userId}`)
    const data = await response.json()
    return data.todos
  },

  getPosts: async (userId: number): Promise<Post[]> => {
    const response = await fetch(`${BASE_URL}/posts?userId=${userId}`)
    const data = await response.json()
    return data.posts
  },
}

export const dashboardAPI = {
  getKPIs: async (): Promise<KPIs> => {
    return {
      interviewsThisWeek: Math.floor(Math.random() * 20) + 5,
      averageFeedbackScore: Math.floor(Math.random() * 30) + 70,
      noShows: Math.floor(Math.random() * 5),
    }
  },
}