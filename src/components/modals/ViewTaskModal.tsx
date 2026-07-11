import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../ui/dialog'
import type { Task, TaskStatus as TaskStatusType } from '../../types/task.types'
import { format } from 'date-fns'

interface ViewTaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

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
  if (!dateString) return 'Not set'
  try {
    return format(new Date(dateString), 'MMM dd, yyyy')
  } catch {
    return 'Invalid date'
  }
}

const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy hh:mm a')
  } catch {
    return 'Invalid date'
  }
}

export default function ViewTaskModal({ task, isOpen, onClose }: ViewTaskModalProps) {
  if (!task) return null

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody>
          <VStack align="stretch" gap={5}>
            {/* Title */}
            <Box>
              <Text fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
                Title
              </Text>
              <Heading size="md">{task.title}</Heading>
            </Box>

            {/* Description */}
            <Box>
              <Text fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
                Description
              </Text>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} whiteSpace="pre-wrap">
                {task.description || 'No description provided'}
              </Text>
            </Box>

            {/* Status */}
            <Box>
              <Text fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
                Status
              </Text>
              <Badge {...getStatusBadgeProps(task.status)} fontSize="sm" px={3} py={1} borderRadius="md">
                {formatStatus(task.status)}
              </Badge>
            </Box>

            {/* Due Date */}
            <Box>
              <Text fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
                Due Date
              </Text>
              <Text color="gray.700" _dark={{ color: 'gray.300' }}>
                {formatDate(task.dueDate)}
              </Text>
            </Box>

            {/* Timestamps */}
            <Flex gap={6} flexWrap="wrap">
              <Box flex="1" minW="200px">
                <Text fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
                  Created
                </Text>
                <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.300' }}>
                  {formatDateTime(task.createdAt)}
                </Text>
              </Box>
              <Box flex="1" minW="200px">
                <Text fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
                  Last Updated
                </Text>
                <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.300' }}>
                  {formatDateTime(task.updatedAt)}
                </Text>
              </Box>
            </Flex>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Close</Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
