import axios from 'axios'
import type { ApiAxiosError } from './errors'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Gửi và nhận session cookie (bluemoon.sid)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor xử lý lỗi phản hồi tập trung
api.interceptors.response.use(
  (response) => response,
  (error: ApiAxiosError) => {
    const status = error.response?.status
    const data = error.response?.data

    // 401 Unauthorized: Hết phiên hoặc chưa đăng nhập
    if (status === 401) {
      // Chỉ GET /me (kiểm tra phiên khi tải trang) được phép trả 401 mà không chuyển trang.
      // So khớp chính xác để không bỏ sót /members/..., /me/password...
      const isAuthCheck = error.config?.url === '/me'
      const isLoginPage = window.location.pathname === '/login'
      if (!isAuthCheck && !isLoginPage) {
        window.location.href = '/login'
      }
    }

    // 403 Forbidden với mã PASSWORD_CHANGE_REQUIRED: Bắt buộc đổi mật khẩu
    if (status === 403 && data?.code === 'PASSWORD_CHANGE_REQUIRED') {
      if (window.location.pathname !== '/force-change-password') {
        window.location.href = '/force-change-password'
      }
    }

    return Promise.reject(error)
  }
)
