# Frontend BlueMoon

Giao diện web của phần mềm quản lý thu phí & cư dân chung cư BlueMoon.

## Stack
- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS v4** (qua plugin `@tailwindcss/vite`, không có file cấu hình riêng)
- React Router, axios, lucide-react (icon)
- Xác thực bằng session cookie (`bluemoon.sid`), frontend không lưu token

## Cách chạy
Cần Node.js 20.19+ (khuyến nghị 24).

```bash
cd frontend
npm ci          # cài đúng phiên bản trong package-lock.json
npm run dev     # http://localhost:5173
```

Mọi request tới `/api/...` được Vite proxy sang backend ở `http://localhost:3000`, nên **backend phải chạy ở cổng 3000** thì mới đăng nhập được. Chưa có backend thì trang `/login` vẫn mở được nhưng không đăng nhập được.

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy dev server, tự tải lại khi sửa code |
| `npm run build` | Kiểm tra type (`tsc -b`) rồi build ra `dist/` |
| `npm run lint` | Kiểm tra code bằng oxlint |
| `npm run preview` | Chạy thử bản build trong `dist/` |

## Cấu trúc thư mục
```
src/
├─ main.tsx              # điểm vào, gắn <App /> vào trang
├─ index.css             # @import "tailwindcss"
├─ app/
│  ├─ App.tsx            # khai báo router
│  └─ routes.tsx         # cấu hình các trang trong MainLayout: đường dẫn, tiêu đề, icon, vai trò
├─ features/             # mỗi chức năng một thư mục
│  ├─ auth/              # AuthContext, ProtectedRoute, LoginPage, ForceChangePasswordPage
│  └─ dashboard/         # DashboardPage
├─ layouts/              # AuthLayout (trang đăng nhập), MainLayout (sidebar + header)
├─ lib/
│  ├─ client.ts          # axios instance gọi /api, xử lý 401/403 tập trung
│  ├─ errors.ts          # đọc body lỗi theo định dạng swagger
│  └─ cn.ts              # hàm ghép className
└─ components/           # component giao diện dùng chung (ComingSoonPage...)
```

### Thêm một trang mới vào menu
Thêm một phần tử vào `appRoutes` trong [src/app/routes.tsx](src/app/routes.tsx). Menu trong MainLayout và route trong App đều đọc từ đây, nên quyền theo vai trò (`roles`) luôn khớp: menu ẩn với ai thì gõ thẳng URL cũng bị chặn.

## Quy ước
- **Type cho dữ liệu API lấy từ `@shared`**, không tự khai báo interface cho request/response:
  ```ts
  import type { User, Household, ApiErrorBody } from '@shared'
  ```
  Type này sinh tự động từ [doc/swagger.yaml](../doc/swagger.yaml), xem [shared/README.md](../shared/README.md). Swagger là nguồn sự thật: code lệch swagger thì sửa code.
- **Lỗi API** có dạng `{ code, message, details? }`, riêng lỗi validation là `{ code, message, fields: [{ field, message }] }`. Dùng các hàm trong `lib/errors.ts` để đọc, không tự ép kiểu.
- **Ghép class Tailwind bằng `cn()`**, không ghép bằng template string:
  ```tsx
  import { cn } from '../lib/cn'

  <div className={cn('rounded-lg px-3', isActive ? 'bg-blue-600' : 'bg-slate-800')} />
  ```
