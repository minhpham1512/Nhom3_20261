import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Building2, Users, Receipt, CreditCard, Shield } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Xin chào, {user?.fullName}! 👋
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              Chào mừng bạn đến với hệ thống Quản lý Chung cư BlueMoon.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md">
            <Shield className="h-4 w-4 text-blue-300" />
            <span>Vai trò: {user?.role}</span>
          </div>
        </div>
      </div>

      {/* Feature summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Phân hệ Cư dân</p>
              <h4 className="text-base font-semibold text-slate-800">Hộ gia đình & Nhân khẩu</h4>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Theo dõi danh sách căn hộ, biến động tạm trú, tạm vắng và nhân khẩu thực tế.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Phân hệ Khoản thu</p>
              <h4 className="text-base font-semibold text-slate-800">Biểu phí & Đơn giá</h4>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Quản lý đơn giá dịch vụ (khung 2.500 - 16.500 VND/m²), phí vệ sinh, xe cộ.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Phân hệ Thu phí</p>
              <h4 className="text-base font-semibold text-slate-800">Phiếu thu & Đóng góp</h4>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Lập bảng kê, phát hành phiếu thu tiền, theo dõi công nợ các căn hộ.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Báo cáo & Thống kê</p>
              <h4 className="text-base font-semibold text-slate-800">Xuất dữ liệu</h4>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Tổng hợp doanh thu, tỷ lệ hoàn thành thu phí và xuất báo cáo Excel/PDF.
          </p>
        </div>
      </div>
    </div>
  )
}
