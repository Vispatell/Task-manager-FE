import { z } from 'zod'
import { TaskStatus } from '../types/task.types'

export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED], {
    required_error: 'Status is required',
  }),
  dueDate: z.string().min(1, 'Due date is required'),
})

export type TaskFormData = z.infer<typeof taskSchema>
