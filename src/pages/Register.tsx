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
import { FaUser } from 'react-icons/fa'
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { registerSchema, type RegisterFormData } from '../utils/validation'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      // Only navigate if registration was successful
      navigate('/')
    } catch (error) {
      // Error is handled in AuthContext with toast
      // Don't navigate, stay on register page
      // Don't reset form - let user see and fix the error
      console.error('Registration error:', error)
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
                Create Account
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                Sign up to get started
              </Text>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={5}>
                {/* Username Field */}
                <Field 
                  label="Username" 
                  invalid={isSubmitted && !!errors.username} 
                  errorText={isSubmitted ? errors.username?.message : undefined}
                >
                  <Box position="relative" w="full">
                    <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" color="gray.500" zIndex={1}>
                      <FaUser />
                    </Box>
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      {...register('username')}
                      disabled={loading}
                      pl="10"
                      w="full"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'gray.500', boxShadow: '0 0 0 1px var(--chakra-colors-gray-500)' }}
                    />
                  </Box>
                </Field>

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
                      placeholder="Create a password"
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
                  loadingText="Creating account..."
                  mt={2}
                >
                  Create Account
                </Button>
              </Stack>
            </form>

            {/* Login Link */}
            <Box textAlign="center">
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                Already have an account?{' '}
                <Link
                  asChild
                  color="purple.500"
                  fontWeight="semibold"
                  _hover={{ textDecoration: 'underline' }}
                >
                  <RouterLink to="/login">Sign in</RouterLink>
                </Link>
              </Text>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Flex>
  )
}
