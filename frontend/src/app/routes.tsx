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
  // Phân hệ Cư dân (Phase 3)
  {
    path: '/households',
    title: 'Hộ & Cư dân',
    icon: Users,
    category: 'QUẢN LÝ CƯ DÂN',
    badge: 'Phase 3',
    roles: ['ADMIN', 'CAN_BO_CU_DAN', 'TRUONG_BQT'],
    element: (
      <ComingSoonPage
        title="Phân hệ Quản lý Cư dân & Căn hộ"
        phase="Phase 3 • Sprint 2"
        description="Quản lý danh sách 350 căn hộ, sổ hộ khẩu, nhân khẩu, biến động tạm trú / tạm vắng và tách nhập hộ khẩu."
        features={[
          'Tra cứu & quản lý chi tiết căn hộ, diện tích m² và thông tin chủ hộ',
          'Đăng ký biến động nhân khẩu: Thường trú, Tạm trú, Tạm vắng',
          'Lịch sử cư trú và quan hệ gia đình (Chủ hộ, Vợ, Con...)',
        ]}
      />
    ),
  },
  // Phân hệ Khoản thu & Đợt đóng góp (Phase 4)
  {
    path: '/fees',
    title: 'Khoản thu & Đơn giá',
    icon: Receipt,
    category: 'TÀI CHÍNH & THU PHÍ',
    badge: 'Phase 4',
    roles: ['ADMIN', 'KE_TOAN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Quản lý Khoản thu & Đơn giá"
        phase="Phase 4 • Sprint 2"
        description="Cấu hình danh mục phí bắt buộc theo quy định chung cư (khung 2.500 - 16.500 đ/m²), phí quản lý, phí vệ sinh, phí phương tiện."
        features={[
          'Thiết lập đơn giá phí dịch vụ theo m² sàn thông thủy',
          'Biểu phí trông giữ phương tiện (ô tô, xe máy, xe đạp điện)',
          'Kiểm soát lịch sử thay đổi biểu giá và hiệu lực áp dụng',
        ]}
      />
    ),
  },
  {
    path: '/campaigns',
    title: 'Đợt đóng góp',
    icon: HeartHandshake,
    category: 'TÀI CHÍNH & THU PHÍ',
    badge: 'Phase 4',
    roles: ['ADMIN', 'KE_TOAN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Đợt vận động đóng góp"
        phase="Phase 4 • Sprint 2"
        description="Tổ chức các đợt vận động tự nguyện: Quỹ khuyến học, Quỹ vì người nghèo, Ủng hộ đồng bào bão lũ, Quỹ lễ hội chung cư."
        features={[
          'Phát động chiến dịch quyên góp với mục tiêu và thời hạn',
          'Ghi nhận đóng góp theo từng căn hộ hoặc ẩn danh',
          'Công khai minh bạch tiến độ đạt chỉ tiêu và bảng vàng đóng góp',
        ]}
      />
    ),
  },
  // Phân hệ Thu phí & Công nợ (Phase 5)
  {
    path: '/billing',
    title: 'Thu phí & Phiếu thu',
    icon: CreditCard,
    category: 'TÀI CHÍNH & THU PHÍ',
    badge: 'Phase 5',
    roles: ['ADMIN', 'KE_TOAN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Thu phí & Lập Phiếu thu"
        phase="Phase 5 • Sprint 2"
        description="Tự động tính toán các khoản phải thu hàng tháng cho từng căn hộ, xuất bảng kê, in phiếu thu và xác nhận thanh toán."
        features={[
          'Tự động sinh đợt thu theo chu kỳ tháng cho 350 căn hộ',
          'Hỗ trợ thanh toán tiền mặt & chuyển khoản ngân hàng (VietQR)',
          'Xuất phiếu thu PDF có mã vạch / QR xác thực giao dịch',
        ]}
      />
    ),
  },
  {
    path: '/debts',
    title: 'Theo dõi Công nợ',
    icon: AlertCircle,
    category: 'TÀI CHÍNH & THU PHÍ',
    badge: 'Phase 5',
    roles: ['ADMIN', 'KE_TOAN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Quản lý & Thu hồi Công nợ"
        phase="Phase 5 • Sprint 2"
        description="Giám sát công nợ chưa nộp, nợ quá hạn theo mốc 30-60-90 ngày, tạo thông báo nhắc nợ tự động."
        features={[
          'Báo cáo phân tích tuổi nợ (Aging of Accounts Receivable)',
          'Tạo văn bản và email / SMS thông báo nhắc nợ phí chung cư',
          'Lịch sử cam kết thanh toán của từng hộ gia đình',
        ]}
      />
    ),
  },
  // Báo cáo & Thống kê (Phase 6)
  {
    path: '/reports',
    title: 'Báo cáo & Thống kê',
    icon: BarChart3,
    category: 'BÁO CÁO & HỆ THỐNG',
    badge: 'Phase 6',
    element: (
      <ComingSoonPage
        title="Phân hệ Báo cáo & Thống kê Toàn diện"
        phase="Phase 6 • Sprint 2"
        description="Tổng hợp doanh thu, tỷ lệ thu phí, biến động dân cư và xuất báo cáo tài chính định kỳ theo chuẩn quản lý chung cư."
        features={[
          'Báo cáo thu - chi và quỹ đóng góp theo tháng/quý/năm',
          'Biểu đồ trực quan tỷ lệ thanh toán và mật độ cư dân theo tầng/tháp',
          'Xuất dữ liệu chuẩn Excel (.xlsx) và báo cáo in ấn PDF',
        ]}
      />
    ),
  },
  // Quản trị tài khoản (Phase 2)
  {
    path: '/users',
    title: 'Quản trị tài khoản',
    icon: ShieldCheck,
    category: 'BÁO CÁO & HỆ THỐNG',
    roles: ['ADMIN'],
    element: (
      <ComingSoonPage
        title="Phân hệ Quản trị Tài khoản Ban Quản Trị"
        phase="Phase 2 • Sprint 2"
        description="Cấp phát tài khoản nội bộ cho các thành viên BQT, phân quyền vai trò (Admin, Kế toán, Cán bộ cư dân, Trưởng BQT) và theo dõi nhật ký hoạt động."
        features={[
          'Cấp mới tài khoản, phân quyền theo đúng vai trò nghiệp vụ',
          'Đặt lại mật khẩu tạm thời & ép buộc đổi mật khẩu lần đầu',
          'Nhật ký kiểm toán hệ thống (Audit Logs) truy vết mọi thao tác',
        ]}
      />
    ),
  },
]

/** Vai trò có được vào trang này không (dùng cho cả menu và route). */
export const canAccess = (route: AppRoute, role: UserRole | undefined): boolean =>
  !route.roles || (!!role && route.roles.includes(role))
