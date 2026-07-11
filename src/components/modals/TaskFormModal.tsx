import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  Stack,
  Textarea,
  Text,
  Box,
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
import {
  NativeSelectField,
  NativeSelectRoot,
} from '../ui/native-select'
import { Field } from '../ui/field'
import { taskSchema, type TaskFormData } from '../../utils/task-validation'
import { TaskStatus } from '../../types/task.types'
import type { Task } from '../../types/task.types'

interface TaskFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => Promise<void>
  task?: Task | null
  isLoading: boolean
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  task,
  isLoading,
}: TaskFormModalProps) {
  const isEditMode = !!task

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: 'onChange', // Validate on change to show errors immediately
    defaultValues: {
      title: '',
      description: '',
      status: TaskStatus.TODO,
      dueDate: '',
    },
  })

  const titleValue = watch('title')

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Edit mode - pre-fill with task data
        reset({
          title: task.title,
          description: task.description || '',
          status: task.status,
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        })
      } else {
        // Add mode - reset to defaults with required fields set
        reset({
          title: '',
          description: '',
          status: TaskStatus.TODO,
          dueDate: '',
        })
      }
    }
  }, [isOpen, task, reset])

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data)
      reset() // Reset form after successful submission
    } catch (error) {
      // Error handling is done in parent component
      console.error('Form submission error:', error)
    }
  }

  const loading = isSubmitting || isLoading

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open && !loading) {
          onClose()
        }
      }}
      size="lg"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          {!loading && <DialogCloseTrigger />}
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogBody>
            <Stack gap={4}>
              {/* Title Field */}
              <Field
                label="Title"
                required
                invalid={!!errors.title}
                errorText={errors.title?.message}
              >
                <Box w="full">
                  <Input
                    {...register('title')}
                    placeholder="Enter task title"
                    disabled={loading}
                    maxLength={100}
                    w="full"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{
                      borderColor: 'purple.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                    }}
                  />
                  <Text 
                    fontSize="xs" 
                    color={titleValue?.length > 100 ? 'red.500' : 'gray.500'} 
                    mt={1}
                    textAlign="right"
                  >
                    {titleValue?.length || 0}/100 characters
                  </Text>
                </Box>
              </Field>

              {/* Description Field */}
              <Field
                label="Description"
                invalid={!!errors.description}
                errorText={errors.description?.message}
              >
                <Textarea
                  {...register('description')}
                  placeholder="Enter task description (optional)"
                  disabled={loading}
                  rows={4}
                  borderColor="gray.300"
                  _hover={{ borderColor: 'gray.400' }}
                  _focus={{
                    borderColor: 'purple.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                  }}
                />
              </Field>

              {/* Status Field */}
              <Field
                label="Status"
                required
                invalid={!!errors.status}
                errorText={errors.status?.message}
              >
                <NativeSelectRoot disabled={loading}>
                  <NativeSelectField
                    {...register('status')}
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{
                      borderColor: 'purple.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                    }}
                  >
                    <option value={TaskStatus.TODO}>To Do</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Field>

              {/* Due Date Field */}
              <Field
                label="Due Date"
                required
                invalid={!!errors.dueDate}
                errorText={errors.dueDate?.message}
              >
                <Input
                  {...register('dueDate')}
                  type="date"
                  disabled={loading}
                  borderColor="gray.300"
                  _hover={{ borderColor: 'gray.400' }}
                  _focus={{
                    borderColor: 'purple.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                  }}
                />
              </Field>
            </Stack>
          </DialogBody>

          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              type="submit"
              colorScheme="purple"
              loading={loading}
              loadingText={isEditMode ? 'Updating...' : 'Creating...'}
            >
              {isEditMode ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}
