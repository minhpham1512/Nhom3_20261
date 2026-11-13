import type { ComponentType, ReactNode } from 'react'
import {
  LayoutDashboard,
  Users,
  Receipt,
  HeartHandshake,
  CreditCard,
  AlertCircle,
  BarChart3,
  ShieldCheck,
} from 'lucide-react'
import type { UserRole } from '@shared'
import { ComingSoonPage } from '../components/ComingSoonPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'

export interface AppRoute {
  path: string
  /** Tên hiển thị trên menu */
  title: string
  icon: ComponentType<{ className?: string }>
  /** Bỏ trống = mọi vai trò đã đăng nhập đều vào được */
  roles?: UserRole[]
  element: ReactNode
}

/**
 * Nguồn duy nhất cho các trang trong MainLayout: App dùng để tạo route (có chặn theo vai trò),
 * MainLayout dùng để vẽ menu. Thêm trang mới chỉ cần thêm vào đây.
 */
export const appRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    title: 'Tổng quan',
    icon: LayoutDashboard,
    element: <DashboardPage />,
  },
  // Phân hệ Cư dân (Phase 3)
  {
    path: '/households',
    title: 'Hộ & Cư dân',
    icon: Users,
    roles: ['ADMIN', 'CAN_BO_CU_DAN', 'TRUONG_BQT'],
    element: <ComingSoonPage title="Phân hệ Quản lý Cư dân & Căn hộ (Phase 3)" />,
  },
  // Phân hệ Khoản thu & Đợt đóng góp (Phase 4)
  {
    path: '/fees',
    title: 'Khoản thu',
    icon: Receipt,
    roles: ['ADMIN', 'KE_TOAN'],
    element: <ComingSoonPage title="Phân hệ Quản lý Khoản thu & Đơn giá (Phase 4)" />,
  },
  {
    path: '/campaigns',
    title: 'Đợt đóng góp',
    icon: HeartHandshake,
    roles: ['ADMIN', 'KE_TOAN'],
    element: <ComingSoonPage title="Phân hệ Quản lý Đợt đóng góp (Phase 4)" />,
  },
  // Phân hệ Thu phí & Công nợ (Phase 5)
  {
    path: '/billing',
    title: 'Thu phí & Phiếu thu',
    icon: CreditCard,
    roles: ['ADMIN', 'KE_TOAN'],
    element: <ComingSoonPage title="Phân hệ Thu phí & Phiếu thu (Phase 5)" />,
  },
  {
    path: '/debts',
    title: 'Công nợ',
    icon: AlertCircle,
    roles: ['ADMIN', 'KE_TOAN'],
    element: <ComingSoonPage title="Phân hệ Theo dõi Công nợ (Phase 5)" />,
  },
  // Báo cáo & Thống kê (Phase 6)
  {
    path: '/reports',
    title: 'Báo cáo & Thống kê',
    icon: BarChart3,
    element: <ComingSoonPage title="Phân hệ Báo cáo & Thống kê (Phase 6)" />,
  },
  // Quản trị tài khoản (Phase 2)
  {
    path: '/users',
    title: 'Quản trị tài khoản',
    icon: ShieldCheck,
    roles: ['ADMIN'],
    element: <ComingSoonPage title="Phân hệ Quản trị Tài khoản BQT (Phase 2)" />,
  },
]

/** Vai trò có được vào trang này không (dùng cho cả menu và route). */
export const canAccess = (route: AppRoute, role: UserRole | undefined): boolean =>
  !route.roles || (!!role && route.roles.includes(role))
