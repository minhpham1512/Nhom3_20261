import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Building2,
  LayoutDashboard,
  Users,
  Receipt,
  HeartHandshake,
  CreditCard,
  AlertCircle,
  BarChart3,
  ShieldCheck,
  LogOut,
  User as UserIcon,
} from 'lucide-react'
import type { UserRole } from '../types/auth'

interface NavItem {
  title: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  roles?: UserRole[]
}

const navItems: NavItem[] = [
  { title: 'Tổng quan', to: '/dashboard', icon: LayoutDashboard },
  {
    title: 'Hộ & Cư dân',
    to: '/households',
    icon: Users,
    roles: ['ADMIN', 'CAN_BO_CU_DAN', 'TRUONG_BQT'],
  },
  {
    title: 'Khoản thu',
    to: '/fees',
    icon: Receipt,
    roles: ['ADMIN', 'KE_TOAN'],
  },
  {
    title: 'Đợt đóng góp',
    to: '/campaigns',
    icon: HeartHandshake,
    roles: ['ADMIN', 'KE_TOAN'],
  },
  {
    title: 'Thu phí & Phiếu thu',
    to: '/billing',
    icon: CreditCard,
    roles: ['ADMIN', 'KE_TOAN'],
  },
  {
    title: 'Công nợ',
    to: '/debts',
    icon: AlertCircle,
    roles: ['ADMIN', 'KE_TOAN'],
  },
  {
    title: 'Báo cáo & Thống kê',
    to: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Quản trị tài khoản',
    to: '/users',
    icon: ShieldCheck,
    roles: ['ADMIN'],
  },
]

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Quản trị viên',
  KE_TOAN: 'Kế toán',
  CAN_BO_CU_DAN: 'Cán bộ cư dân',
  TRUONG_BQT: 'Trưởng BQT',
}

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth()

  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    if (!user) return false
    return item.roles.includes(user.role)
  })

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-slate-900 text-white">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-white">BlueMoon</h1>
            <p className="text-xs text-slate-400">QL Chung Cư</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User Card */}
        {user && (
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-blue-400">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
                <span className="inline-block rounded bg-blue-950 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                  {roleLabels[user.role] || user.role}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="text-sm font-medium text-slate-500">
            Hệ thống Quản lý Thu phí & Cư dân Chung cư BlueMoon
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
