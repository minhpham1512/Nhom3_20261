import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import {
  Building2,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react'
import type { UserRole } from '@shared'
import { appRoutes, canAccess, type AppRoute } from '../app/routes'
import { cn } from '../lib/cn'

const roleLabels: Record<UserRole, { label: string; bg: string; text: string; border: string }> = {
  ADMIN: {
    label: 'Quản trị viên',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  KE_TOAN: {
    label: 'Kế toán BQT',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  CAN_BO_CU_DAN: {
    label: 'Cán bộ cư dân',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  TRUONG_BQT: {
    label: 'Trưởng BQT',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
}

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const visibleNavItems = appRoutes.filter((route) => canAccess(route, user?.role))

  // Find active route for header title/breadcrumbs
  const currentRoute =
    visibleNavItems.find((r) => r.path === location.pathname) ||
    appRoutes.find((r) => r.path === location.pathname)

  // Categories list in preferred order
  const categories: Array<AppRoute['category']> = [
    'TỔNG QUAN',
    'QUẢN LÝ CƯ DÂN',
    'TÀI CHÍNH & THU PHÍ',
    'BÁO CÁO & HỆ THỐNG',
  ]

  // Group items by category
  const groupedRoutes = categories.map((cat) => ({
    category: cat,
    items: visibleNavItems.filter((item) => (item.category || 'TỔNG QUAN') === cat),
  })).filter((group) => group.items.length > 0)

  // User initials
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .filter(Boolean)
        .slice(-2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'BM'

  const roleConfig = user?.role ? roleLabels[user.role] : roleLabels.ADMIN

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between border-b border-slate-800/80 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold tracking-tight text-white">BlueMoon</h1>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              </div>
              <p className="text-xs text-slate-400">QL Thu Phí &amp; Cư Dân</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation grouped */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5 dark-scroll">
          {groupedRoutes.map((group) => (
            <div key={group.category} className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {group.category}
              </p>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3 truncate">
                            <Icon
                              className={cn(
                                'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-white',
                              )}
                            />
                            <span className="truncate">{item.title}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={cn(
                                'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
                                isActive
                                  ? 'bg-blue-700/80 text-blue-100'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700',
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card at bottom */}
        {user && (
          <div className="border-t border-slate-800/80 p-4 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-sm font-bold text-blue-400 ring-1 ring-white/10">
                {initials}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className={cn(
                      'inline-block rounded-md border px-1.5 py-0.5 text-[10px] font-semibold',
                      roleConfig.bg,
                      roleConfig.text,
                      roleConfig.border,
                    )}
                  >
                    {roleConfig.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
          {/* Left: Mobile hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              aria-label="Mở danh mục điều hướng"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb info */}
            <div className="flex items-center gap-2 text-sm">
              <div className="hidden items-center gap-1.5 text-slate-600 sm:flex">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-slate-800">BlueMoon</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
              <h2 className="font-bold text-slate-900 sm:text-base">
                {currentRoute?.title || 'Bảng Điều Khiển'}
              </h2>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Building status chip */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tháp A &amp; B • 350 Căn hộ</span>
            </div>

            {/* Notification button */}
            <button
              className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
              title="Thông báo hệ thống"
              aria-label="Thông báo"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {/* Logout button */}
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              title="Đăng xuất khỏi phiên làm việc"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
