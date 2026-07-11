import axiosInstance from '../utils/axios'
import type { AuthResponse, LoginCredentials, RegisterData } from '../types/auth.types'

class AuthService {
  /**
   * Login user with email and password
   * @param credentials - Email and password
   * @returns User data and access token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', credentials)
    // API returns { success, message, data: { user, accessToken } }
    // Extract the nested data object
    return response.data.data
  }

  /**
   * Register new user
   * @param data - Registration data (username, email, password)
   * @returns User data and access token
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
    })
    // API returns { success, message, data: { user, accessToken } }
    // Extract the nested data object
    return response.data.data
  }

  /**
   * Refresh access token using the HttpOnly refresh token cookie
   * @returns New access token and user data
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/refresh-token')
    // API returns { success, message, data: { user, accessToken } }
    // Extract the nested data object
    return response.data.data
  }

  /**
   * Logout user and clear refresh token cookie
   */
  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout')
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse> {
    const response = await axiosInstance.get('/profile')
    return response.data.data
  }
}

export const authService = new AuthService()
