import axiosInstance from './axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

let accessToken: string | null = null

/**
 * Set the access token for requests
 */
export const setAxiosAccessToken = (token: string | null) => {
  accessToken = token
}

/**
 * Get the current access token
 */
export const getAxiosAccessToken = () => accessToken

/**
 * Setup axios interceptors
 */
export const setupAxiosInterceptors = (
  onTokenRefresh: () => Promise<string>,
  onLogout: () => void
) => {
  // Request interceptor - Attach access token to all requests
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (accessToken && !config.url?.includes('/auth/refresh-token')) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - Handle 401 errors and refresh token
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // List of endpoints that should NOT trigger token refresh
      const excludedEndpoints = [
        '/auth/login',
        '/auth/register',
        '/auth/refresh-token',
        '/auth/logout'
      ]

      // Check if the request URL is one of the excluded endpoints
      const isExcludedEndpoint = excludedEndpoints.some(endpoint => 
        originalRequest.url?.includes(endpoint)
      )

      // If error is 401, we haven't retried yet, and it's not an excluded endpoint
      if (
        error.response?.status === 401 && 
        !originalRequest._retry &&
        !isExcludedEndpoint
      ) {
        originalRequest._retry = true

        try {
          // Attempt to refresh the token
          const newAccessToken = await onTokenRefresh()
          setAxiosAccessToken(newAccessToken)

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          onLogout()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )
}
