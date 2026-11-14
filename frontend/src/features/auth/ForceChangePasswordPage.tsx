import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/client'
import { getApiErrorBody, hasFieldErrors } from '../../lib/errors'
import { useAuth } from './AuthContext'
import { KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react'
import type { ChangePasswordRequest } from '@shared'

type PasswordField = keyof ChangePasswordRequest
type FieldErrors = Partial<Record<PasswordField, string>>

const PASSWORD_FIELDS: readonly PasswordField[] = ['currentPassword', 'newPassword', 'confirmNewPassword']

const isPasswordField = (field: string): field is PasswordField =>
  (PASSWORD_FIELDS as readonly string[]).includes(field)

/** Theo ChangePasswordRequest trong swagger: tối thiểu 8 ký tự, có cả chữ và số. */
function validateNewPassword(password: string): string | null {
  if (password.length < 8) return 'Mật khẩu mới phải có tối thiểu 8 ký tự.'
  if (!/\p{L}/u.test(password) || !/\d/.test(password)) {
    return 'Mật khẩu mới phải có ít nhất một chữ cái và một chữ số.'
  }
  return null
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-400">{message}</p> : null

export const ForceChangePasswordPage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Real-time checks
  const hasMinLength = newPassword.length >= 8
  const hasLetter = /\p{L}/u.test(newPassword)
  const hasNumber = /\d/.test(newPassword)
  const isMatch = Boolean(confirmNewPassword && newPassword === confirmNewPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setFieldErrors({})

    const clientErrors: FieldErrors = {}
    const newPasswordError = validateNewPassword(newPassword)
    if (newPasswordError) clientErrors.newPassword = newPasswordError
    if (newPassword !== confirmNewPassword) clientErrors.confirmNewPassword = 'Mật khẩu xác nhận không khớp.'
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const payload: ChangePasswordRequest = { currentPassword, newPassword, confirmNewPassword }
      await api.put('/me/password', payload)
      await refreshUser()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const body = getApiErrorBody(err)

      // Lỗi theo từng trường (VALIDATION_ERROR, INVALID_CURRENT_PASSWORD...): hiện dưới ô tương ứng
      if (hasFieldErrors(body)) {
        const serverErrors: FieldErrors = {}
        const otherMessages: string[] = []
        for (const { field, message } of body.fields) {
          if (isPasswordField(field)) serverErrors[field] ??= message
          else otherMessages.push(message)
        }
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors)
          if (otherMessages.length > 0) setErrorMsg(otherMessages.join(' '))
          return
        }
      }

      if (body?.code === 'INVALID_CURRENT_PASSWORD') {
        setFieldErrors({ currentPassword: 'Mật khẩu hiện tại không chính xác.' })
      } else {
        setErrorMsg(body?.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-amber-400">
          <ShieldAlert className="h-6 w-6" />
          <h2 className="text-xl font-bold text-white">Bắt buộc cập nhật mật khẩu</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Xin chào <strong className="text-white">{user?.fullName}</strong>. Để đảm bảo an toàn cho dữ liệu chung cư BlueMoon, bạn vui lòng đổi mật khẩu mới cho lần đầu đăng nhập.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/50 p-3.5 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span className="flex-1 font-medium">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mật khẩu hiện tại */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Mật khẩu hiện tại (khởi tạo)
          </label>
          <div className="relative mt-1.5">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 pr-10 pl-3.5 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200"
              tabIndex={-1}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError message={fieldErrors.currentPassword} />
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Mật khẩu mới
          </label>
          <div className="relative mt-1.5">
            <input
              type={showNewPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 8 ký tự, có chữ và số"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 pr-10 pl-3.5 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200"
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError message={fieldErrors.newPassword} />
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative mt-1.5">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 pr-10 pl-3.5 text-sm text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError message={fieldErrors.confirmNewPassword} />
        </div>

        {/* Password Strength Checklist Indicator */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs">
          <p className="font-semibold text-slate-300">Quy tắc bảo mật mật khẩu:</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Tối thiểu 8 ký tự</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${hasLetter ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Chứa ít nhất 1 chữ cái</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Chứa ít nhất 1 chữ số</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${isMatch ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Mật khẩu xác nhận khớp</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-indigo-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Đang lưu mật khẩu mới...</span>
            </div>
          ) : (
            <>
              <KeyRound className="h-4 w-4" />
              <span>Lưu mật khẩu &amp; Tiếp tục</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
