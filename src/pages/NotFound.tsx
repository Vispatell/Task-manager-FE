import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} display="flex" alignItems="center">
      <Container maxW="600px">
        <VStack gap={6} textAlign="center">
          {/* 404 Text */}
          <Heading
            fontSize={{ base: '8xl', md: '9xl' }}
            fontWeight="bold"
            bgGradient="to-r"
            gradientFrom="purple.500"
            gradientTo="pink.500"
            bgClip="text"
            lineHeight="1"
          >
            404
          </Heading>

          {/* Error Message */}
          <VStack gap={3}>
            <Heading size="xl" color="gray.700" _dark={{ color: 'gray.200' }}>
              Page Not Found
            </Heading>
            <Text fontSize="lg" color="gray.600" _dark={{ color: 'gray.400' }} maxW="400px">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </Text>
          </VStack>

          {/* Action Buttons */}
          <VStack gap={3} mt={4}>
            <Button
              size="lg"
              colorScheme="purple"
              onClick={() => navigate('/')}
              leftIcon={<FaHome />}
            >
              Go to Dashboard
            </Button>
            <Button
              size="md"
              variant="ghost"
              onClick={() => navigate(-1)}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
            >
              Go Back
            </Button>
          </VStack>

          {/* Illustration */}
          <Box mt={8} opacity={0.5}>
            <Text fontSize="6xl">🔍</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
