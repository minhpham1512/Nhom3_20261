import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Lock, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { isAxiosError } from 'axios'
import { getApiErrorBody, getDetailString } from '../../lib/errors'

/** "HH:mm ngày dd/MM/yyyy" theo giờ Việt Nam; null nếu chuỗi không phải thời điểm hợp lệ. */
function formatVietnamTime(iso: string): string | null {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
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
  return `${get('hour')}:${get('minute')} ngày ${get('day')}/${get('month')}/${get('year')}`
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!username.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.')
      return
    }

    setIsSubmitting(true)
    try {
      const loggedUser = await login({ username: username.trim(), password })
      if (loggedUser.mustChangePassword) {
        navigate('/force-change-password', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      const status = isAxiosError(err) ? err.response?.status : undefined
      const body = getApiErrorBody(err)
      const code = body?.code

      if (status === 423 || code === 'ACCOUNT_LOCKED') {
        const lockedUntil = getDetailString(body, 'lockedUntil')
        const until = lockedUntil ? formatVietnamTime(lockedUntil) : null
        setErrorMsg(
          until
            ? `Tài khoản đang bị tạm khóa đến ${until}.`
            : 'Tài khoản đang bị tạm khóa do nhập sai mật khẩu nhiều lần. Vui lòng thử lại sau.',
        )
      } else if (status === 401 || code === 'INVALID_CREDENTIALS') {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu không đúng, hoặc tài khoản đã bị vô hiệu hóa.')
      } else {
        setErrorMsg(body?.message || 'Không thể đăng nhập. Vui lòng thử lại.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Đăng nhập tài khoản BQT</h2>
        <p className="mt-1 text-sm text-slate-400">
          Nhập thông tin xác thực để truy cập hệ thống quản trị
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/50 p-3.5 text-sm text-red-200 backdrop-blur-sm animate-in fade-in duration-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username-input"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Tên đăng nhập
          </label>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="username-input"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ví dụ: admin"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 pr-3 pl-10 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Mật khẩu
            </label>
          </div>
          <div className="relative mt-1.5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 pr-10 pl-10 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200 focus:outline-none"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-200 hover:from-blue-500 hover:to-indigo-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Đang xác thực...</span>
            </div>
          ) : (
            <>
              <span>Đăng nhập hệ thống</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
