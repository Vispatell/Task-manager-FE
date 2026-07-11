export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return 'Not set'
  }

  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function toDatetimeLocalValue(value: string | null | undefined): string {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

export function fromDatetimeLocalValue(value: string): string | undefined {
  if (!value) {
    return undefined
  }

  return new Date(value).toISOString()
}
