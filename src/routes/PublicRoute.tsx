import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Box, Spinner, Center } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * Public Route Component
 * Only allows unauthenticated users to access the route
 * Redirects authenticated users to / (dashboard)
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuth()
  const isInitialMount = useRef(true)

  useEffect(() => {
    // After first render, mark as not initial mount
    isInitialMount.current = false
  }, [])

  // Only show loading spinner on initial app load (session restoration)
  // Don't show it during form submission (would unmount the form)
  if (loading && isInitialMount.current) {
    return (
      <Center minH="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="purple.500" borderWidth="4px" />
        </Box>
      </Center>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
