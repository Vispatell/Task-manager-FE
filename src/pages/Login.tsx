import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Link,
  IconButton,
} from '@chakra-ui/react'
import { Field } from '../components/ui/field'
import { MdEmail } from 'react-icons/md'
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { loginSchema, type LoginFormData } from '../utils/validation'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data)
      // Only navigate if login was successful
      navigate('/')
    } catch (error) {
      // Error is handled in AuthContext with toast
      // Don't navigate, stay on login page
      // Don't reset form - let user see and fix the error
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loading = isSubmitting || isLoading

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" _dark={{ bg: 'gray.900' }}>
      <Container maxW="md" py={12}>
        <Box p={8} shadow="lg" borderRadius="xl" bg="white" _dark={{ bg: 'gray.800' }}>
          <Stack gap={6}>
            {/* Header */}
            <Box textAlign="center">
              <Heading
                size="xl"
                mb={2}
                className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              >
                Welcome Back
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                Sign in to your account
              </Text>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={5}>
                {/* Email Field */}
                <Field 
                  label="Email" 
                  invalid={isSubmitted && !!errors.email} 
                  errorText={isSubmitted ? errors.email?.message : undefined}
                >
                  <Box position="relative" w="full">
                    <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.500" zIndex={1}>
                      <MdEmail />
                    </Box>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...register('email')}
                      disabled={loading}
                      pl="10"
                      w="full"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'gray.500', boxShadow: '0 0 0 1px var(--chakra-colors-gray-500)' }}
                    />
                  </Box>
                </Field>

                {/* Password Field */}
                <Field 
                  label="Password" 
                  invalid={isSubmitted && !!errors.password} 
                  errorText={isSubmitted ? errors.password?.message : undefined}
                >
                  <Box position="relative" w="full">
                    <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.500" zIndex={1}>
                      <FiLock />
                    </Box>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password')}
                      disabled={loading}
                      pl="10"
                      pr="12"
                      w="full"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'gray.500', boxShadow: '0 0 0 1px var(--chakra-colors-gray-500)' }}
                    />
                    <Box position="absolute" right="2" top="50%" transform="translateY(-50%)" zIndex={1}>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        _hover={{ bg: 'transparent' }}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    </Box>
                  </Box>
                </Field>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  width="full"
                  loading={loading}
                  loadingText="Signing in..."
                  mt={2}
                >
                  Sign In
                </Button>
              </Stack>
            </form>

            {/* Register Link */}
            <Box textAlign="center">
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                Don't have an account?{' '}
                <Link
                  asChild
                  color="purple.500"
                  fontWeight="semibold"
                  _hover={{ textDecoration: 'underline' }}
                >
                  <RouterLink to="/register">Sign up</RouterLink>
                </Link>
              </Text>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Flex>
  )
}
