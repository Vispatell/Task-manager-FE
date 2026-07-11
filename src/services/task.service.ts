import axiosInstance from '../utils/axios'
import type {
  CreateTaskRequest,
  GetTasksResponse,
  Task,
  TaskQueryParams,
  UpdateTaskRequest,
} from '../types/task.types'

class TaskService {
  async getTasks(params?: TaskQueryParams): Promise<GetTasksResponse> {
    const response = await axiosInstance.get('/tasks', { params })
    return response.data.data
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await axiosInstance.get(`/tasks/${id}`)
    return response.data.data.task
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await axiosInstance.post('/tasks', data)
    return response.data.data.task
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await axiosInstance.put(`/tasks/${id}`, data)
    return response.data.data.task
  }

  async deleteTask(id: string): Promise<void> {
    await axiosInstance.delete(`/tasks/${id}`)
  }
}

export const taskService = new TaskService()
