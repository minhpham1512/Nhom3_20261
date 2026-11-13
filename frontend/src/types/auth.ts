export type UserRole = 'ADMIN' | 'KE_TOAN' | 'CAN_BO_CU_DAN' | 'TRUONG_BQT'

export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface User {
  id: number
  fullName: string
  username: string
  role: UserRole
  status: UserStatus
  phone?: string | null
  email?: string | null
  mustChangePassword?: boolean
  lockedUntil?: string | null
  createdAt: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  idleTimeoutSeconds: number
  user: User
}

export interface ApiErrorResponse {
  code?: string
  message?: string
  errors?: Record<string, string[]>
}
