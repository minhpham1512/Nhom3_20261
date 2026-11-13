import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import type { User, LoginRequest, AuthResponse } from '@shared'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (payload: LoginRequest) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const res = await api.get<User>('/me')
      setUser(res.data)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (payload: LoginRequest): Promise<User> => {
    const res = await api.post<AuthResponse>('/auth/login', payload)
    const loggedUser = res.data.user
    setUser(loggedUser)
    return loggedUser
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Bỏ qua lỗi khi logout (ví dụ session đã hết trước đó)
    } finally {
      setUser(null)
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
