# Tài Liệu Thiết Kế & Hướng Dẫn Cơ Sở Dữ Liệu (PostgreSQL)
**Dự án:** Phần mềm Quản lý Thu phí & Cư dân Chung cư BlueMoon (v1.0)

---

## 1. Tổng Quan Kiến Trúc CSDL
- **Hệ quản trị CSDL:** PostgreSQL (v18.6)
- **Extensions bắt buộc:** `unaccent`, `pg_trgm` (tìm kiếm tiếng Việt không dấu, tạo trong `schema.sql`); `pgcrypto` (băm mật khẩu trong `seed.sql`).
- **Thiết kế:** Đạt chuẩn 3NF, gồm **13 bảng (v1.0)**. Các bảng v2.0 (phương tiện, thu hộ) chưa nằm trong schema này.

### Quy ước chung
- **Tiền:** mọi cột tiền là `BIGINT`, đơn vị **đồng** (`NFR-007`). Khi tính phí theo m² phải làm tròn về số nguyên trước khi lưu.
- **Thời điểm:** dùng `TIMESTAMPTZ` (có múi giờ).
- **Trạng thái / loại:** mọi cột `trang_thai`, `loai_*` đều có `NOT NULL` + `CHECK` giới hạn giá trị hợp lệ (xem mục 2).
- **Không xóa cứng dữ liệu nghiệp vụ:** phiếu thu chỉ được hủy mềm; khóa ngoại không dùng `ON DELETE CASCADE`.

---

## 2. Phân Nhóm Các Bảng Dữ Liệu

### Quản trị & Bảo mật (`EP01`)
- `vai_tro`: Danh sách vai trò (`ADMIN`, `KE_TOAN`, `CAN_BO_CU_DAN`, `TRUONG_BQT`).
- `tai_khoan`: Tài khoản thành viên BQT, bắt buộc có vai trò. Mật khẩu lưu dạng `bcrypt` hash (`NFR-002`).
  - `trang_thai`: `ACTIVE` | `INACTIVE` (Admin bật/tắt tài khoản).
  - Khóa tạm khi sai mật khẩu (`US02`) do `so_lan_sai_mat_khau` và `khoa_den_thoi_gian` quyết định, không dùng trạng thái riêng.
- `nhat_ky_thao_tac`: Audit Log lưu lại mọi hành vi `INSERT/UPDATE/DELETE` dưới dạng `JSONB` (`US06`, `NFR-005`). `tai_khoan_id` để trống với thao tác do hệ thống tự chạy.

### Hộ Gia Đình & Nhân Khẩu (`EP02`)
- `can_ho`: Thông tin căn hộ, diện tích m² (căn cứ tính phí dịch vụ & phí quản lý).
- `ho_gia_dinh`: Quản lý hộ khẩu theo căn hộ, `ma_ho_khau` bắt buộc và duy nhất.
  - `trang_thai`: `DANG_O` | `DA_CHUYEN_DI`.
  - Mỗi căn hộ có tối đa 1 hộ `DANG_O` (partial unique index `uq_ho_gia_dinh_can_ho_dang_o`); các hộ đã chuyển đi được giữ lại làm lịch sử.
- `nhan_khau`: Cư dân trong hộ. Số CCCD duy nhất (trẻ em dưới 14 tuổi có thể NULL).
  - `trang_thai`: `THUONG_TRU` | `TAM_TRU` | `TAM_VANG` | `DA_CHUYEN_DI`.
  - Mỗi hộ có **tối đa** 1 chủ hộ (partial unique index `uq_nhan_khau_chu_ho`). Việc hộ phải có chủ hộ do backend kiểm tra. Khi đổi chủ hộ: bỏ cờ chủ hộ cũ trước, đặt cờ chủ hộ mới sau, trong cùng một transaction.
