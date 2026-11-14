import React from 'react'
import { Link } from 'react-router-dom'
import { Layers, ArrowLeft, Calendar, FileCode2, CheckCircle2 } from 'lucide-react'

interface ComingSoonPageProps {
  title: string
  description?: string
  phase?: string
  features?: string[]
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  description = 'Phân hệ chức năng đang được hoàn thiện theo lộ trình kiến trúc hệ thống Sprint 2.',
  phase,
  features = [
    'Tích hợp đầy đủ theo đặc tả OpenAPI 3.1 & Prisma ORM',
    'Phân quyền truy cập nghiêm ngặt theo vai trò BQT',
    'Kiểm soát toàn vẹn dữ liệu, giao dịch CSDL và ghi nhận audit log',
  ],
}) => {
  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition sm:p-12">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner ring-8 ring-blue-50/50">
            <Layers className="h-8 w-8" />
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>{phase || 'Lộ trình Sprint 2026'}</span>
          </div>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            {title}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            {description}
          </p>

          {/* Planned highlights */}
          <div className="mt-8 w-full max-w-md rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Tiêu chuẩn kỹ thuật hoàn thiện:
            </p>
            <ul className="mt-2.5 space-y-2 text-xs text-slate-600">
              {features.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 hover:shadow"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại Tổng quan</span>
            </Link>

            <a
              href="https://editor.swagger.io/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <FileCode2 className="h-4 w-4 text-slate-500" />
              <span>Xem tài liệu OpenAPI 3.1</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
