import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthLayout } from './layouts/AuthLayout'
import { MainLayout } from './layouts/MainLayout'
import { LoginPage } from './pages/LoginPage'
import { ForceChangePasswordPage } from './pages/ForceChangePasswordPage'
import { DashboardPage } from './pages/DashboardPage'

// Component thông báo màn hình đang trong lộ trình phát triển
const ComingSoonPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
    <div className="rounded-full bg-blue-50 p-4 text-blue-600">
      <span className="text-2xl font-bold">🚀</span>
    </div>
    <h3 className="mt-4 text-lg font-bold text-slate-800">{title}</h3>
    <p className="mt-1 text-sm text-slate-500">
      Màn hình này nằm trong các giai đoạn tiếp theo của lộ trình Sprint 2.
    </p>
  </div>
)

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Forced Password Change route */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/force-change-password" element={<ForceChangePasswordPage />} />
            </Route>
          </Route>

          {/* Protected App routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Phân hệ Cư dân (Phase 3) */}
              <Route
                path="/households"
                element={<ComingSoonPage title="Phân hệ Quản lý Cư dân & Căn hộ (Phase 3)" />}
              />

              {/* Phân hệ Khoản thu & Đợt đóng góp (Phase 4) */}
              <Route
                path="/fees"
                element={<ComingSoonPage title="Phân hệ Quản lý Khoản thu & Đơn giá (Phase 4)" />}
              />
              <Route
                path="/campaigns"
                element={<ComingSoonPage title="Phân hệ Quản lý Đợt đóng góp (Phase 4)" />}
              />

              {/* Phân hệ Thu phí & Công nợ (Phase 5) */}
              <Route
                path="/billing"
                element={<ComingSoonPage title="Phân hệ Thu phí & Phiếu thu (Phase 5)" />}
              />
              <Route
                path="/debts"
                element={<ComingSoonPage title="Phân hệ Theo dõi Công nợ (Phase 5)" />}
              />

              {/* Báo cáo & Thống kê (Phase 6) */}
              <Route
                path="/reports"
                element={<ComingSoonPage title="Phân hệ Báo cáo & Thống kê (Phase 6)" />}
              />

              {/* Quản trị tài khoản (Phase 2) */}
              <Route
                path="/users"
                element={<ComingSoonPage title="Phân hệ Quản trị Tài khoản BQT (Phase 2)" />}
              />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
