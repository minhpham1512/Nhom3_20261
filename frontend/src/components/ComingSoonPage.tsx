import React from 'react'
import { Link } from 'react-router-dom'
import { Layers, ArrowLeft, CheckCircle2 } from 'lucide-react'

interface ComingSoonPageProps {
  title: string
  description?: string
  features?: string[]
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  description = 'Phân hệ chức năng đang được hoàn thiện theo phạm vi phiên bản v1.0.',
  features = [],
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
            <span>Đang phát triển</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            {description}
          </p>

          {/* Planned user stories */}
          {features.length > 0 && (
            <div className="mt-8 w-full max-w-lg rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Chức năng trong phạm vi (v1.0):
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
          )}

          {/* Action */}
          <div className="mt-8 flex items-center justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 hover:shadow"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại Tổng quan</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
