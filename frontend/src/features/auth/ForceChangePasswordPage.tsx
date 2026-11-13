import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/client'
import { getApiErrorBody, hasFieldErrors } from '../../lib/errors'
import { useAuth } from './AuthContext'
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react'
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    <div>
      <div className="flex items-center gap-2 text-amber-400">
        <KeyRound className="h-6 w-6" />
        <h3 className="text-xl font-bold text-white">Bắt buộc đổi mật khẩu</h3>
      </div>
      <p className="mt-2 text-sm text-slate-300">
        Xin chào <strong>{user?.fullName}</strong>. Đây là lần đăng nhập đầu tiên hoặc mật khẩu của bạn vừa được quản trị viên đặt lại. Vui lòng cập nhật mật khẩu mới để tiếp tục sử dụng hệ thống.
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
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            aria-invalid={!!fieldErrors.currentPassword}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <FieldError message={fieldErrors.currentPassword} />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Mật khẩu mới (tối thiểu 8 ký tự, gồm chữ và số)
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            aria-invalid={!!fieldErrors.newPassword}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <FieldError message={fieldErrors.newPassword} />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            aria-invalid={!!fieldErrors.confirmNewPassword}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <FieldError message={fieldErrors.confirmNewPassword} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500 disabled:opacity-60"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Cập nhật và tiếp tục</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
