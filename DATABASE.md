# Tài Liệu Thiết Kế & Hướng Dẫn Cơ Sở Dữ Liệu (PostgreSQL)
**Dự án:** Phần mềm Quản lý Thu phí & Cư dân Chung cư BlueMoon (v1.0 & Roadmap v2.0)

---

## 1. Tổng Quan Kiến Trúc CSDL
- **Hệ quản trị CSDL:** PostgreSQL (v18.6)
- **Extensions bắt buộc:** `unaccent`, `pg_trgm` (hỗ trợ tìm kiếm tiếng Việt không dấu).
- **Thiết kế:** Đạt chuẩn 3NF, gồm **14 bảng chính (v1.0)** và **2 bảng mở rộng (v2.0)**.

---

## 2. Phân Nhóm Các Bảng Dữ Liệu

### Quản trị & Bảo mật (`EP01`)
- `vai_tro`: Danh sách vai trò (`ADMIN`, `KE_TOAN`, `CAN_BO_CU_DAN`, `TRUONG_BQT`).
- `tai_khoan`: Tài khoản thành viên BQT. Mật khẩu lưu dạng `bcrypt` hash (`NFR-002`). Hỗ trợ đếm lỗi & khóa tạm (`US02`).
- `nhat_ky_thao_tac`: Audit Log lưu lại mọi hành vi `INSERT/UPDATE/DELETE` dưới dạng `JSONB` (`US06`, `NFR-005`).

### Hộ Gia Đình & Nhân Khẩu (`EP02`)
- `can_ho`: Thông tin căn hộ, diện tích $m^2$ (căn cứ tính phí dịch vụ & phí quản lý).
- `ho_gia_dinh`: Quản lý hộ khẩu theo căn hộ. Mỗi căn hộ chỉ có duy nhất 1 hộ ở tại một thời điểm (`UNIQUE`).
- `nhan_khau`: Cư dân trong hộ. Mỗi hộ đúng 1 chủ hộ. Số CCCD duy nhất (trẻ em dưới 14 tuổi có thể NULL).
- `bien_dong_nhan_khau`: Lịch sử biến động (sinh mới, chuyển đi, qua đời, đổi chủ hộ) - không xóa cứng (`US10`).
- `tam_tru_tam_vang`: Quản lý tạm trú, tạm vắng tuân thủ Luật Cư trú 2020 (`US11`).

### Khoản Thu & Thu Phí (`EP03`, `EP04`, `EP05`)
- `khoan_thu`: Danh mục khoản thu bắt buộc (đơn giá $\times m^2$) và tự nguyện (`US14`, `US16`).
- `dot_dong_gop`: Đợt vận động tự nguyện (Vì người nghèo, Biển đảo...) (`US15`).
- `phi_phai_nop`: Danh sách phí phải nộp từng hộ theo tháng `YYYY-MM` (`US17`, `US21`).
- `phieu_thu` & `chi_tiet_phieu_thu`: Ghi nhận thu tiền, in phiếu thu, hỗ trợ nộp thiếu, hủy phiếu có lý do (`US18`, `US19`, `US20`, `US22`).

### Roadmap Mở Rộng v2.0 (`EP06`, `EP07`)
- `phuong_tien`: Đăng ký xe máy/ô tô theo hộ (`US27`, `US28`).
- `hoa_don_thu_ho`: Thu hộ điện, nước, internet & đối soát với nhà cung cấp (`US29`, `US30`).

---

## 3. Hướng Dẫn Khởi Tạo CSDL Máy Local

### Bước 1: Tạo Database
Mở **pgAdmin** hoặc terminal `psql`:
```sql
CREATE DATABASE bluemoon_db WITH OWNER = postgres ENCODING = 'UTF8';
Bước 2: Chạy Script SQL
Mở Query Tool trên database bluemoon_db và chạy lần lượt các file:
database/schema.sql (Tạo cấu trúc bảng, hàm & index)
database/seed.sql (Chèn dữ liệu mẫu thử nghiệm)
