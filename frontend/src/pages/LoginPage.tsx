import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react'
import type { AxiosError } from 'axios'
import type { ApiErrorBody } from '@shared'

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
      const axiosErr = err as AxiosError<ApiErrorBody>
      const status = axiosErr.response?.status
      const code = axiosErr.response?.data?.code

      if (status === 423 || code === 'ACCOUNT_LOCKED') {
        setErrorMsg('Tài khoản đang bị tạm khóa 15 phút do nhập sai mật khẩu quá 5 lần.')
      } else if (status === 401 || code === 'INVALID_CREDENTIALS') {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu không đúng, hoặc tài khoản đã bị vô hiệu hóa.')
      } else {
        setErrorMsg(axiosErr.response?.data?.message || 'Không thể đăng nhập. Vui lòng thử lại.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-white">Đăng nhập hệ thống</h3>
      <p className="mt-1 text-sm text-slate-400">
        Sử dụng tài khoản BQT được cấp để truy cập
      </p>

      {errorMsg && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-red-950/60 p-3 text-sm text-red-300 ring-1 ring-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Tên đăng nhập
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ví dụ: admin"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pr-3 pl-9 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Mật khẩu
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pr-3 pl-9 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Đăng nhập</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
