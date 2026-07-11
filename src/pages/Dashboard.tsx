import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Badge,
  Spinner,
  Center,
  IconButton,
  Flex,
  Input,
} from '@chakra-ui/react'
import {
  NativeSelectField,
  NativeSelectRoot,
} from '../components/ui/native-select'
import { FaPlus, FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { taskService } from '../services/task.service'
import { toaster } from '../components/ui/toaster'
import type { Task, TaskStatus as TaskStatusType } from '../types/task.types'
import { TaskStatus } from '../types/task.types'
import type { TaskFormData } from '../utils/task-validation'
import ViewTaskModal from '../components/modals/ViewTaskModal'
import TaskFormModal from '../components/modals/TaskFormModal'
import DeleteTaskModal from '../components/modals/DeleteTaskModal'
import { format } from 'date-fns'

const getStatusBadgeProps = (status: TaskStatusType) => {
  switch (status) {
    case 'TODO':
      return { bg: 'orange.500', color: 'white' }
    case 'IN_PROGRESS':
      return { bg: 'blue.500', color: 'white' }
    case 'COMPLETED':
      return { bg: 'green.500', color: 'white' }
    default:
      return { bg: 'gray.500', color: 'white' }
  }
}

const formatStatus = (status: TaskStatusType): string => {
  return status.replace('_', ' ')
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-'
  try {
    return format(new Date(dateString), 'MMM dd, yyyy')
  } catch {
    return 'Invalid date'
  }
}

// Truncate title intelligently at word boundary - responsive to screen size
const truncateTitle = (title: string, screenSize: 'mobile' | 'desktop' = 'desktop'): string => {
  const maxLength = screenSize === 'mobile' ? 20 : 45
  
  if (title.length <= maxLength) return title
  
  // Find the last space before maxLength
  const truncated = title.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  // Minimum chars to ensure we don't cut too early
  const minChars = screenSize === 'mobile' ? 15 : 30
  
  // If there's a space, cut at the space, otherwise cut at maxLength
  if (lastSpace > minChars) {
    return truncated.slice(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatusType | ''>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  })
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  
  // Selected task states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  
  // Loading states
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Prevent double fetch in React StrictMode
  const hasFetchedInitial = useRef(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  const fetchTasks = async (searchTerm?: string, page: number = 1, status?: TaskStatusType | '') => {
    try {
      setLoading(true)
      const response = await taskService.getTasks({ 
        search: searchTerm || undefined,
        limit: 5,
        page: page,
        status: status || undefined,
      })
      setTasks(response.tasks)
      setPagination(response.pagination)
      setCurrentPage(page)
    } catch (error: any) {
      console.error('Failed to fetch tasks:', error)
      toaster.create({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load tasks',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Prevent double call in React StrictMode
    if (hasFetchedInitial.current) return
    hasFetchedInitial.current = true
    
    fetchTasks()
    
    // Mark initial mount as complete after first render
    setTimeout(() => {
      isInitialMount.current = false
    }, 100)
  }, [])

  // Debounced search effect - skip initial mount
  useEffect(() => {
    // Skip on initial mount to prevent duplicate call
    if (isInitialMount.current) return

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1) // Reset to page 1 on new search
      fetchTasks(searchQuery, 1, statusFilter)
    }, 500) // 500ms debounce

    // Cleanup timeout on unmount or when searchQuery changes
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const handleSearch = () => {
    // Immediate search when button clicked
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    setCurrentPage(1) // Reset to page 1 on new search
    fetchTasks(searchQuery, 1, statusFilter)
  }

  // Status filter handler
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatusType | ''
    setStatusFilter(newStatus)
    setCurrentPage(1) // Reset to page 1 on filter change
    fetchTasks(searchQuery, 1, newStatus)
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchTasks(searchQuery, page, statusFilter)
  }

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      fetchTasks(searchQuery, currentPage - 1, statusFilter)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      fetchTasks(searchQuery, currentPage + 1, statusFilter)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  // View Task
  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setViewModalOpen(true)
  }

  // Add Task
  const handleAddTask = () => {
    setSelectedTask(null)
    setFormModalOpen(true)
  }

  // Edit Task
  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setFormModalOpen(true)
  }

  // Delete Task
  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return

    try {
      setDeleteLoading(true)
      await taskService.deleteTask(taskToDelete.id)
      
      toaster.create({
        title: 'Success',
        description: 'Task deleted successfully',
        type: 'success',
      })
      
      setDeleteModalOpen(false)
      setTaskToDelete(null)
      await fetchTasks(searchQuery, currentPage, statusFilter)
    } catch (error: any) {
      console.error('Failed to delete task:', error)
      toaster.create({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete task',
        type: 'error',
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  // Form Submit (Create/Update)
  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      setFormLoading(true)
      
      // Convert date string to ISO datetime if provided
      let dueDateISO: string | undefined = undefined
      if (data.dueDate) {
        // HTML date input returns YYYY-MM-DD, convert to ISO datetime
        const dateObj = new Date(data.dueDate + 'T00:00:00.000Z')
        dueDateISO = dateObj.toISOString()
      }
      
      const payload = {
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        dueDate: dueDateISO,
      }

      if (selectedTask) {
        // Update existing task
        await taskService.updateTask(selectedTask.id, payload)
        toaster.create({
          title: 'Success',
          description: 'Task updated successfully',
          type: 'success',
        })
      } else {
        // Create new task
        await taskService.createTask(payload)
        toaster.create({
          title: 'Success',
          description: 'Task created successfully',
          type: 'success',
        })
      }
      
      setFormModalOpen(false)
      setSelectedTask(null)
      await fetchTasks(searchQuery, currentPage, statusFilter)
    } catch (error: any) {
      console.error('Failed to save task:', error)
      
      let errorMessage = 'Failed to save task'
      if (error.response?.data) {
        const data = error.response.data
        if (data.errors && typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
          const firstErrorKey = Object.keys(data.errors)[0]
          const firstError = data.errors[firstErrorKey]
          errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError)
        } else if (data.message && data.message !== 'Validation failed') {
          errorMessage = data.message
        }
      }
      
      toaster.create({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      })
      
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
      <Container maxW="1400px" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Box>
              <Heading size="xl" className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Task Manager
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }} mt={1}>
                Welcome back, {user?.username}!
              </Text>
            </Box>
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>

          {/* Search and Add Task Bar */}
          <Flex gap={3} flexWrap="wrap">
            <HStack flex="1" minW="250px">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                borderColor="gray.300"
                _hover={{ borderColor: 'gray.400' }}
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
              />
            </HStack>
            
            {/* Status Filter */}
            <NativeSelectRoot
              width={{ base: 'full', sm: '200px' }}
            >
              <NativeSelectField
                value={statusFilter}
                onChange={handleStatusFilterChange}
                borderColor="gray.300"
                _hover={{ borderColor: 'gray.400' }}
                _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
              >
                <option value="">All Status</option>
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </NativeSelectField>
            </NativeSelectRoot>

            <Button
              colorScheme="purple"
              onClick={handleAddTask}
            >
              <FaPlus />
              Add Task
            </Button>
          </Flex>

          {/* Tasks Table - Responsive */}
          <Box bg="white" _dark={{ bg: 'gray.800' }} borderRadius="lg" shadow="md" overflow="hidden">
            {loading ? (
              <Center py={12}>
                <Spinner size="xl" color="purple.500" borderWidth="4px" />
              </Center>
            ) : tasks.length === 0 ? (
              <Center py={12}>
                <VStack gap={3}>
                  <Text fontSize="lg" color="gray.500" _dark={{ color: 'gray.400' }}>
                    {searchQuery ? 'No tasks found' : 'No tasks yet'}
                  </Text>
                </VStack>
              </Center>
            ) : (
              <Box overflowX="auto">
                <Table.Root variant="line" size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader minW="150px">Title</Table.ColumnHeader>
                      <Table.ColumnHeader minW="100px">Status</Table.ColumnHeader>
                      <Table.ColumnHeader minW="100px">Due Date</Table.ColumnHeader>
                      <Table.ColumnHeader minW="100px">Created</Table.ColumnHeader>
                      <Table.ColumnHeader minW="120px" textAlign="center">Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {tasks.map((task) => (
                      <Table.Row key={task.id} _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}>
                        <Table.Cell minW="150px" maxW="300px">
                          <Box 
                            fontWeight="medium"
                            fontSize={{ base: 'xs', sm: 'sm' }}
                            wordBreak="break-word"
                            whiteSpace="normal"
                            title={task.title}
                            display="block"
                          >
                            <Box display={{ base: 'block', md: 'none' }}>
                              {truncateTitle(task.title, 'mobile')}
                            </Box>
                            <Box display={{ base: 'none', md: 'block' }}>
                              {truncateTitle(task.title, 'desktop')}
                            </Box>
                          </Box>
                        </Table.Cell>
                        <Table.Cell minW="100px">
                          <Badge {...getStatusBadgeProps(task.status)} fontSize="xs" px={2} py={1} borderRadius="md">
                            {formatStatus(task.status)}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell minW="100px">
                          <Text fontSize="xs">{formatDate(task.dueDate)}</Text>
                        </Table.Cell>
                        <Table.Cell minW="100px">
                          <Text fontSize="xs">{formatDate(task.createdAt)}</Text>
                        </Table.Cell>
                        <Table.Cell minW="120px">
                          <HStack justify="center" gap={1}>
                            <IconButton
                              aria-label="View task"
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleViewTask(task)}
                            >
                              <FaEye />
                            </IconButton>
                            <IconButton
                              aria-label="Edit task"
                              size="sm"
                              variant="ghost"
                              colorScheme="purple"
                              onClick={() => handleEditTask(task)}
                            >
                              <FaEdit />
                            </IconButton>
                            <IconButton
                              aria-label="Delete task"
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteClick(task)}
                            >
                              <FaTrash />
                            </IconButton>
                          </HStack>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            )}
          </Box>

          {/* Pagination */}
          {!loading && tasks.length > 0 && (
            <Box bg="white" _dark={{ bg: 'gray.800' }} borderRadius="lg" shadow="md" p={4}>
              <Flex 
                justify="space-between" 
                align="center" 
                flexWrap="wrap" 
                gap={4}
              >
                {/* Page Info */}
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                  Showing <Text as="span" fontWeight="semibold">{(currentPage - 1) * pagination.limit + 1}</Text> to{' '}
                  <Text as="span" fontWeight="semibold">
                    {Math.min(currentPage * pagination.limit, pagination.totalItems)}
                  </Text>{' '}
                  of <Text as="span" fontWeight="semibold">{pagination.totalItems}</Text> tasks
                </Text>

                {/* Pagination Controls */}
                <HStack gap={2}>
                  {/* Previous Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePreviousPage}
                    disabled={!pagination.hasPreviousPage}
                    _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                  >
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <HStack gap={1}>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)

                      // Show ellipsis
                      const showEllipsis =
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 && currentPage < pagination.totalPages - 2)

                      if (showEllipsis) {
                        return (
                          <Text key={page} px={2} color="gray.500">
                            ...
                          </Text>
                        )
                      }

                      if (!showPage) return null

                      return (
                        <Button
                          key={page}
                          size="sm"
                          variant={page === currentPage ? 'solid' : 'outline'}
                          colorScheme={page === currentPage ? 'purple' : 'gray'}
                          onClick={() => handlePageChange(page)}
                          minW="40px"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </HStack>

                  {/* Next Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={!pagination.hasNextPage}
                    _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            </Box>
          )}
        </VStack>
      </Container>

      {/* Modals */}
      <ViewTaskModal
        task={selectedTask}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedTask(null)
        }}
      />

      <TaskFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false)
          setSelectedTask(null)
        }}
        onSubmit={handleFormSubmit}
        task={selectedTask}
        isLoading={formLoading}
      />

      <DeleteTaskModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setTaskToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        taskTitle={taskToDelete?.title || ''}
        isLoading={deleteLoading}
      />
    </Box>
  )
}
