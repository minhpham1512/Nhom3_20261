# Phần Mềm Quản Lý Thu Phí & Cư Dân Chung Cư BlueMoon

Hệ thống quản lý chung cư xây dựng bằng **Node.js + PostgreSQL + React**.

## Yêu cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (phải **đang chạy**)
- Node.js 20.19+ (khuyến nghị 24)

## Cài đặt CSDL lần đầu
```bash
git clone https://github.com/minhpham1512/Nhom3_20261.git
cd Nhom3_20261/backend
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
npm run db:up                 # bật PostgreSQL 18 trong Docker, chờ tới khi sẵn sàng
npm install                   # cài Prisma, tự sinh Prisma Client
npm run db:deploy             # tạo bảng, ràng buộc, index từ prisma/migrations
npm run db:seed               # dữ liệu mẫu + tài khoản admin / Admin@123
```
CSDL chạy ở **localhost:5433** (không phải 5432, để không đụng PostgreSQL cài sẵn trên máy).
Kết nối bằng pgAdmin/DBeaver: host `localhost`, port `5433`, user `postgres`, mật khẩu `postgres`, database `bluemoon_db`.

## Lệnh thường dùng (chạy trong `backend/`)
| Lệnh | Khi nào dùng |
|---|---|
| `npm run db:up` / `npm run db:down` | Bật / tắt CSDL. Tắt **không** mất dữ liệu |
| `npm run db:deploy` | Sau khi `git pull` có migration mới |
| `npm run db:generate` | Sau khi `schema.prisma` thay đổi |
| `npm run db:migrate -- --name ten_thay_doi` | Tạo migration mới sau khi sửa `schema.prisma` (xem [DATABASE.md](./DATABASE.md#4-thay-đổi-cấu-trúc-csdl)) |
| `npm run db:reset` | **Xóa sạch** dữ liệu, migrate lại và seed lại |
| `npm run db:studio` | Xem/sửa dữ liệu trên trình duyệt (http://localhost:5555) |

## Cấu trúc thư mục
```
Nhom3_20261/
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma    # mô hình dữ liệu cho Prisma Client
│  │  ├─ migrations/      # lịch sử thay đổi CSDL, không sửa file đã merge
│  │  └─ seed.sql         # dữ liệu mẫu
│  ├─ prisma.config.ts    # cấu hình Prisma (đọc DATABASE_URL từ .env)
│  ├─ .env.example        # mẫu biến môi trường, chép thành .env
│  └─ package.json
├─ frontend/              # (Sprint 2) React + Vite
├─ shared/                # (Sprint 2) schema Zod dùng chung FE–BE
├─ doc/swagger.yaml       # đặc tả API, OpenAPI 3.1
├─ docker-compose.yml     # PostgreSQL 18 cho máy dev
├─ DATABASE.md
└─ README.md
```

## Xử lý sự cố
| Lỗi | Cách xử lý |
|---|---|
| `Cannot connect to the Docker daemon` hoặc `failed to connect to the docker API` | Mở Docker Desktop, chờ khởi động xong rồi chạy lại |
| `port is already allocated` (cổng 5433) | Đổi cổng trong `docker-compose.yml` (phần `ports`) **và** trong `DATABASE_URL` của `backend/.env` cho khớp nhau |
| Prisma báo `P1001: Can't reach database server` | CSDL chưa bật (chạy `npm run db:up`), hoặc `.env` ghi sai cổng |
| `npm warn install-scripts ... not yet covered by allowScripts` khi `npm install` | Bỏ qua, Prisma vẫn chạy bình thường |
| Muốn xóa sạch CSDL làm lại từ đầu | `docker compose down -v` (**mất toàn bộ dữ liệu**), rồi chạy lại các bước cài đặt từ `npm run db:up` |

## Quy trình đóng góp
- Nhánh tạo từ `main`, tên không dấu: `feature/...`, `fix/...`.
- Commit theo dạng `feat: ...`, `fix: ...`, `docs: ...`.
- Mọi thay đổi vào `main` đều phải qua Pull Request và có ít nhất 1 người duyệt. **Không push thẳng lên `main`.**
- Muốn đổi cấu trúc CSDL thì chỉ tạo migration mới, **không sửa migration đã merge** (xem [DATABASE.md](./DATABASE.md#4-thay-đổi-cấu-trúc-csdl)).

## Tài liệu
- [Thiết kế CSDL (DATABASE.md)](./DATABASE.md)
- [Đặc tả API (doc/swagger.yaml)](./doc/swagger.yaml): xem dạng trang tài liệu bằng một trong hai cách:
  - Cài extension OpenAPI/Swagger cho VS Code (ví dụ *OpenAPI (Swagger) Editor*), mở `swagger.yaml` rồi bật chế độ preview.
  - Mở [Swagger Editor](https://editor.swagger.io/) và dán nội dung file vào.
- Migration (nguồn sự thật của cấu trúc CSDL): [`backend/prisma/migrations/`](./backend/prisma/migrations/)
- Dữ liệu mẫu: [`backend/prisma/seed.sql`](./backend/prisma/seed.sql)
