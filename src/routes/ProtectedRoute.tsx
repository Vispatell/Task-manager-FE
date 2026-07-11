import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Box, Spinner, Center } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Protected Route Component
 * Only allows authenticated users to access the route
 * Redirects to /login if user is not authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <Center minH="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="purple.500" borderWidth="4px" />
        </Box>
      </Center>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
