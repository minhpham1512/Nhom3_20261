import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { Building2, ShieldCheck, Sparkles } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

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
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow & grid effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

      {/* Decorative subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70 blur-md transition duration-500 group-hover:opacity-100" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/30 ring-1 ring-white/20">
              <Building2 className="h-9 w-9" />
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Cổng Quản Trị Nội Bộ</span>
          </div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Chung Cư BlueMoon
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Hệ thống Quản lý Thu phí &amp; Cư dân
          </p>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="relative z-10 mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <Outlet />
        </div>

        {/* Footer info & hotline */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Phân quyền 4 cấp: Admin • Kế toán • Cán bộ cư dân • Trưởng BQT</span>
          </div>
          <p className="mt-2 text-slate-600">
            © {CURRENT_YEAR} Ban Quản Trị BlueMoon. Bảo mật theo chuẩn nội bộ.
          </p>
        </div>
      </div>
    </div>
  )
}
