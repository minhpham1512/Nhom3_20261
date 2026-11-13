import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Building2 } from 'lucide-react'

export const AuthLayout: React.FC = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  // Nếu đã đăng nhập thì tự động vào Dashboard
  if (user && !user.mustChangePassword) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-900 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
          <Building2 className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Chung Cư BlueMoon
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Hệ thống Quản lý Thu phí & Cư dân
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/90 px-6 py-8 shadow-2xl ring-1 ring-white/10 sm:rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
