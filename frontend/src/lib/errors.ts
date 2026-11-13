import { isAxiosError, type AxiosError } from 'axios'
import type { ApiErrorBody, ApiValidationError } from '@shared'

/** Lỗi axios có body theo swagger (Error hoặc ValidationError). */
export type ApiAxiosError = AxiosError<ApiErrorBody>

/** Body lỗi từ server, hoặc undefined nếu lỗi mạng / không phải lỗi axios. */
export function getApiErrorBody(err: unknown): ApiErrorBody | undefined {
  return isAxiosError<ApiErrorBody>(err) ? err.response?.data : undefined
}

/** ValidationError có danh sách `fields` (lỗi theo từng trường). */
export function hasFieldErrors(
  body: ApiErrorBody | undefined,
): body is ApiValidationError & { fields: NonNullable<ApiValidationError['fields']> } {
  return !!body && 'fields' in body && Array.isArray(body.fields)
}

/** Đọc một khóa trong `details` (object tùy ý) khi giá trị là chuỗi. */
export function getDetailString(body: ApiErrorBody | undefined, key: string): string | undefined {
  if (!body || !('details' in body)) return undefined
  const details = body.details
  if (typeof details !== 'object' || details === null) return undefined
  const value = details[key]
  return typeof value === 'string' ? value : undefined
}
