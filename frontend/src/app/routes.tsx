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
  /** Nhóm danh mục trên thanh điều hướng */
  category?: 'TỔNG QUAN' | 'QUẢN LÝ CƯ DÂN' | 'TÀI CHÍNH & THU PHÍ' | 'BÁO CÁO & HỆ THỐNG'
  /** Tag / badge hiển thị cạnh tên menu */
  badge?: string
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
    category: 'TỔNG QUAN',
    element: <DashboardPage />,
  },
  // Phân hệ Quản lý Cư dân & Căn hộ
  {
    path: '/households',
    title: 'Hộ & Cư dân',
    icon: Users,
    category: 'QUẢN LÝ CƯ DÂN',
    badge: 'Đang phát triển',
    roles: ['ADMIN', 'CAN_BO_CU_DAN', 'TRUONG_BQT'],
    element: (
      <ComingSoonPage
        title="Phân hệ Quản lý Cư dân & Căn hộ"
        description="Quản lý danh sách hộ gia đình, nhân khẩu, biến động cư trú và tìm kiếm thông tin cư dân."
        features={[
          'US07: Thêm hộ gia đình mới và thông tin căn hộ',
          'US08: Chỉnh sửa thông tin hộ gia đình hoặc ghi nhận chuyển đi',
          'US09: Thêm nhân khẩu vào hộ gia đình',
          'US10: Chỉnh sửa hoặc xóa nhân khẩu khỏi hộ',
          'US11: Đăng ký biến động nhân khẩu (tạm trú, tạm vắng)',
          'US13: Nhập dữ liệu danh sách hộ và nhân khẩu từ tệp Excel',
          'US23: Tra cứu, tìm kiếm hộ gia đình và cư dân',
        ]}
      />
    ),
  },
  // Phân hệ Khoản thu bắt buộc
  {
    path: '/fees',
    title: 'Khoản thu',
    icon: Receipt,
    category: 'TÀI CHÍNH & THU PHÍ',
    badge: 'Đang phát triển',
    roles: ['ADMIN', 'KE_TOAN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Quản lý Khoản thu & Đơn giá"
        description="Cấu hình danh mục các khoản thu bắt buộc với đơn giá tính theo m² diện tích sàn."
        features={[
          'US14: Tạo khoản thu bắt buộc với đơn giá theo m² diện tích sàn',
          'US16: Chỉnh sửa hoặc ngừng áp dụng khoản thu bắt buộc',
        ]}
      />
    ),
  },
  // Phân hệ Đợt vận động đóng góp
  {
    path: '/campaigns',
    title: 'Đợt đóng góp',
    icon: HeartHandshake,
    category: 'TÀI CHÍNH & THU PHÍ',
    badge: 'Đang phát triển',
    roles: ['ADMIN', 'KE_TOAN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Đợt vận động đóng góp"
        description="Tổ chức các đợt vận động đóng góp tự nguyện và ghi nhận ủng hộ của cư dân."
        features={[
          'US15: Tạo và quản lý đợt quyên góp, vận động đóng góp tự nguyện',
          'US19: Ghi nhận đóng góp tự nguyện của cư dân theo đợt',
        ]}
      />
    ),
  },
  // Phân hệ Thu phí & Phiếu thu
  {
    path: '/billing',
    title: 'Thu phí & Phiếu thu',
    icon: CreditCard,
    category: 'TÀI CHÍNH & THU PHÍ',
    badge: 'Đang phát triển',
    roles: ['ADMIN', 'KE_TOAN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Thu phí & Phiếu thu"
        description="Lập danh sách các khoản phải nộp hàng tháng, ghi nhận thu phí, in và hủy phiếu thu."
        features={[
          'US17: Lập danh sách các khoản phải nộp theo tháng cho từng hộ',
          'US18: Ghi nhận thu phí và thanh toán tiền của hộ gia đình',
          'US20: In phiếu thu (biên lai) bàn giao cho người nộp',
          'US22: Hủy phiếu thu kèm lý do và lưu vết lịch sử',
        ]}
      />
    ),
  },
  // Phân hệ Theo dõi Công nợ
  {
    path: '/debts',
    title: 'Công nợ',
    icon: AlertCircle,
    category: 'TÀI CHÍNH & THU PHÍ',
    badge: 'Đang phát triển',
    roles: ['ADMIN', 'KE_TOAN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Theo dõi Công nợ"
        description="Giám sát danh sách các hộ gia đình còn nợ phí và tổng hợp số tiền chưa thanh toán."
        features={[
          'US21: Theo dõi danh sách các hộ gia đình còn nợ phí và quản lý công nợ',
        ]}
      />
    ),
  },
  // Phân hệ Báo cáo & Thống kê
  {
    path: '/reports',
    title: 'Báo cáo & Thống kê',
    icon: BarChart3,
    category: 'BÁO CÁO & HỆ THỐNG',
    badge: 'Đang phát triển',
    element: (
      <ComingSoonPage
        title="Phân hệ Báo cáo & Thống kê"
        description="Tổng hợp số liệu nhân khẩu, tình hình thu phí và xuất báo cáo tài chính."
        features={[
          'US12: Thống kê số lượng nhân khẩu và biến động cư trú',
          'US25: Thống kê tình hình thu phí và đóng góp theo kỳ',
          'US26: Xuất báo cáo thu phí định kỳ ra định dạng Excel hoặc PDF',
        ]}
      />
    ),
  },
  // Phân hệ Quản trị Tài khoản Ban Quản Trị
  {
    path: '/users',
    title: 'Quản trị tài khoản',
    icon: ShieldCheck,
    category: 'BÁO CÁO & HỆ THỐNG',
    badge: 'Đang phát triển',
    roles: ['ADMIN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Quản trị Tài khoản BQT"
        description="Cấp phát tài khoản, phân quyền vai trò cho thành viên BQT và theo dõi nhật ký kiểm toán."
        features={[
          'US01: Tạo tài khoản đăng nhập cho thành viên Ban Quản Trị',
          'US05: Xem danh sách, phân quyền vai trò, khóa tài khoản hoặc cấp lại mật khẩu',
          'US06: Xem nhật ký kiểm toán (Audit Log) theo dõi lịch sử thao tác',
        ]}
      />
    ),
  },
]

/** Vai trò có được vào trang này không (dùng cho cả menu và route). */
export const canAccess = (route: AppRoute, role: UserRole | undefined): boolean =>
  !route.roles || (!!role && route.roles.includes(role))
