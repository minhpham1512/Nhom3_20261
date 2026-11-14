import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  Building2,
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  ChevronRight,
  Sparkles,
  Shield,
  BadgeDollarSign,
  PlusCircle,
} from 'lucide-react'

interface TransactionItem {
  id: string
  apartment: string
  payer: string
  feeType: string
  amount: number
  date: string
  method: 'Chuyển khoản' | 'Tiền mặt'
  status: 'COMPLETED' | 'PENDING'
}

const mockTransactions: TransactionItem[] = [
  {
    id: 'PT-202611-001',
    apartment: '12A05',
    payer: 'Đỗ Anh Tuấn',
    feeType: 'Phí dịch vụ & Quản lý T11',
    amount: 840000,
    date: '14/11/2026 10:24',
    method: 'Chuyển khoản',
    status: 'COMPLETED',
  },
  {
    id: 'PT-202611-002',
    apartment: '08B12',
    payer: 'Nguyễn Văn Minh',
    feeType: 'Phí gửi xe & Vệ sinh T11',
    amount: 650000,
    date: '14/11/2026 09:45',
    method: 'Tiền mặt',
    status: 'COMPLETED',
  },
  {
    id: 'PT-202611-003',
    apartment: '15A01',
    payer: 'Lê Thị Thu Thảo',
    feeType: 'Đợt ủng hộ Vì người nghèo',
    amount: 1000000,
    date: '14/11/2026 08:30',
    method: 'Chuyển khoản',
    status: 'COMPLETED',
  },
  {
    id: 'PT-202611-004',
    apartment: '04A09',
    payer: 'Trần Đình Trọng',
    feeType: 'Phí quản lý & Nước sinh hoạt',
    amount: 1250000,
    date: '13/11/2026 16:15',
    method: 'Chuyển khoản',
    status: 'PENDING',
  },
  {
    id: 'PT-202611-005',
    apartment: '20B03',
    payer: 'Phạm Hồng Nhung',
    feeType: 'Phí dịch vụ chung cư T11',
    amount: 720000,
    date: '13/11/2026 14:02',
    method: 'Tiền mặt',
    status: 'COMPLETED',
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [filterQuery, setFilterQuery] = useState('')

  // Filter transactions based on query
  const filteredTransactions = mockTransactions.filter(
    (tx) =>
      tx.apartment.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tx.payer.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(filterQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
        {/* Decorative backdrop shapes */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Chung cư BlueMoon • Ban Quản Trị Tòa Nhà</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Xin chào, {user?.fullName || 'Thành viên BQT'}! 👋
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-blue-100/90">
              Hệ thống quản lý dữ liệu 350 căn hộ, điều hành thu chi phí dịch vụ &amp; theo dõi nhân khẩu cư dân theo thời gian thực.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/billing"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-800 shadow-sm transition hover:bg-blue-50 hover:shadow-md"
            >
              <PlusCircle className="h-4 w-4 text-blue-600" />
              <span>Lập phiếu thu mới</span>
            </Link>
            <Link
              to="/households"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Users className="h-4 w-4 text-blue-200" />
              <span>Tra cứu căn hộ</span>
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <FileText className="h-4 w-4 text-blue-200" />
              <span>Báo cáo tháng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Core Bento KPI Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Căn hộ & Tỷ lệ lấp đầy */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Căn hộ &amp; Lấp đầy
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <Building2 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                342
              </span>
              <span className="text-sm font-semibold text-slate-500">/ 350 căn</span>
              <span className="ml-auto inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                97.7%
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: '97.7%' }} />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              <strong className="text-slate-700">8 căn trống</strong> • 34 căn cho thuê • 2 tháp A &amp; B
            </p>
          </div>
        </div>

        {/* Card 2: Quy mô cư dân */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-emerald-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nhân khẩu cư trú
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                1.185
              </span>
              <span className="text-sm font-semibold text-slate-500">cư dân</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                +5 tuần này
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '88%' }} />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              <strong className="text-slate-700">1.045</strong> thường trú • <strong className="text-slate-700">140</strong> tạm trú
            </p>
          </div>
        </div>

        {/* Card 3: Tiến độ thu phí tháng */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Thu phí Tháng 11
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                84.6%
              </span>
              <span className="text-sm font-semibold text-slate-500">hoàn thành</span>
              <span className="ml-auto inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                296/342 căn
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-indigo-600" style={{ width: '84.6%' }} />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Đã thu: <strong className="text-indigo-600">{formatCurrency(428500000)}</strong>
            </p>
          </div>
        </div>

        {/* Card 4: Công nợ tồn đọng */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-amber-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Công nợ cần thu
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-600 group-hover:text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-amber-600">
                77.5 tr
              </span>
              <span className="text-sm font-semibold text-slate-500">đồng</span>
              <span className="ml-auto inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                18 căn nợ
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-amber-500" style={{ width: '15.4%' }} />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              <strong className="text-amber-700">4 căn quá hạn &gt; 60 ngày</strong> • Cần gửi nhắc nợ
            </p>
          </div>
        </div>
      </div>

      {/* Bento Middle Row: Fee Breakdown & Notice Board */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Fee Categories & Progress (2 cols) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tiến độ các nguồn thu định kỳ &amp; Đợt vận động
              </h3>
              <p className="text-xs text-slate-500">
                Theo dõi tỷ lệ hoàn thành thu các khoản phí bắt buộc và đóng góp tự nguyện
              </p>
            </div>
            <Link
              to="/fees"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <span>Chi tiết biểu phí</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {/* Phí 1: Dịch vụ chung cư */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Phí dịch vụ chung cư</span>
                  <span className="ml-2 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                    5.000 đ/m²/tháng
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{formatCurrency(198500000)}</span>
                  <span className="text-xs text-slate-500"> / 210 tr (94.5%)</span>
                </div>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-blue-600" style={{ width: '94.5%' }} />
              </div>
            </div>

            {/* Phí 2: Quản lý BlueMoon */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Phí quản lý BlueMoon</span>
                  <span className="ml-2 rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                    7.000 đ/m²/tháng
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{formatCurrency(245000000)}</span>
                  <span className="text-xs text-slate-500"> / 294 tr (83.3%)</span>
                </div>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: '83.3%' }} />
              </div>
            </div>

            {/* Phí 3: Trông giữ phương tiện */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Phí trông giữ ô tô &amp; xe máy</span>
                  <span className="ml-2 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    Ô tô 1.2 tr • Xe máy 80k
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{formatCurrency(62500000)}</span>
                  <span className="text-xs text-slate-500"> / 65 tr (96.1%)</span>
                </div>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '96.1%' }} />
              </div>
            </div>

            {/* Phí 4: Đợt vận động tự nguyện */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Quỹ ủng hộ &amp; Khuyến học 2026</span>
                  <span className="ml-2 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    Đợt đóng góp tự nguyện
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{formatCurrency(145000000)}</span>
                  <span className="text-xs font-semibold text-emerald-600"> (Vượt 120% chỉ tiêu)</span>
                </div>
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-amber-500" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: BQT Schedule & Notices (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Lịch BQT &amp; Nhắc nhở</h3>
              <p className="text-xs text-slate-500">Sự kiện &amp; mốc công việc quan trọng</p>
            </div>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>

          <div className="mt-4 space-y-3.5">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200/70 bg-amber-50/50 p-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-amber-900">Hạn chót đóng phí T11: 15/11</p>
                <p className="mt-0.5 text-xs text-amber-800/80">
                  Phát hành thông báo nhắc nhở đợt cuối tới các căn hộ còn nợ phí.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-blue-200/70 bg-blue-50/50 p-3">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-blue-900">20/11: Chốt chỉ số điện nước</p>
                <p className="mt-0.5 text-xs text-blue-800/80">
                  Cán bộ kỹ thuật kiểm tra và ghi số công tơ khu vực hành lang chung.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
              <div>
                <p className="text-xs font-bold text-slate-900">28/11: Họp giao ban BQT</p>
                <p className="mt-0.5 text-xs text-slate-600">
                  Báo cáo thu chi tài chính tháng và kế hoạch bảo trì thang máy tháp A.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span>Chung cư BlueMoon</span>
            </div>
            <p className="mt-1 text-xs text-blue-800/80">
              Quy chuẩn phí dịch vụ áp dụng theo khung quy định 2.500 - 16.500 VND/m²/tháng.
            </p>
          </div>
        </div>
      </div>

      {/* Bento Bottom Row: Recent Receipts Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Giao dịch thu phí &amp; Đóng góp gần nhất
            </h3>
            <p className="text-xs text-slate-500">
              Các phiếu thu và giao dịch thanh toán được ghi nhận gần đây
            </p>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 h-4 w-4" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Tìm căn hộ, chủ hộ..."
                className="w-48 sm:w-64 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <Link
              to="/billing"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Mã phiếu</th>
                <th className="py-3 px-3">Căn hộ</th>
                <th className="py-3 px-3">Người nộp</th>
                <th className="py-3 px-3">Nội dung thu</th>
                <th className="py-3 px-3 text-right">Số tiền</th>
                <th className="py-3 px-3">Hình thức</th>
                <th className="py-3 px-3">Thời gian</th>
                <th className="py-3 px-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="transition hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                    {tx.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-800">
                      {tx.apartment}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">{tx.payer}</td>
                  <td className="py-3 px-3 text-slate-600">{tx.feeType}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{tx.method}</td>
                  <td className="py-3 px-3 text-slate-500">{tx.date}</td>
                  <td className="py-3 px-3 text-center">
                    {tx.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Đã xác nhận
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" />
                        Đang đối soát
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
