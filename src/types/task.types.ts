export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  dueDate: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  status?: TaskStatus
  dueDate?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string | null
  status?: TaskStatus
  dueDate?: string | null
}

export interface TaskQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: TaskStatus
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'dueDate'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface GetTasksResponse {
  tasks: Task[]
  pagination: PaginationMeta
}
