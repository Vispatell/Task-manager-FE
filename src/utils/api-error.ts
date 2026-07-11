import type { AxiosError } from 'axios'

interface ApiErrorData {
  message?: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ApiErrorData>
  const data = axiosError.response?.data

  if (data?.errors && typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
    const firstErrorKey = Object.keys(data.errors)[0]
    const firstError = data.errors[firstErrorKey]
    return Array.isArray(firstError) ? firstError[0] : String(firstError)
  }

  if (data?.message && data.message !== 'Validation failed') {
    return data.message
  }

  return fallback
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  const axiosError = error as AxiosError<ApiErrorData>
  const errors = axiosError.response?.data?.errors

  if (!errors || typeof errors !== 'object') {
    return {}
  }

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ]),
  )
}
