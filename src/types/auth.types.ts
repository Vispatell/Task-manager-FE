export interface User {
  id: string
  username: string
  email: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  loading: boolean
}

export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACCESS_TOKEN'; payload: string }
  | { type: 'SET_USER'; payload: User }
