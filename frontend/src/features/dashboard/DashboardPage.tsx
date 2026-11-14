import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  Building2,
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  FileText,
  Search,
  ChevronRight,
  Sparkles,
  BadgeDollarSign,
  PlusCircle,
  AlertCircle,
  ClipboardList,
  Ban,
} from 'lucide-react'
import { appRoutes, canAccess } from '../../app/routes'
import {
  mockStatistics,
  mockRecentReceipts,
  mockResidentOverview,
  mockTodoTasks,
  STATS_ROLES,
} from './dashboard.mock'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ''
  return `${get('hour')}:${get('minute')} ${get('day')}/${get('month')}/${get('year')}`
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [filterQuery, setFilterQuery] = useState('')

  // Route definitions for checking button & section access
  const householdsRoute = appRoutes.find((r) => r.path === '/households')
  const billingRoute = appRoutes.find((r) => r.path === '/billing')
  const feesRoute = appRoutes.find((r) => r.path === '/fees')
  const reportsRoute = appRoutes.find((r) => r.path === '/reports')
  const debtsRoute = appRoutes.find((r) => r.path === '/debts')

  // Access flags according to user role
  const canViewStats = Boolean(user?.role && STATS_ROLES.includes(user.role))
  const canAccessHouseholds = Boolean(householdsRoute && canAccess(householdsRoute, user?.role))
  const canAccessBilling = Boolean(billingRoute && canAccess(billingRoute, user?.role))
  const canAccessFees = Boolean(feesRoute && canAccess(feesRoute, user?.role))
  const canAccessReports = Boolean(reportsRoute && canAccess(reportsRoute, user?.role))
  const canAccessDebts = Boolean(debtsRoute && canAccess(debtsRoute, user?.role))

  // Filter receipts
  const filteredReceipts = mockRecentReceipts.filter(
    (tx) =>
      (tx.apartmentCode || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
      (tx.payerName || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
      tx.receiptNumber.toLowerCase().includes(filterQuery.toLowerCase()),
  )

  const totals = mockStatistics.totals
  const byFee = mockStatistics.byFee ?? []
  const byCampaign = mockStatistics.byCampaign ?? []

  return (
    <div className="space-y-6">
      {/* Dải nhãn vàng theo yêu cầu: Dữ liệu mẫu — chưa kết nối API /api/stats */}
      <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900 shadow-xs">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
        <span>Dữ liệu mẫu — chưa kết nối API /api/stats</span>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Chung cư BlueMoon • Ban Quản Trị</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Xin chào, {user?.fullName || 'Thành viên BQT'}! 👋
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-blue-100/90">
              Hệ thống theo dõi các khoản thu định kỳ, quản lý sổ hộ khẩu và nhân khẩu cư dân chung cư.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {canAccessBilling && billingRoute && (
              <Link
                to={billingRoute.path}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-800 shadow-sm transition hover:bg-blue-50 hover:shadow-md"
              >
                <PlusCircle className="h-4 w-4 text-blue-600" />
                <span>Lập phiếu thu mới</span>
              </Link>
            )}

            {canAccessHouseholds && householdsRoute && (
              <Link
                to={householdsRoute.path}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Users className="h-4 w-4 text-blue-200" />
                <span>Tra cứu căn hộ</span>
              </Link>
            )}

            {canAccessReports && reportsRoute && (
              <Link
                to={reportsRoute.path}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <FileText className="h-4 w-4 text-blue-200" />
                <span>Báo cáo tháng</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Căn hộ & Lấp đầy */}
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
                {mockResidentOverview.occupiedApartments}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                / {mockResidentOverview.totalApartments} căn
              </span>
              <span className="ml-auto inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                {mockResidentOverview.occupancyRate}%
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${mockResidentOverview.occupancyRate}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              <strong className="text-slate-700">{mockResidentOverview.vacantApartments} căn trống</strong> • {mockResidentOverview.occupiedApartments} hộ đang ở
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
                {new Intl.NumberFormat('vi-VN').format(mockResidentOverview.totalResidents)}
              </span>
              <span className="text-sm font-semibold text-slate-500">cư dân</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                +{mockResidentOverview.newResidentsThisWeek} tuần này
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '88%' }} />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              <strong className="text-slate-700">{mockResidentOverview.permanentResidents}</strong> thường trú • <strong className="text-slate-700">{mockResidentOverview.temporaryResidents}</strong> tạm trú
            </p>
          </div>
        </div>

        {/* Card 3: Tiến độ thu phí tháng */}
        <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Thu phí kỳ này
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                {totals?.collectionRate ?? 0}%
              </span>
              <span className="text-sm font-semibold text-slate-500">tỷ lệ thu</span>
              <span className="ml-auto inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                {totals?.householdsPaid ?? 0}/{totals?.householdsTotal ?? 0} hộ
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${totals?.collectionRate ?? 0}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Đã thu: <strong className="text-indigo-600">{formatCurrency(totals?.amountCollected ?? 0)}</strong>
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
                {formatCurrency(totals?.amountRemaining ?? 0)}
              </span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${100 - (totals?.collectionRate ?? 0)}%` }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              <strong className="text-amber-700">{mockTodoTasks.debtReminder.unpaidHouseholdsCount} hộ chưa nộp</strong> • {mockTodoTasks.debtReminder.overdueHouseholdsCount} hộ quá hạn
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Thống kê thu phí & Việc cần làm theo SDD SC003 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Thống kê các khoản thu & đóng góp (Hiện cho STATS_ROLES) */}
        {canViewStats && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Thống kê khoản thu &amp; đợt đóng góp (/api/stats)
                </h2>
                <p className="text-xs text-slate-500">
                  Tỷ lệ hoàn thành các khoản thu bắt buộc và các đợt vận động tự nguyện
                </p>
              </div>

              {canAccessFees && feesRoute && (
                <Link
                  to={feesRoute.path}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <span>Chi tiết biểu phí</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <div className="mt-5 space-y-4">
              {/* Danh sách khoản thu bắt buộc (byFee) */}
              {byFee.map((fee) => (
                <div key={fee.feeId} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold text-slate-800">{fee.feeName}</span>
                      <span className="ml-2 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                        {fee.collectionRate}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(fee.amountCollected ?? 0)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {' '}
                        / {formatCurrency(fee.amountDue ?? 0)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${fee.collectionRate ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Danh sách đợt vận động đóng góp (byCampaign) */}
              {byCampaign.map((camp) => (
                <div key={camp.campaignId} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold text-slate-800">{camp.campaignName}</span>
                      <span className="ml-2 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        Đợt đóng góp
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(camp.totalAmount ?? 0)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {' '}
                        ({camp.householdsContributed} hộ ủng hộ)
                      </span>
                    </div>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right: Việc cần làm theo SDD SC003 (US17: lập danh sách tháng, US21: theo dõi nợ) */}
        <div className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs ${!canViewStats ? 'lg:col-span-3' : ''}`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Việc cần làm (SDD SC003)</h2>
              <p className="text-xs text-slate-500">Nhắc việc nghiệp vụ quan trọng trong tháng</p>
            </div>
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>

          <div className="mt-4 space-y-3.5">
            {/* US17: Nhắc lập danh sách phải nộp tháng */}
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    US17
                  </span>
                  <h3 className="mt-1 text-xs font-bold text-blue-950">
                    Lập danh sách phải nộp tháng {mockTodoTasks.monthlyBillingReminder.month}
                  </h3>
                  <p className="mt-1 text-xs text-blue-800/80">
                    Cần tạo danh sách các khoản thu định kỳ và thông báo hạn nộp {mockTodoTasks.monthlyBillingReminder.dueDate}.
                  </p>
                </div>
              </div>

              {canAccessBilling && billingRoute && (
                <div className="mt-3">
                  <Link
                    to={billingRoute.path}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                  >
                    <span>Vào trang Thu phí để lập</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* US21: Theo dõi công nợ các hộ còn nợ */}
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    US21
                  </span>
                  <h3 className="mt-1 text-xs font-bold text-amber-950">
                    Hộ gia đình còn nợ phí ({mockTodoTasks.debtReminder.unpaidHouseholdsCount} hộ)
                  </h3>
                  <p className="mt-1 text-xs text-amber-800/80">
                    Tổng nợ tồn đọng: {formatCurrency(mockTodoTasks.debtReminder.totalRemainingDebt)} ({mockTodoTasks.debtReminder.overdueHouseholdsCount} hộ quá hạn).
                  </p>
                </div>
              </div>

              {canAccessDebts && debtsRoute && (
                <div className="mt-3">
                  <Link
                    to={debtsRoute.path}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950"
                  >
                    <span>Vào trang Công nợ để xem</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Bảng phiếu thu gần nhất (Chỉ hiện cho ADMIN & KE_TOAN theo canAccessBilling) */}
      {canAccessBilling && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Phiếu thu gần nhất (Receipt)
              </h2>
              <p className="text-xs text-slate-500">
                Trạng thái chỉ dùng HOP_LE và DA_HUY theo chuẩn CSDL
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

              {billingRoute && (
                <Link
                  to={billingRoute.path}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Receipts Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">Mã phiếu</th>
                  <th className="py-3 px-3">Căn hộ</th>
                  <th className="py-3 px-3">Người nộp</th>
                  <th className="py-3 px-3">Nội dung thu</th>
                  <th className="py-3 px-3 text-right">Số tiền</th>
                  <th className="py-3 px-3">Thời gian</th>
                  <th className="py-3 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReceipts.map((tx) => (
                  <tr key={tx.id} className="transition hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                      {tx.receiptNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-800">
                        {tx.apartmentCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">{tx.payerName}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {tx.items?.map((item) => item.feeName).join(', ') || 'Thu phí'}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900">
                      {formatCurrency(tx.totalAmount)}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{formatDateTime(tx.paidAt)}</td>
                    <td className="py-3 px-3 text-center">
                      {tx.status === 'HOP_LE' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Hợp lệ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                          <Ban className="h-3 w-3" />
                          Đã hủy
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