- `bien_dong_nhan_khau`: Lịch sử biến động, không xóa cứng (`US10`).
  - `loai_bien_dong`: `SINH_MOI` | `CHUYEN_DEN` | `CHUYEN_DI` | `QUA_DOI` | `DOI_CHU_HO`.
- `tam_tru_tam_vang`: Quản lý tạm trú, tạm vắng tuân thủ Luật Cư trú 2020 (`US11`).
  - `loai_khai_bao`: `TAM_TRU` | `TAM_VANG`.

### Khoản Thu & Thu Phí (`EP03`, `EP04`, `EP05`)
- `khoan_thu`: Danh mục khoản thu (`US14`, `US16`).
  - `loai_khoan_thu`: `BAT_BUOC` (đơn giá × m²) | `TU_NGUYEN`.
  - `trang_thai`: `HOAT_DONG` | `NGUNG_AP_DUNG`.
- `dot_dong_gop`: Đợt vận động tự nguyện (Vì người nghèo, Biển đảo...) (`US15`).
- `phi_phai_nop`: Danh sách phí phải nộp từng hộ theo kỳ (`US17`, `US21`).
  - `ky_thu`: chuỗi `YYYY-MM`, tháng `01`–`12` (CHECK `chk_ky_thu_dinh_dang`). Mỗi hộ chỉ có 1 dòng phí cho mỗi khoản thu trong mỗi kỳ.
  - `trang_thai`: `CHUA_NOP` | `NOP_THIEU` | `DA_NOP`.
- `phieu_thu`: Ghi nhận thu tiền, in phiếu thu (`US18`, `US19`, `US20`, `US22`).
  - `trang_thai`: `HOP_LE` | `DA_HUY`. Phiếu thu **không bao giờ bị xóa**, chỉ hủy mềm; phiếu `DA_HUY` bắt buộc có `ly_do_huy`.
- `chi_tiet_phieu_thu`: Các dòng tiền của một phiếu thu; hỗ trợ nộp thiếu.
  - Luôn thuộc một phiếu thu (`phieu_thu_id` NOT NULL).
  - Mỗi dòng trả cho **đúng một** nguồn: hoặc `phi_phai_nop_id` (phí bắt buộc), hoặc `dot_dong_gop_id` (đóng góp tự nguyện).

---

## 3. Hướng Dẫn Khởi Tạo CSDL Máy Local

### Bước 1: Tạo Database
Mở **pgAdmin** hoặc terminal `psql`:
```sql
CREATE DATABASE bluemoon_db WITH OWNER = postgres ENCODING = 'UTF8';
```

### Bước 2: Chạy Script SQL
Mở Query Tool trên database `bluemoon_db` và chạy lần lượt các file:
1. `database/schema.sql`: tạo extension, bảng, ràng buộc, hàm & index.
2. `database/seed.sql`: chèn dữ liệu mẫu thử nghiệm.

Hoặc dùng `psql`:
```bash
psql -U postgres -d bluemoon_db -v ON_ERROR_STOP=1 -f database/schema.sql
psql -U postgres -d bluemoon_db -v ON_ERROR_STOP=1 -f database/seed.sql
```

### Dữ liệu mẫu
- Tài khoản Admin: `admin` / `Admin@123`. Chỉ dùng cho môi trường phát triển, **đổi mật khẩu** sau lần đăng nhập đầu tiên.
- Căn hộ `12A05` (70 m²), hộ `HK-12A05` gồm 4 nhân khẩu; 2 khoản thu bắt buộc (phí dịch vụ 5.000 đ/m², phí quản lý 7.000 đ/m²).
- Toàn bộ họ tên và số CCCD là hư cấu.

### Tìm kiếm tiếng Việt không dấu
Index `idx_nhan_khau_ho_ten_trgm` hỗ trợ tìm tên không phân biệt dấu:
```sql
SELECT * FROM nhan_khau
WHERE public.immutable_unaccent(ho_ten) ILIKE '%' || public.immutable_unaccent('tuan') || '%';
```
