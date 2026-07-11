import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import type { ReactNode } from "react";
import type { AuthState, AuthAction, User, LoginCredentials, RegisterData } from '../types/auth.types'
import { authService } from '../services/auth.service'
import { toaster } from "../components/ui/toaster";
import { setupAxiosInterceptors, setAxiosAccessToken } from '../utils/axios-interceptor'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  setAccessToken: (token: string) => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Initial state - Start with loading true to check for existing session
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true, // Start as true to check refresh token on mount
}

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        loading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.payload,
        isAuthenticated: true,
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const isInitialized = useRef(false)

  // Initialize auth state from refresh token cookie on mount
  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (isInitialized.current) return
    isInitialized.current = true

    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        // Try to refresh token first
        const refreshResponse = await authService.refreshToken()
        
        // Set the access token in axios headers BEFORE calling profile
        setAxiosAccessToken(refreshResponse.accessToken)
        
        // Now fetch user profile with the access token
        const profileResponse = await authService.getProfile()
        
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: profileResponse.user, 
            accessToken: refreshResponse.accessToken 
          } 
        })
      } catch (error) {
        // No valid refresh token - user is not authenticated
        // This is normal for first visit or after cookie expires
        dispatch({ type: 'LOGOUT' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Setup axios interceptors - for token refresh on 401 errors during API calls
  useEffect(() => {
    const handleTokenRefresh = async () => {
      try {
        const response = await authService.refreshToken()
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: response.user, 
            accessToken: response.accessToken 
          } 
        })
        return response.accessToken
      } catch (error) {
        throw error
      }
    }

    const handleLogout = () => {
      dispatch({ type: 'LOGOUT' })
      setAxiosAccessToken(null)
      
      toaster.create({
        title: "Session Expired",
        description: "Please log in again.",
        type: "warning",
      })
    }

    setupAxiosInterceptors(handleTokenRefresh, handleLogout)
  }, [])

  // Update axios access token when state changes
  useEffect(() => {
    setAxiosAccessToken(state.accessToken)
  }, [state.accessToken])

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { user, accessToken } = await authService.login(credentials)
      
      // Store in memory only
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken },
      })

      toaster.create({
        title: "Login Successful",
        description: `Welcome back, ${user.username}!`,
        type: "success",
      });
    } catch (error: any) {
      console.log('Login error details:', error.response?.data)
      
      // Extract error message with priority: validation errors > custom message > generic
      let errorMessage = 'Login failed. Please try again.'
      
      if (error.response?.data) {
        const data = error.response.data
        
        // Priority 1: Check for validation errors (errors object)
        if (data.errors && typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
          const firstErrorKey = Object.keys(data.errors)[0]
          const firstError = data.errors[firstErrorKey]
          errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError)
        }
        // Priority 2: Check for custom message (skip generic "Validation failed")
        else if (data.message && data.message !== 'Validation failed') {
          errorMessage = data.message
        }
      }
      
      toaster.create({
        title: "Login Failed",
        description: errorMessage,
        type: "error",
      })
      
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const { user, accessToken } = await authService.register(data)
      
      // Store in memory only
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken },
      })

      toaster.create({
        title: "Registration Successful",
        description: `Welcome, ${user.username}!`,
        type: "success",
      })
    } catch (error: any) {
      console.log('Register error details:', error.response?.data)
      
      // Extract error message with priority: validation errors > custom message > generic
      let errorMessage = 'Registration failed. Please try again.'
      
      if (error.response?.data) {
        const data = error.response.data
        
        // Priority 1: Check for validation errors (errors object)
        if (data.errors && typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
          const firstErrorKey = Object.keys(data.errors)[0]
          const firstError = data.errors[firstErrorKey]
          errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError)
        }
        // Priority 2: Check for custom message (skip generic "Validation failed")
        else if (data.message && data.message !== 'Validation failed') {
          errorMessage = data.message
        }
      }
      
      toaster.create({
        title: "Registration Failed",
        description: errorMessage,
        type: "error",
      })
      
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Ignore logout errors from backend
      console.error('Logout error:', error)
    } finally {
      // Always clear local state
      dispatch({ type: 'LOGOUT' })
      setAxiosAccessToken(null)
      
      toaster.create({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        type: "info",
      })
    }
  }

  const setAccessToken = (token: string) => {
    dispatch({ type: 'SET_ACCESS_TOKEN', payload: token })
  }

  const setUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    setAccessToken,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
